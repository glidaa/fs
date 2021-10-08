import styled from "styled-components";

const SubmitBtn = styled.input`
  padding: 15px 0;
  background-color: var(--primary);
  color: #FFFFFF !important;
  border-radius: 8px;
  outline: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: var(--primary-hover);
  }
  &:disabled {
    background-color: var(--primary-disabled);
    cursor: default;
  }
`

export default SubmitBtn