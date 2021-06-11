import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc';
import styledComponents from "styled-components"
import { connect } from "react-redux";
import parseLinkedList from "../utils/parseLinkedList"
import handlerIcon from "../assets/apps.svg"
import TaskItem from "./TaskItem"
import NewTask from "./NewTask"
import ShareBtn from "./ShareBtn"
import ProjectNotSelected from "./ProjectNotSelected"
import * as notesActions from "../actions/notes"
import PasteBtn from './PasteBtn';

const DragHandle = sortableHandle(() => <img alt="item handler" src={handlerIcon} width="20" />);

const SortableItem = sortableElement(({index, value, readOnly}) => (
  <TaskItem
    key={index}
    item={value}
    readOnly={readOnly}
    handler={<DragHandle />}
  />
));

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>;
});

const NotesPanel = (props) => {
  const { app, notes, projects, dispatch } = props
  const onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex > newIndex) {
    const sortedNotes = parseLinkedList(notes, "prevNote", "nextNote")
      dispatch(notesActions.handleUpdateNote({
        id: sortedNotes[oldIndex].id,
        prevNote: sortedNotes[newIndex - 1]?.id || null,
        nextNote:  sortedNotes[newIndex]?.id || null,
      }))
    } else if (oldIndex < newIndex) {
      const sortedNotes = parseLinkedList(notes, "prevNote", "nextNote")
      dispatch(notesActions.handleUpdateNote({
        id: sortedNotes[oldIndex].id,
        prevNote: sortedNotes[newIndex]?.id || null,
        nextNote:  sortedNotes[newIndex + 1]?.id || null,
      }))
    }
  };
  return (
      <NotesPanelContainer>
      {app.selectedProject ? (
        <>
          <ShareBtn isNote={false} />
          {Object.keys(projects.owned).includes(app.selectedProject) && <PasteBtn />}
          <NotesTitle>
            {{...projects.owned, ...projects.assigned}[app.selectedProject].title}
          </NotesTitle>
          <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
            {parseLinkedList(notes, "prevNote", "nextNote").map((value, index) => (
              <SortableItem
                key={value.id}
                index={index}
                value={value}
                readOnly={!Object.keys(projects.owned).includes(app.selectedProject)}
              />
            ))}
          </SortableContainer>
          {Object.keys(projects.owned).includes(app.selectedProject) && <NewTask />}
        </>
      ) : (
        <ProjectNotSelected />
      )}
      </NotesPanelContainer>
    )
}

const NotesPanelContainer = styledComponents.div`
  flex: 3;
  padding: 40px;
  overflow: auto;
  max-height: calc(100vh - 80px);
`

const NotesTitle = styledComponents.div`
  font-weight: 600;
  margin: 0 8px 20px 8px;
  font-size: 2em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`

export default connect((state) => ({
  notes: state.notes,
  app: state.app,
  projects: state.projects
}))(NotesPanel);