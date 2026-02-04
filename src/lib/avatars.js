// Avatar configuration for the freedom wall application
// Each avatar has an id, name, and path to its SVG asset
// These avatars are displayed in the Composer for selection and in PostCard

import defaultIcon from '../assets/default.svg';
import knightIcon from '../assets/knight.svg';
import wizardIcon from '../assets/wizard.svg';
import ninjaIcon from '../assets/ninja.svg';
import robotIcon from '../assets/robot.svg';
import pirateIcon from '../assets/pirate.svg';
import catIcon from '../assets/cat.svg';
import alienIcon from '../assets/alien.svg';
import ghostIcon from '../assets/ghost.svg';

// Available avatars for user selection
export const AVATARS = [
  {
    id: 'default',
    name: 'Default',
    icon: defaultIcon
  },
  {
    id: 'knight',
    name: 'Knight',
    icon: knightIcon
  },
  {
    id: 'wizard',
    name: 'Wizard',
    icon: wizardIcon
  },
  {
    id: 'ninja',
    name: 'Ninja',
    icon: ninjaIcon
  },
  {
    id: 'robot',
    name: 'Robot',
    icon: robotIcon
  },
  {
    id: 'pirate',
    name: 'Pirate',
    icon: pirateIcon
  },
  {
    id: 'cat',
    name: 'Cat',
    icon: catIcon
  },
  {
    id: 'alien',
    name: 'Alien',
    icon: alienIcon
  },
  {
    id: 'ghost',
    name: 'Ghost',
    icon: ghostIcon
  }
];

// Default avatar ID used when no avatar is selected
export const DEFAULT_AVATAR_ID = 'default';

// Helper function to get avatar by ID
// Returns the avatar object if found, otherwise returns the default avatar
export function getAvatarById(id) {
  return AVATARS.find(avatar => avatar.id === id) || AVATARS.find(avatar => avatar.id === DEFAULT_AVATAR_ID);
}

// Helper function to validate if an avatar ID exists
export function isValidAvatarId(id) {
  return AVATARS.some(avatar => avatar.id === id);
}
