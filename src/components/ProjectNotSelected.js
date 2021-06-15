import styledComponents from "styled-components"
import notesIllustartions from "../assets/undraw_Add_notes_re_ln36.svg"

const ProjectNotSelected = () => {
  return (
    <ProjectNotSelectedContainer>
      <img alt="Notes Illustration" src={notesIllustartions} />
      <span>Select A Project To Get Started</span>
    </ProjectNotSelectedContainer>
  )
}

const ProjectNotSelectedContainer = styledComponents.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  gap: 40px;
  & > img {
    width: 50%;
  }
  & > span {
    font-weight: bold;
    font-size: 1.2em;
    color: #222222;
  }
`

export default ProjectNotSelected