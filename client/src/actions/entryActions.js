/*jshint esversion: 6 */
export const filterKeyword = (search) => {
  return {
    type: 'FILTER_KEYWORD',
    search
  };
};

export const loadEntries = (lectures) => {
  return {
    type: 'LOAD_ENTRIES',
    lectures
  };
};

export const removeEntry = (index) => {
  return {
    type: 'REMOVE_ENTRY',
    index
  };
};

export const loadClassList = (cb) => {
  return {
    type: 'LOAD_CLASSLIST',
    cb
  };
};

export const filterClassList = (index, cb) => {
  return {
    type: 'FILTER_CLASSLIST',
    index,
    cb
  };
};


