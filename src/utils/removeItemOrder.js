export default ({ ...list }, item, prevKey, nextKey) => {
  if (item[prevKey]) {
    list[item[prevKey]][nextKey] = item[nextKey];
  }
  if (item[nextKey]) {
    list[item[nextKey]][prevKey] = item[prevKey];
  }
  return list;
};
