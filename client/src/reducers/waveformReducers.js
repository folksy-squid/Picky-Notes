/*jshint esversion: 6 */
const defaultState = {
  playing: false,
  pos: 0,
  volume: 0.5,
  audioRate: 1
};

export default (state = {
  playing: false,
  pos: 0,
  volume: 0.5,
  audioRate: 1
}, action) => {
  switch (action.type) {
  case 'TOGGLE_PLAY':
    return {
      ...state,
      playing: !state.playing
    };
  case 'SET_POS':
    return {
      ...state,
      pos: action.pos
    };
  case 'SET_VOLUME':
    return {
      ...state,
      volume: action.volume
    };
  case 'SET_AUDIO_RATE_CHANGE':
    return {
      ...state,
      audioRate: action.audioRate
    };
  case 'START_PLAY':
    return {
      ...state,
      playing: true
    };
  default:
    return state;
  }
};
