import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styledComponents from "styled-components";
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';
import { ReactComponent as BackArrowIcon } from "../../assets/chevron-back-outline.svg";
import { ReactComponent as RemoveIcon } from "../../assets/trash-outline.svg"

const AppSettings = (props) => {
  const {
    appSettings: {
      tasksSortingCriteria
    },
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
              color="#006EFF"
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>App Settings</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color="#006EFF"
          />
        </PanelPageToolbarAction>
      </PanelPageToolbar>
      <AppSettingsForm>
        <form onSubmit={(e) => e.preventDefault()}>
          <AppSetting>
            <label htmlFor="tasksSortingCriteria">
              Sort Tasks By
            </label>
            <SelectField
                name="tasksSortingCriteria"
                onChange={handleChange}
                value={tasksSortingCriteria}
            >
              <option value="default">default</option>
              <option value="due">due date</option>
              <option value="status">status</option>
            </SelectField>
          </AppSetting>
          <NonPrefixedInputField type="submit" name="submit" value="Submit"></NonPrefixedInputField>
        </form>
      </AppSettingsForm>
    </>
  );
};

const AppSettingsForm = styledComponents(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    gap: 20px;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
  }
`;

const AppSetting = styledComponents.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 25px;
  gap: 5px;
  & > label {
    color: #222222;
    margin-bottom: 0;
    width: max-content;
    font-size: 16px;
    font-weight: 600;
  }
`

const NonPrefixedInputField = styledComponents.input`
  width: calc(100% - 20px);
  padding: 10px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  &:disabled {
    background-color: #FAFAFA;
  }
  &::placeholder {
    color: #C0C0C0;
  }
`

const SelectField = styledComponents.select`
  width: calc(100% - 20px);
  padding: 10px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  &:disabled {
    background-color: #FAFAFA;
  }
  &::placeholder {
    color: #C0C0C0;
  }
`

const PrefixedInputField = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  width: calc(100% - 20px);
  padding: 10px 10px;
  border: 1px solid #C0C0C0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  & > span {
    color: #C0C0C0;
  }
  background-color: ${({ disabled }) => disabled ? "#FAFAFA" : "transparent"};
  & > input {
    border: none;
    outline: none;
    padding: 0;
    &:disabled {
      background-color: #FAFAFA;
    }
    &::placeholder {
      color: #C0C0C0;
    }
  }
`

const PanelPageToolbar = styledComponents.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styledComponents.span`
  color: #000000;
  font-size: 18px;
  font-weight: 600;
`

const PanelPageToolbarAction = styledComponents.button`
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

const SaveSettingsBtn = styledComponents.button`
  padding: 15px 0;
  margin: 0 25px 25px 25px;
  background-color: #006EFF;
  color: #FFFFFF;
  border-radius: 8px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #0058cc;
  }
  &:disabled {
    background-color: #338bff;
  }
`

export default connect((state) => ({
  appSettings: state.appSettings
}))(AppSettings);
