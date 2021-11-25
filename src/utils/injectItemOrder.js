export default ({ ...list }, item, prev, next, prevKey, nextKey) => {
  if (list[prev]) {
    list[prev][nextKey] = item.id;
  }
  if (list[next]) {
    list[next][prevKey] = item.id;
  }
  return list;
};
