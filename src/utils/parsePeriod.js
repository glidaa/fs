export default (date) => {
  const currTime = Date.now();
  const timeDiff = parseInt((currTime - date) / 1000, 10);
  if (timeDiff === 0) {
    return "just now";
  } else if (timeDiff <= 60) {
    return timeDiff + " seconds ago";
  } else if (timeDiff <= 3600) {
    return parseInt(timeDiff / 60, 10) + " minutes ago";
  } else if (timeDiff <= 216000) {
    return parseInt(timeDiff / 60 / 60, 10) + " hours ago";
  } else {
    return new Date(date).toLocaleDateString();
  }
};
