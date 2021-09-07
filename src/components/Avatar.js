import React from 'react';
import styledComponents from "styled-components";

const Avatar = (props) => {
  const { fullName } = props
  return (
    <AvatarContainer>
      {fullName.split(" ")[0][0].toUpperCase() +
      fullName.split(" ")[1][0].toUpperCase()}
    </AvatarContainer>
  )
}

const AvatarContainer = styledComponents.div`
  border-radius: 100%;
  background-color: #FF93AF;
  color: #6B001D;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  min-height: 32px;
  width: 32px;
  height: 32px;
`

export default Avatar