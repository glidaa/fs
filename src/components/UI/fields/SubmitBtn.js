import styled from "styled-components";

const SubmitBtn = styled.input`
  padding: 14px 0;
  background-color: ${({theme})=> theme.primary};
  color: #FFFFFF !important;
  border-radius: 12px;
  font-size: 16px;
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

export default SubmitBtn