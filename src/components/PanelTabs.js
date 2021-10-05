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
  gap: 5px;
  padding: 5px;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  border: none;
  border-radius: 24px;
  height: fit-content;
  width: fit-content;
`

const PanelTab = styled.span`
  border-radius: 24px;
  padding: 4px 15px;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  justify-content: center;
  ${({isSelected}) => isSelected ? `
    background: linear-gradient(135deg, #0029ff 0%, #0092ff 100%);
    color: #FFFFFF;
    cursor: default;
  ` : `
    background-color: transparent;
    color: #006EFF;
    cursor: pointer;
  `}
`

export default PanelTabs