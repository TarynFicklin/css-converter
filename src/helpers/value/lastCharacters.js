module.exports = val => {
  return ({
    lastChar     : val[val.length - 1],
    lastCharPos  : val.length - 1,
    lastTwoChars : `${val[val.length - 2]}${val[val.length - 1]}`
  })
}