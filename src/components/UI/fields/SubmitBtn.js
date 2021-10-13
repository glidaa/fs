import styled from "styled-components";

const SubmitBtn = styled.input`
  padding: 15px 0;
  background-color: ${({theme})=> theme.primary};
  color: #FFFFFF !important;
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

export default SubmitBtn