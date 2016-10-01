/*jshint esversion: 6 */

const pathConverter = {
  '/revie': 'review',
  '/lectu': 'lecture',
  '/compi': 'compile',
  '/lobby': 'lobby'
};

export const getCurrentView = (path) => {
  path = path.slice(0, 6);
  return pathConverter[path];
};

export const getRoomCodeFromUrl = (path) => {
  return path.slice(-5);
};