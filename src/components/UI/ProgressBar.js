import React from "react"
import styled from "styled-components"

const ProgressBar = (props) => {
  const { max, value, style } = props;
  return (
    <ProgressBarContainer progress={value / max * 100} style={style}>
      <div />
    </ProgressBarContainer>
  );
}

const ProgressBarContainer = styled.div`
  background-color: ${({theme}) => theme.primaryLight};
  height: 5px;
  width: 500px;
  border-radius: 100px;
  max-width: 100%;
  & > div {
    background-color: ${({theme}) => theme.primary};
    height: 5px;
    border-radius: 100px;
    width: ${({progress}) => (progress || 0)}%;
    transition: width 0.5s linear;
  }
`

export default ProgressBar