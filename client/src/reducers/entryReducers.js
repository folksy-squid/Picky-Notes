const defaultState = {
  entries: []
};

export default (state=defaultState, action) => {
  if (action.type === 'FILTER_ENTRIES') {
    let input = action.input;
  }

  return {...state};
}