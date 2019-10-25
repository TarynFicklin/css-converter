module.exports = {
  storeIndents        : str => str ? ' '.repeat(str.search(/\S/)) : '',
  isKeyValuePair      : arr => arr.length === 2,
  isSubselector       : str => str.charAt(1) === '&',
  isHeader            : str => str.slice(-2) === '({',
  convertHeader       : str => [`${str.charAt(0).toUpperCase() + str.slice(1)} = styled.div\``],
  toKebabCase         : str => str.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase(),
  removeDoubleQuotes  : str => str.replace(/['"]+/g, ''),
  convertCommas       : str => str.slice(-1) === ',' ? str.slice(0, -1) + ';' : str,
  addMissingSemicolon : str => !str.includes(';') && !str.includes('{') ? `${str};` : str,
  addFinalBacktick    : str => str.includes('})') ? '`' : str,
}