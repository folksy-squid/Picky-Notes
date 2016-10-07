const defaultState = {
  playing: false,
  pos: 0,
  volume: 0.5,
  audioRate: 1,
  currentNoteSelected: 0,
  diff: 0,
  timer: null
};
export default (state = defaultState, action) => {
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
  // case 'SETS_TIMER':
  //   state.currentNoteSelected = action.nextIndex-1;
  //   console.log('triggering timer');

  //   var updateNote = function() {
  //     if (state.timer) {
  //       clearTimeout(state.timer);
  //     }
  //     state.currentNoteSelected++;
  //     action.cb(state.currentNoteSelected);
  //     state.diff = (state.audioTimestampArray[state.currentNoteSelected] - state.pos);
  //     state.pos = state.pos + state.diff;
  //     console.log('diff:', state.diff, state.pos, state.audioTimestampArray[state.currentNoteSelected]);
  //     if (state.audioTimestampArray.length > state.currentNoteSelected) {
  //       state.timer = window.setTimeout(updateNote, state.diff * 1000);
  //     }
  //   };
  //   updateNote();

  default:
    return state;
  }
};
