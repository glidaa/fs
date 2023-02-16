const filterObj = ({...obj}, criteria) => Object.fromEntries(Object.entries(obj).filter(([_, x]) => criteria(x)));

export default filterObj;
