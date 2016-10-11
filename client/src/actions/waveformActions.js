/*jshint esversion: 6 */
export const togglePlay = (instr) => {
  return {
    type: 'TOGGLE_PLAY',
    instr
  };
};
export const setPos = (pos) => {
  return {
    type: 'SET_POS',
    pos
  };
};
export const setVolume = (volume) => {
  return {
    type: 'SET_VOLUME',
    volume
  };
};
