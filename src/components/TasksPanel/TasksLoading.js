import React, { useContext } from 'react';
import styled, { ThemeContext } from "styled-components"
import { connect } from "react-redux";
import { ReactComponent as LoadingSpinner } from "../../assets/infinity-1s-200px.svg"

const TasksLoading = (props) => {
  const themeContext = useContext(ThemeContext)
  return (
    <TasksLoadingContainer>
      <LoadingSpinner color={themeContext.primary} />
      <div>
        <span>
          Tasks are being fetched
        </span>
      </div>
    </TasksLoadingContainer>
  )
}

const TasksLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  align-items: center;
  justify-content: center;
  & > svg {
    width: 150px;
    height: auto;
  }
  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    & > span {
      font-weight: bold;
      font-size: 28px;
      color: ${({theme})=> theme.txtColor};
    }
    & > button {
      color: ${({theme})=> theme.primary};
      background-color: ${({theme})=> theme.primaryLight};
      border-radius: 8px;
      max-width: fit-content;
      outline: none;
      border: none;
      cursor: pointer;
      padding: 5px 10px;
      font-weight: 600;
      font-size: 18px;
    }
    & > *:not(:last-child) {
      margin-bottom: 40px;
    }
    & > *:not(:last-child) {
      margin-bottom: 10px;
    }
  }
  @media only screen and (max-width: 768px) {
    & > svg {
      width: 180px;
    }
    & > div {
      & > span {
        font-size: 20px;
      }
      & > button {
        font-size: 16px;
      }
    }
  }
`

export default connect((state) => ({
	user: state.user,
	app: state.app,
	projects: state.projects
}))(TasksLoading);