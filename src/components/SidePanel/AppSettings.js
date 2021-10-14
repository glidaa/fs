import React, { useContext } from 'react';
import { connect } from "react-redux";
import * as appActions from "../../actions/app";
import * as appSettingsActions from "../../actions/appSettings";
import styled, { ThemeContext } from "styled-components";
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

  const themeContext = useContext(ThemeContext);

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
              color={themeContext.primary}
          />
        </PanelPageToolbarAction>
        <PanelPageTitle>App Settings</PanelPageTitle>
        <PanelPageToolbarAction onClick={removeProject}>
          <RemoveIcon
              width={24}
              height={24}
              strokeWidth={32}
              color={themeContext.primary}
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
              <option value="BY_DEFAULT">default</option>
              <option value="BY_DUE">due date</option>
              <option value="BY_STATUS">status</option>
            </SelectField>
          </AppSetting>
          <NonPrefixedInputField type="submit" name="submit" value="Submit"></NonPrefixedInputField>
        </form>
      </AppSettingsForm>
    </>
  );
};

const AppSettingsForm = styled(SimpleBar)`
  flex: 1;
  overflow: auto;
  height: 0;
  min-height: 0;
  & .simplebar-content > form {
    display: flex;
    flex-direction: column;
    & > h2 > span {
      cursor: pointer;
    }
    & > input[type="submit"] {
      display: none;
    }
    & > *:not(:last-child) {
      margin-bottom: 20px;
    }
  }
`;

const AppSetting = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  margin: 0 25px;
  & > label {
    color: ${({theme})=> theme.txtColor};
    margin-bottom: 0;
    width: max-content;
    font-size: 16px;
    font-weight: 600;
  }
  & > *:not(:last-child) {
    margin-bottom: 5px;
  }
`

const NonPrefixedInputField = styled.input`
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

const SelectField = styled.select`
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

const PanelPageToolbar = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 25px;
  padding-top: 25px;
`

const PanelPageTitle = styled.span`
  color: ${({theme})=> theme.txtColor};
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

export default connect((state) => ({
  appSettings: state.appSettings
}))(AppSettings);
