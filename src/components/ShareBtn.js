import styledComponents from "styled-components"
import shareIcon from "../assets/share-outline.svg"

const ShareBtn = (props) => {
  const { isNote } = props
  return (
    <ShareBtnCore
      alt="share button"
      src={shareIcon}
      onClick={() => {
        if (isNote) {
          const linkToBeCopied = window.location.href
          navigator.clipboard.writeText(linkToBeCopied)
        } else {
          const linkToBeCopied = window.location.href.replace(/\/\d+/, "")
          navigator.clipboard.writeText(linkToBeCopied)
        }
      }}
      width="20"
      height="20"
    />
  )
}

const ShareBtnCore = styledComponents.img`
  float: right;
  border-radius: 100%;
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #E4E4E2;
  }
`

export default ShareBtn