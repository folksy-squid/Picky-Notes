/*jshint esversion: 6 */
export const filterEntries = (input) => {
  return {
    type: 'FILTER_ENTRIES',
    input
  };
};
