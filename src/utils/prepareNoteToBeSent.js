export default (noteState) => {
  return {
    projectID: noteState.projectID,
    prevNote: noteState.prevNote,
    nextNote: noteState.nextNote,
    task: noteState.task,
    description: noteState.description,
    due: noteState.due,
    tags: noteState.tags,
    status: noteState.status
  }
}