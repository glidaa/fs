import React from 'react';
import styledComponents from "styled-components";

const Avatar = (props) => {
  const { 
    size,
    user: {
      avatar,
      abbr,
      name
    },
    circular
   } = props
  return avatar ?
    <ImageAvatar size={size} src={avatar} isCircular={circular} /> :
    <LetterAvatar size={size} isCircular={circular}>{abbr || name[0]}</LetterAvatar>
}

const ImageAvatar = styledComponents.img`
	display: inline;
  border-radius: ${({isCircular, size}) => isCircular ? "100%" : `${0.315 * size}px`};
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
`

const LetterAvatar = styledComponents.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	color: #006EFF;
	background-color: #CCE2FF;
	line-height: 0;
  border-radius: ${({isCircular, size}) => isCircular ? "100%" : `${0.315 * size}px`};
	font-size: ${({ size }) => size / 2.4}px;
	min-width: ${({ size }) => size}px;
	min-height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
`

export default Avatar