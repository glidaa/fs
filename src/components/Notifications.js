import React from 'react';
import { connect } from "react-redux";
import styled from "styled-components";

const Notifications = (props) => {
  const {
    notifications
  } = props;
  return (
    <NotificationsContainer>
      {notifications.map(x => (
        <NotificationShell key={x.id}>
          <NotificationContainer>
            <span>{x.title}</span>
            <span>{x.body}</span>
          </NotificationContainer>
        </NotificationShell>
      ))}
    </NotificationsContainer>
  );
};

const NotificationsContainer = styled.div`
  position: fixed;
  right: 0;
  top: 0;
  display: flex;
  background-color: transparent;
  flex-direction: column;
  z-index: 9999999;
`;

const NotificationShell = styled.div`
  display: flex;
  color: var(--primary);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 8px;
  width: 300px;
  margin: 10px 10px 10px 0;
`

const NotificationContainer = styled.div`
	display: flex;
	flex-direction: column;
`

export default connect((state) => ({
  notifications: state.notifications
}))(Notifications);
