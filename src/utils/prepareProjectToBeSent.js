export default (projectState) => {
  return {
    prevProject: projectState.prevProject,
    nextProject: projectState.nextProject,
    permalink: projectState.permalink,
    title: projectState.title
  }
}