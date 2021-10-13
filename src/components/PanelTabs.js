import React from "react"
import styled from "styled-components"

const PanelTabs = (props) => {
  const {
      tabs,
      value,
      onChange
  } = props

  return (
    <PanelTabsShell>
      <PanelTabsContainer>
        {tabs.map(x => (
          <PanelTab
            key={x[0]}
            isSelected={value === x[0]}
            onClick={() => value !== x[0] && onChange(x[0])}
          >
            {x[1]}
          </PanelTab>
        ))}
      </PanelTabsContainer>
    </PanelTabsShell>
  )
}

const PanelTabsShell = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PanelTabsContainer = styled.div`
  display: flex;
  flex-direction: row;
  padding: 5px;
  border: none;
  height: fit-content;
  width: fit-content;
  border-radius: 24px;
  background-color: #CCE2FF;
  position: relative;
  & > *:not(:last-child) {
    margin-right: 5px;
  }
`

const PanelTab = styled.span`
  border-radius: 24px;
  padding: 4px 15px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: center;
  ${({isSelected}) => isSelected ? `
    background: ${({theme})=> theme.primary};
    color: #FFFFFF;
    cursor: default;
  ` : `
    background-color: transparent;
    color: ${({theme})=> theme.primary};
    cursor: pointer;
  `}
`

export default PanelTabs