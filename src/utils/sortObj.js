export default (obj) => {
  const result = {}
  const keys = Object.keys(obj)
  keys.sort()
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}