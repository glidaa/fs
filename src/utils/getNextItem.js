const getNextItem = (rank, list) => {
  list = Array.isArray(list) ? [...list] : Object.values(list);
  list.sort((a, b) => (a.rank < b.rank ? -1 : 1));
  return list[list.findIndex((x) => x.rank === rank) + 1];
};

export default getNextItem;
