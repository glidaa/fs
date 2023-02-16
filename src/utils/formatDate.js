const formatDate = (date) => {
  const dateInstance = new Date(date)
  return dateInstance.getDate() + " " +
  dateInstance.toLocaleString('en-us', { month: "short", year: "numeric" })
}

export default formatDate;
