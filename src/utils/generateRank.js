const generateRank = (rank1 = 0, rank2 = Number.MAX_SAFE_INTEGER / 2) => {
  if (rank1 > rank2) {
    const temp = rank1;
    rank1 = rank2;
    rank2 = temp;
  }
  return (rank1 + rank2) / 2;
};

export default generateRank;
