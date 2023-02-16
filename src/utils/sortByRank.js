const sortAscFn = (a, b) => (a.rank < b.rank ? -1 : 1);
const sortDescFn = (a, b) => (a.rank > b.rank ? -1 : 1);

const sortByRank = (list, desc = false) => {
  list = Array.isArray(list) ? [...list] : Object.values(list);
  return list.sort(desc ? sortDescFn : sortAscFn);
};

export default sortByRank;
