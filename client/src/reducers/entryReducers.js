const defaultState = {
  entries: [],
  classList: [],
  original: [],
  selectedClass: 'All'
};

export default (state = defaultState, action) => {

  if (action.type === 'LOAD_ENTRIES') {
    state.entries = action.lectures;
    state.original = action.lectures;
    return {...state};
  }

  if (action.type === 'REMOVE_ENTRY') {
    let i = action.index;
    let newEntries = state.entries.slice();
    newEntries.splice(i, 1);
    state.entries = newEntries;
    return {...state};
  }

  if (action.type === 'FILTER_KEYWORD') {
    let search = action.search;
    let filtered = [];
    state.original.forEach(notebook => {
      if (notebook.topic.toLowerCase().indexOf(search.toLowerCase()) === -1 && notebook.lecturer.toLowerCase().indexOf(search.toLowerCase()) === -1) { return; }
      if (notebook.className === state.selectedClass || state.selectedClass === 'All') {
        filtered.push(notebook);
      }
    });
    return {
      ...state,
      entries: filtered
    };
  }

  if (action.type === 'LOAD_CLASSLIST') {
    let classHash = {};
    for (var i = 0; i < state.entries.length; i++) {
      let className = state.entries[i].className;
      classHash[className] = className;
    }
    for (let key in classHash) {
      state.classList.push(classHash[key]);
    }
    return {
      ...state
    };
  }


  if (action.type === 'FILTER_CLASSLIST') {
    let index = Number(action.index.toString().slice(2)) - 1;
    let className = index > 0 ? state.classList[index] : 'All';

    let filteredEntries = (className === 'All') ? state.original : state.original.filter(entry => entry.class.toLowerCase() === className.toLowerCase());
    state.entries = filteredEntries;
    state.selectedClass = className;
    return {
      ...state
    };
  }

  return {...state};
};
