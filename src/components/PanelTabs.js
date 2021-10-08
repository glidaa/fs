import React from "react"
import styled from "styled-components"
import { glassmorphism } from "../styles"

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
  gap: 5px;
  padding: 5px;
  border: none;
  height: fit-content;
  width: fit-content;
  ${glassmorphism(24)}
`

const PanelTab = styled.span`
  border-radius: 24px;
  padding: 4px 15px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: center;
  ${({isSelected}) => isSelected ? `
    background: var(--primary-gradient);
    color: #FFFFFF;
    cursor: default;
  ` : `
    background-color: transparent;
    color: var(--primary);
    cursor: pointer;
  `}
`

export default PanelTabs