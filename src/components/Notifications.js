import React, { useRef, useState, useEffect, useContext } from 'react';
import { connect } from "react-redux";
import { useHistory } from 'react-router-dom';
import styled, { keyframes, ThemeContext } from "styled-components";
import * as notificationsActions from "../actions/notifications"
import { ReactComponent as CloseIcon } from "../assets/close-outline.svg"
import Avatar from './UI/Avatar';

const Notifications = (props) => {
  const {
    users,
    notifications,
    dispatch
  } = props;
  const themeContext = useContext(ThemeContext);
  const history = useHistory();
  const notificationElem = useRef(null)
  const dismissTimer = useRef(null)
  const [anim, setAnim] = useState(0)
  const openLink = (link) => link && history.push(link)
  const dismissNotification = (e) => {
    if (e) e.stopPropagation()
    clearTimeout(dismissTimer.current)
    setAnim(1)
    notificationElem.current.addEventListener("animationend", () => {
      dispatch(notificationsActions.dismiss(notifications.pushed[0]?.id))
      setAnim(0)
    })
  }
  useEffect(() => {
    clearTimeout(dismissTimer.current)
    if (notifications.pushed[0]) {
      dismissTimer.current = setTimeout(dismissNotification, 5000)
    }
  }, [notifications.pushed[0]?.id])
  return (
    <NotificationsContainer>
      {notifications.pushed[0] && (
        <NotificationShell
          key={notifications.pushed[0]}
          ref={notificationElem}
          anim={anim}
          isClickable={notifications.pushed[0].payload.link}
          onClick={() => openLink(notifications.pushed[0].payload.link)}
        >
          <NotificationContainer>
            <NotificationContent>
              <Avatar user={users[notifications.pushed[0].sender]} size={32} />
              <div>
                  {notifications.pushed[0].type === "ASSIGNMENT" && (
                    <span>
                      <b>@{notifications.pushed[0].sender} </b>
                      has assigned a task to&nbsp;
                      {notifications.pushed[0].payload.assignee ? 
                      (<b>@{notifications.pushed[0].payload.assignee}</b>) : "you"}. 
                      Tap here to review it.
                    </span>
                  )}
              </div>
            </NotificationContent>
            <NotificationCloseBtn onClick={dismissNotification}>
              <CloseIcon
                height="16"
                width="16"
                strokeWidth="32"
                color={themeContext.primary}
              />
            </NotificationCloseBtn>
          </NotificationContainer>
        </NotificationShell>
      )}
    </NotificationsContainer>
  );
};

const enteringAnim = keyframes`
from {
  margin-right: -330px;
}

to {
  margin-right: 10px;
}
`;

const exitingAnim = keyframes`
from {
  margin-right: 10px;
}

to {
  margin-right: -330px;
}
`;

const enteringAnimMobile = keyframes`
from {
  margin-top: -48px;
}

to {
  margin-top: 10px;
}
`;

const exitingAnimMobile = keyframes`
from {
  margin-top: 10px;
}

to {
  margin-top: -48px;
}
`;

const NotificationsContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  background-color: transparent;
  flex-direction: column;
  z-index: 9999999;
	@media only screen and (max-width: 768px) {
    width: 100%;
	}
`;

const NotificationShell = styled.div`
  display: flex;
  color: ${({theme})=> theme.primary};
  padding: 15px;
  width: 300px;
  margin: 10px 10px 10px 0;
  border-radius: 8px;
  position: relative;
  background-color: ${({theme})=> theme.secondaryBg};
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  animation: ${({anim}) => anim === 0 ? enteringAnim : exitingAnim} 0.4s ease-in-out forwards;
  ${({isClickable}) => isClickable ? `
    cursor: pointer;
    &:hover {
      background-color: #F2F2F2;
    }
  `: ``}
	@media only screen and (max-width: 768px) {
    width: calc(100% - 50px);
    margin: auto;
    animation: ${({anim}) => anim === 0 ? enteringAnimMobile : exitingAnimMobile} 0.4s ease-in-out forwards;
	}
`

const NotificationContainer = styled.div`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

const NotificationContent = styled.div`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  div {
    display: flex;
    flex-direction: column;
    span:nth-child(1) {
      font-size: 12px;
    }
    span:nth-child(2) {
      font-size: 14px;
    }
  }
  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

const NotificationCloseBtn = styled.button`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  border: none;
  background-color: transparent;
  & > *:not(:last-child) {
    margin-right: 10px;
  }
`

export default connect((state) => ({
  users: state.users,
  notifications: state.notifications
}))(Notifications);
