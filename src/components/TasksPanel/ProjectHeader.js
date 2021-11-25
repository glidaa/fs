import React from "react"
import { AuthState } from '../../constants';
import { connect } from "react-redux";
import useWindowSize from "../../utils/useWindowSize";
import AvatarGroup from "../UI/AvatarGroup";
import styles from "./ProjectHeader.module.scss"
import ProjectTitle from "./ProjectTitle"

const ProjectHeader = (props) => {
  const {
    app: {
      isSynced
    },
    user,
    users,
    collaboration
  } = props
  const { width } = useWindowSize();
  return (
    <div className={styles.ProjectHeader}>
      <ProjectTitle />
      {(isSynced && user.state === AuthState.SignedIn) && (
        <AvatarGroup
          max={4}
          users={collaboration.projectViewers.map(user => users[user])}
          size={ width > 768 ? 34 : 24 }
        />
      )}
    </div>
  )
}

export default connect((state) => ({
  user: state.user,
  app: state.app,
  users: state.users,
  collaboration: state.collaboration
}))(ProjectHeader);