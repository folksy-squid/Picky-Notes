/*jshint esversion: 6 */
export const togglePlay = () => {
  return {
    type: 'TOGGLE_PLAY'
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
export const setAudioRateChange = (audioRate) => {
  return {
    type: 'SET_AUDIO_RATE_CHANGE',
    audioRate
  };
};

export const play = () => {
  return {
    type: 'START_PLAY'
  };
};
