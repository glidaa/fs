import { v4 as uuidv4 } from 'uuid';

export default (noteState, projectID, prevNote = null, nextNote = null) => {
  return {
    id: uuidv4(),
    projectID: projectID,
    prevNote: prevNote,
    nextNote: nextNote,
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