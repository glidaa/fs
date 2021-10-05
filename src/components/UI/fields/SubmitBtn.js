import styled from "styled-components";

const SubmitBtn = styled.input`
  padding: 15px 0;
  background-color: #006EFF;
  color: #FFFFFF !important;
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
    cursor: default;
  }
`

export default SubmitBtn