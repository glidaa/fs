const getNextItem = (items, currentItem) => {
  const currentIndex = items.indexOf(currentItem);
  const nextIndex = currentIndex + 1;
  const previousIndex = currentIndex - 1;
  return items[nextIndex] || items[previousIndex] || null;
}

const getPreviousItem = (items, currentItem) => {
  const currentIndex = items.indexOf(currentItem);
  const nextIndex = currentIndex + 1;
  const previousIndex = currentIndex - 1;
  return items[previousIndex] || items[nextIndex] || null;
}

export { getNextItem, getPreviousItem };