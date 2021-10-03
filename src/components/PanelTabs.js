import React, { useState } from "react"
import styledComponents from "styled-components"

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



const PanelTabsShell = styledComponents.div`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const PanelTabsContainer = styledComponents.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: 5px;
  background-color: #CCE2FF;
  border-radius: 24px;
  height: fit-content;
  width: fit-content;
`

const PanelTab = styledComponents.span`
  border-radius: 24px;
  padding: 4px 15px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: center;
  ${({isSelected}) => isSelected ? `
    background-color: #006EFF;
    color: #FFFFFF;
    cursor: default;
  ` : `
    background-color: transparent;
    color: #006EFF;
    cursor: pointer;
  `}
`

export default PanelTabs