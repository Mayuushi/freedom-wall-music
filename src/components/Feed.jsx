import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import PostCard from "./PostCard";
import ExpandedPost from "./ExpandedPost";
import { useTheme } from "../contexts/ThemeContext";

// Page-based feed with pagination.
// Performance best practice:
// - request smaller pages (6 posts per page)
// - numbered pagination for better navigation
// - keep payload small via backend projection

export default function Feed({ refreshKey }) {
  const [allItems, setAllItems] = useState([]); // Store all fetched posts
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [expandedPost, setExpandedPost] = useState(null); // Track which post is expanded

  // Access theme
  const { theme } = useTheme();

  const postsPerPage = 6;

  // Load all posts initially
  async function loadAllPosts() {
    setErr("");
    setLoading(true);

    try {
      let allPosts = [];
      let nextCursor = null;
      
      // Fetch all posts by following cursor pagination
      do {
        const url = nextCursor 
          ? `/api/posts?limit=50&cursor=${encodeURIComponent(nextCursor)}`
          : `/api/posts?limit=50`;
        
        const data = await apiFetch(url);
        allPosts = [...allPosts, ...(data.items || [])];
        nextCursor = data.nextCursor;
      } while (nextCursor);

      setAllItems(allPosts);
      setHasMore(allPosts.length > postsPerPage);
      setCurrentPage(1); // Reset to first page
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey]);

  // Calculate pagination values
  const totalPages = Math.ceil(allItems.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allItems.slice(startIndex, endIndex);

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page neighbors, and last page
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const handlePageChange = (page) => {
    if (typeof page === 'number' && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      // Scroll to top of feed
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  /**
   * Handle post expansion - open modal with full post details
   */
  const handleExpandPost = (post) => {
    setExpandedPost(post);
  };

  /**
   * Handle post update from ExpandedPost component
   * Updates the post in allItems array when reactions/comments are added
   */
  const handlePostUpdate = (updatedPost) => {
    setAllItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedPost._id ? updatedPost : item
      )
    );
  };

  return (
    <div>
      {/* Feed header with refresh button */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 24
        }}
      >
        <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: theme.textPrimary }}>
          Public Wall
        </h3>
        <button
          type="button"
          onClick={loadAllPosts}
          disabled={loading}
          style={{
            padding: "8px 16px",
            borderRadius: 18,
            border: `1px solid ${theme.borderLight}`,
            background: theme.surface,
            color: theme.textPrimary,
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            transition: "background 0.2s"
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.background = theme.surfaceHover;
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.background = theme.surface;
          }}
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
        {allItems.length > 0 && (
          <span style={{ marginLeft: "auto", fontSize: 13, color: theme.textSecondary }}>
            Showing {startIndex + 1}-{Math.min(endIndex, allItems.length)} of {allItems.length}
          </span>
        )}
      </div>

      {/* Error display */}
      {err ? (
        <div
          style={{
            color: theme.danger,
            background: theme.dangerBg,
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14
          }}
        >
          {err}
        </div>
      ) : null}

      {/* Grid container for posts - YouTube style responsive grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: 16,
          marginBottom: 24
        }}
      >
        {currentPosts.map((p) => (
          <PostCard key={p._id} post={p} onExpand={handleExpandPost} />
        ))}
      </div>

      {/* Empty state when no posts and not loading */}
      {!loading && allItems.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: 48,
            color: theme.textSecondary,
            fontSize: 14
          }}
        >
          No posts yet. Be the first to share!
        </div>
      )}

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 8,
            marginTop: 32,
            flexWrap: "wrap"
          }}
        >
          {/* Page numbers */}
          {getPageNumbers().map((page, index) => (
            page === '...' ? (
              <span
                key={`ellipsis-${index}`}
                style={{
                  padding: "8px 4px",
                  color: theme.textSecondary
                }}
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                type="button"
                onClick={() => handlePageChange(page)}
                style={{
                  padding: "8px 12px",
                  borderRadius: 4,
                  border: currentPage === page ? "none" : `1px solid ${theme.borderLight}`,
                  background: currentPage === page ? theme.primary : theme.surface,
                  color: currentPage === page ? "white" : theme.textPrimary,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: currentPage === page ? 600 : 500,
                  minWidth: 40,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  if (currentPage !== page) {
                    e.target.style.background = theme.surfaceHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPage !== page) {
                    e.target.style.background = theme.surface;
                  }
                }}
              >
                {page}
              </button>
            )
          ))}
        </div>
      )}

      {/* Expanded post modal */}
      {expandedPost && (
        <ExpandedPost
          post={expandedPost}
          onClose={() => setExpandedPost(null)}
          onUpdate={handlePostUpdate}
        />
      )}
    </div>
  );
}