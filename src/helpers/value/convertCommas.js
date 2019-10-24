module.exports = (val) => {
  val = val.split('')
  val[val.length - 1] === ',' && (val[val.length - 1] = ';')
  
  return val = val.join('')
}