import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from "react-sortable-hoc";
import styledComponents from "styled-components";
import { connect } from "react-redux";
import parseLinkedList from "../utils/parseLinkedList";
import handlerIcon from "../assets/apps.svg";
import TaskItem from "./TaskItem";
import NewTask from "./NewTask";
import ShareBtn from "./ShareBtn";
import ProjectNotSelected from "./ProjectNotSelected";
import * as notesActions from "../actions/notes";
import PasteBtn from "./PasteBtn";
import * as projectsActions from "../actions/projects";
import { initProjectState, OK, PENDING, initNoteState } from "../constants";
import useWindowSize from "../utils/useWindowSize";

const DragHandle = sortableHandle(() => (
  <img className="drag-icon" alt="item handler" src={handlerIcon} width="20" />
));

const SortableItem = sortableElement(
  ({ index, value, readOnly, setHideShowSidePanel }) => (
    <TaskItem
      key={index}
      item={value}
      readOnly={readOnly}
      setHideShowSidePanel={setHideShowSidePanel}
      handler={<DragHandle />}
    />
  )
);

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>;
});

const NotesPanel = (props) => {
  const {
    app,
    notes,
    projects,
    dispatch,
    setHideShowProjectPanel,
    setHideShowSidePanel,
  } = props;
  let { width } = useWindowSize();
  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex > newIndex) {
      const sortedNotes = parseLinkedList(notes, "prevNote", "nextNote");
      dispatch(
        notesActions.handleUpdateNote({
          id: sortedNotes[oldIndex].id,
          prevNote: sortedNotes[newIndex - 1]?.id || null,
          nextNote: sortedNotes[newIndex]?.id || null,
        })
      );
    } else if (oldIndex < newIndex) {
      const sortedNotes = parseLinkedList(notes, "prevNote", "nextNote");
      dispatch(
        notesActions.handleUpdateNote({
          id: sortedNotes[oldIndex].id,
          prevNote: sortedNotes[newIndex]?.id || null,
          nextNote: sortedNotes[newIndex + 1]?.id || null,
        })
      );
    }
  };
  return (
    <NotesPanelContainer
      name="NotesPanelContainer"
      onClick={(e) => {
        e.target.getAttribute("name") === "NotesPanelContainer" &&
          Object.keys(projects.owned).includes(app.selectedProject) &&
          app.noteAddingStatus === OK &&
          dispatch(
            notesActions.handleCreateNote(
              initNoteState(
                app.selectedProject,
                parseLinkedList(notes, "prevNote", "nextNote").reverse()[0]?.id
              )
            )
          );
      }}
    >
      {app.selectedProject ? (
        <>
          <ShareBtn isNote={false} />
          <Button onClick={() => setHideShowProjectPanel()}>
            {"< Projects "}
          </Button>
          {Object.keys(projects.owned).includes(app.selectedProject) && (
            <PasteBtn />
          )}
          <NotesTitle>
            {
              { ...projects.owned, ...projects.assigned }[app.selectedProject]
                .title
            }
          </NotesTitle>
          <SortableContainer onSortEnd={onSortEnd} lockAxis="y" useDragHandle>
            {parseLinkedList(notes, "prevNote", "nextNote").map(
              (value, index) => (
                <SortableItem
                  key={value.id}
                  index={index}
                  value={value}
                  setHideShowSidePanel={setHideShowSidePanel}
                  readOnly={
                    !Object.keys(projects.owned).includes(app.selectedProject)
                  }
                />
              )
            )}
          </SortableContainer>
        </>
      ) : (
        <>
          <ProjectNotSelected />
          {width <= 768 && (
            <ProjectAdder isInactive={app.projectAddingStatus === PENDING}>
              <span
                onClick={() =>
                  app.projectAddingStatus === OK &&
                  dispatch(
                    projectsActions.handleCreateProject(
                      initProjectState(
                        parseLinkedList(
                          projects["owned"],
                          "prevProject",
                          "nextProject"
                        ).reverse()[0]?.id
                      )
                    )
                  )
                }
              >
                +
              </span>
            </ProjectAdder>
          )}
        </>
      )}
    </NotesPanelContainer>
  );
};

const NotesPanelContainer = styledComponents.div`
  flex: 3;
  padding: 40px;
  overflow: auto;
  max-height: calc(100vh - 80px);
`;

const NotesTitle = styledComponents.div`
  font-weight: 600;
  margin: 0 8px 20px 8px;
  font-size: 2em;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
`;

const Button = styledComponents.button`
background: none;
border: none;
font-size: 14px;
font-weight: 600;
display: none;
@media only screen and (max-width: 768px) {
display: block;
}
`;

const ProjectAdder = styledComponents.div`
	& > span {
		height: 20px;
		float: right;
		font-size: 1.5em;
		width: 20px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px;
		border-radius: 4px;
		font-weight: bold;
		transition: background-color 0.3s;
		${({ isInactive }) =>
      isInactive
        ? `
		color: #D3D3D3;
		`
        : `
		cursor: pointer;
		color: #222222;
		&:hover {
			background-color: #E4E4E2;
		}
	`}
	}
`;

export default connect((state) => ({
  notes: state.notes,
  app: state.app,
  projects: state.projects,
}))(NotesPanel);
