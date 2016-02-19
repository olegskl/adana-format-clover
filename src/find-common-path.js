/**
 * Common filepath finder.
 * @module find-common-path
 */

/**
 * Common path reducer for use in Array.prototype.reduce.
 * @param   {Array<String>} a File path, e.g. `['src', 'foo.js'];`.
 * @param   {Array<String>} b File path, e.g. `['src', 'bar.js'];`.
 * @returns {Array<String>}   Common path, e.g. `['src']`.
 */
function commonPathReducer(a, b) {
  const result = [];
  const minLength = Math.min(a.length, b.length);
  for (let i = 0; i < minLength; i += 1) {
    if (a[i] !== b[i]) { break; }
    result.push(a[i]);
  }
  return result;
}

/**
 * Determines a common root path in the list of file paths.
 * @param   {Array<Array>}  splitFilePaths List of paths.
 * @returns {Array<String>}                Common root path.
 * @example
 *  findCommonPath([['src', 'foo.js'], ['src', 'bar.js']]); // ['src']
 */
export default function findCommonPath(splitFilePaths) {
  if (!splitFilePaths.length) { return ''; }
  return splitFilePaths.length === 1 ?
    splitFilePaths[0].slice(0, -1) :
    splitFilePaths.reduce(commonPathReducer);
}
