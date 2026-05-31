import fs from "node:fs";
import path from "node:path";
import { ObjectId } from "mongodb";

const fallbackFilePath = process.env.MONGODB_FALLBACK_FILE || path.resolve(process.cwd(), ".dev-data", "mongo-fallback.json");

function serializeValue(value) {
  if (value instanceof Date) {
    return { __type: "Date", value: value.toISOString() };
  }

  if (value instanceof ObjectId) {
    return { __type: "ObjectId", value: value.toString() };
  }

  if (Array.isArray(value)) {
    return value.map(serializeValue);
  }

  if (value && typeof value === "object") {
    const serialized = {};

    for (const [key, entry] of Object.entries(value)) {
      serialized[key] = serializeValue(entry);
    }

    return serialized;
  }

  return value;
}

function deserializeValue(value) {
  if (Array.isArray(value)) {
    return value.map(deserializeValue);
  }

  if (value && typeof value === "object") {
    if (value.__type === "Date") {
      return new Date(value.value);
    }

    if (value.__type === "ObjectId") {
      return new ObjectId(value.value);
    }

    const deserialized = {};

    for (const [key, entry] of Object.entries(value)) {
      deserialized[key] = deserializeValue(entry);
    }

    return deserialized;
  }

  return value;
}

function readState() {
  try {
    const raw = fs.readFileSync(fallbackFilePath, "utf8");

    if (!raw.trim()) {
      return { collections: {} };
    }

    const parsed = JSON.parse(raw);
    return {
      collections: deserializeValue(parsed.collections || {})
    };
  } catch {
    return { collections: {} };
  }
}

function writeState(state) {
  fs.mkdirSync(path.dirname(fallbackFilePath), { recursive: true });
  fs.writeFileSync(
    fallbackFilePath,
    JSON.stringify({ collections: serializeValue(state.collections) }, null, 2),
    "utf8"
  );
}

function sameValue(left, right) {
  if (left instanceof ObjectId || right instanceof ObjectId) {
    return String(left) === String(right);
  }

  if (left instanceof Date && right instanceof Date) {
    return left.getTime() === right.getTime();
  }

  return left === right;
}

function matchesCondition(value, condition) {
  if (condition && typeof condition === "object" && !(condition instanceof Date) && !(condition instanceof ObjectId)) {
    if ("$lt" in condition) {
      return value < condition.$lt;
    }

    return Object.entries(condition).every(([key, expected]) => sameValue(value?.[key], expected));
  }

  return sameValue(value, condition);
}

function matchesFilter(doc, filter = {}) {
  if (filter.$or) {
    const { $or, ...rest } = filter;
    return Object.entries(rest).every(([key, condition]) => matchesCondition(doc[key], condition)) &&
      $or.some((subfilter) => matchesFilter(doc, subfilter));
  }

  return Object.entries(filter).every(([key, condition]) => matchesCondition(doc[key], condition));
}

function applyProjection(doc, projection) {
  if (!projection) return doc;

  const projected = {};
  const includeId = projection._id !== 0;

  if (includeId && doc._id !== undefined) {
    projected._id = doc._id;
  }

  for (const [field, include] of Object.entries(projection)) {
    if (field === "_id" || !include) continue;
    projected[field] = doc[field];
  }

  return projected;
}

function sortDocs(docs, sortSpec) {
  const entries = Object.entries(sortSpec || {});

  return [...docs].sort((left, right) => {
    for (const [field, direction] of entries) {
      const leftValue = left[field] instanceof Date ? left[field].getTime() : left[field];
      const rightValue = right[field] instanceof Date ? right[field].getTime() : right[field];

      if (leftValue < rightValue) return -1 * direction;
      if (leftValue > rightValue) return 1 * direction;
    }

    return 0;
  });
}

class MemoryCursor {
  constructor(collection, docs) {
    this.collection = collection;
    this.docs = docs;
    this.sortSpec = null;
    this.limitCount = null;
    this.projection = null;
  }

  sort(sortSpec) {
    this.sortSpec = sortSpec;
    return this;
  }

  limit(limitCount) {
    this.limitCount = limitCount;
    return this;
  }

  project(projection) {
    this.projection = projection;
    return this;
  }

  async toArray() {
    let result = this.docs;

    if (this.sortSpec) {
      result = sortDocs(result, this.sortSpec);
    }

    if (typeof this.limitCount === "number") {
      result = result.slice(0, this.limitCount);
    }

    if (this.projection) {
      result = result.map((doc) => applyProjection(doc, this.projection));
    }

    return result;
  }
}

class MemoryCollection {
  constructor(state, name) {
    this.state = state;
    this.name = name;
  }

  get storage() {
    if (!this.state.collections[this.name]) {
      this.state.collections[this.name] = [];
    }

    return this.state.collections[this.name];
  }

  async createIndex() {
    return "memory-index";
  }

  find(filter = {}) {
    return new MemoryCursor(this, this.storage.filter((doc) => matchesFilter(doc, filter)));
  }

  async findOne(filter = {}, options = {}) {
    const doc = this.storage.find((item) => matchesFilter(item, filter));
    if (!doc) return null;

    return applyProjection(doc, options.projection);
  }

  async insertOne(doc) {
    this.storage.push(doc);
    writeState(this.state);
    return { acknowledged: true, insertedId: doc._id };
  }

  async updateOne(filter = {}, update = {}) {
    const doc = this.storage.find((item) => matchesFilter(item, filter));
    if (!doc) {
      return { acknowledged: true, matchedCount: 0, modifiedCount: 0 };
    }

    let modifiedCount = 0;

    if (update.$set) {
      Object.assign(doc, update.$set);
      modifiedCount = 1;
    }

    if (update.$push) {
      for (const [field, value] of Object.entries(update.$push)) {
        if (!Array.isArray(doc[field])) {
          doc[field] = [];
        }

        doc[field].push(value);
        modifiedCount = 1;
      }
    }

    if (update.$pull) {
      for (const [field, criteria] of Object.entries(update.$pull)) {
        if (!Array.isArray(doc[field])) continue;

        const originalLength = doc[field].length;
        doc[field] = doc[field].filter((item) => !matchesFilter(item, criteria));

        if (doc[field].length !== originalLength) {
          modifiedCount = 1;
        }
      }
    }

    if (modifiedCount > 0) {
      writeState(this.state);
    }

    return { acknowledged: true, matchedCount: 1, modifiedCount };
  }
}

class MemoryDb {
  constructor() {
    this.state = readState();
  }

  collection(name) {
    return new MemoryCollection(this.state, name);
  }
}

export function createMemoryDb() {
  return new MemoryDb();
}