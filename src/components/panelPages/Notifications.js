import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styled from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as CloseIcon } from "../../assets/close-outline.svg"
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"
import Avatar from '../UI/Avatar';

const Notifications = (props) => {
  const {
    notifications,
    users,
    dispatch
  } = props;

  const handleChange = (e) => {
    switch (e.target.name) {
      case "theme":
        dispatch(appSettingsActions.handleSetTheme(e.target.value))
        break
      case "tasksSortingCriteria":
        dispatch(appSettingsActions.handleSetTasksSortingCriteria(e.target.value))
        break
      default:
        break
    }
  }

  const closePanel = () => {
    return dispatch(appActions.handleSetLeftPanel(false))
  }
  const removeProject = () => {
    
  }
  return (
    <>
      <PanelPageToolbar>
        <PanelPageToolbarAction onClick={closePanel}>
          <BackArrowIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="var(--primary)"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Notifications</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="var(--primary)"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <NotificationsForm>
        {Object.values(notifications.stored).map(x => (
          <NotificationShell
            key={x.id}
            isClickable={x.payload.link}
          >
            <NotificationContainer>
              <NotificationContent>
                <Avatar user={users.GeeekyBoy} size={32} />
                <div>
                  <span>
                    <b>@{x.payload.assigner} </b>
                    has assigned a task to you. 
                    Tap here to review it.
                  </span>
                  <span>05:30pm</span>
                </div>
              </NotificationContent>
              <NotificationCloseBtn>
                <CloseIcon
                  height="16"
                  width="16"
                  strokeWidth="32"
                  color="var(--primary)"
                />
              </NotificationCloseBtn>
            </NotificationContainer>
          </NotificationShell>
        ))}
      </NotificationsForm>
    </>
  );
};

const NotificationsForm = styled(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content {
    display: flex;
    flex-direction: column;
    gap: 15px;
    align-items: center;
  }
`;

const PanelPageToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styled.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  outline: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  cursor: pointer;
`

const NotificationShell = styled.div`
  position: relative;
  display: flex;
  color: var(--primary);
  padding: 15px;
  width: calc(100% - 80px);
  margin: 0 25px;
  border-radius: 8px;
  background-color: #FFFFFF;
  ${({isClickable}) => isClickable ? `
    cursor: pointer;
    &:hover {
      background-color: rgba(255, 255, 255, 0.90);
    }
  `: ``}
`

const NotificationContainer = styled.div`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
`

const NotificationContent = styled.div`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  div {
    display: flex;
    flex-direction: column;
    span:nth-child(1) {
      font-size: 12px;
    }
    span:nth-child(2) {
      font-size: 10px;
    }
  }
`

const NotificationCloseBtn = styled.button`
	display: flex;
	flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  border: none;
  background-color: transparent;
`

export default connect((state) => ({
  notifications: state.notifications,
  users: state.users
}))(Notifications);
