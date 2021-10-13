import React, { useContext } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styled, { ThemeContext } from "styled-components";
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

  const themeContext = useContext(ThemeContext);

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
              color={themeContext.primary}
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>Notifications</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={themeContext.primary}
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
                  color={themeContext.primary}
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
    align-items: center;
    & > *:not(:last-child) {
      margin-bottom: 15px;
    }
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
  color: #222222;
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
  color: ${({theme})=> theme.primary};
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
      font-size: 10px;
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
  notifications: state.notifications,
  users: state.users
}))(Notifications);
