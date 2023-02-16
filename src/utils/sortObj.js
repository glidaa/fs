const sortObj = (obj, numerical = false) => {
  const result = {}
  const keys = numerical ? Object.keys(obj).map(x => parseInt(x, 10)) : Object.keys(obj);
  keys.sort(Intl.Collator().compare);
  for (const key of keys) {
    result[key] = obj[key]
  }
  return result
}

export default sortObj;
