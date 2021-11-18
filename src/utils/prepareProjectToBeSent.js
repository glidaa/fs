export default (projectState) => {
  return {
    id: projectState.id,
    prevProject: projectState.prevProject,
    nextProject: projectState.nextProject,
    permalink: projectState.permalink,
    privacy: projectState.privacy,
    permissions: projectState.permissions,
    members: projectState.members,
    title: projectState.title,
  };
};
