export default (list, prevKey, nextKey) => {
  const itemsArray = Object.values(list);
  const sortedArray = [];
  const firstItemArr = itemsArray.filter((x) => !x[prevKey]);
  if (firstItemArr.length === 1) {
    sortedArray.push(firstItemArr[0]);
    let nextItem = firstItemArr[0][nextKey];
    while (nextItem) {
      sortedArray.push(list[nextItem]);
      nextItem = list[nextItem][nextKey];
    }
    return sortedArray;
  } else {
    return [];
  }
};
