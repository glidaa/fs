const prepareProjectToBeSent = (projectState) => {
  return {
    id: projectState.id,
    rank: projectState.rank,
    permalink: projectState.permalink,
    privacy: projectState.privacy,
    permissions: projectState.permissions,
    title: projectState.title,
    statusSet: JSON.stringify(projectState.statusSet),
    defaultStatus: projectState.defaultStatus,
  };
};

export default prepareProjectToBeSent;
