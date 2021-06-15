export default (noteState) => {
  return {
    projectID: noteState.projectID,
    prevNote: noteState.prevNote,
    nextNote: noteState.nextNote,
    note: noteState.note,
    isDone: noteState.isDone,
    task: noteState.task,
    description: noteState.description,
    steps: noteState.steps,
    due: noteState.due,
    watcher: noteState.watcher,
    tag: noteState.tag,
    sprint: noteState.sprint,
    status: noteState.status
  }
}