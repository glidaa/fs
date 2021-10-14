import styled from "styled-components";

const Button = styled.button`
  padding: 15px 0;
  background-color: ${({theme})=> theme.primary};
  color: ${({theme})=> theme.secondaryBg} !important;
  border-radius: 8px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({theme})=> theme.primaryDark};
  }
  &:disabled {
    background-color: ${({theme})=> theme.primaryLight};
    cursor: default;
  }
`

export default Button