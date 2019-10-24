module.exports = val => {
  return val.replace(/['"]+/g, '')
}