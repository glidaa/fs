import React, { Fragment } from "react"
import styled from "styled-components"

const AvatarGroup = (props) => {
	const {
		max,
		users,
		borderColor,
		size
	} = props

	return (
		<AvatarGroupContainer max={max} size={size}>
			{users.slice(0, users.length > max ? max - 1 : max).map(({ avatar, abbr, name }, i) => (
				<Fragment key={i}>
					{avatar ?
						<ImageAvatar borderColor={borderColor} size={size} src={avatar} /> :
						<LetterAvatar borderColor={borderColor} size={size}>{abbr || name[0]}</LetterAvatar>
					}
				</Fragment>
			))}
			{users.length <= max && new Array(max - users.length).fill(0).map((_, i) => (
				<DumpAvatar key={i} borderColor={borderColor} size={size} />
			))}
			{users.length > max && <LetterAvatar borderColor={borderColor} size={size}>+{users.length - max + 1}</LetterAvatar>}
		</AvatarGroupContainer>
	)
}

const AvatarGroupContainer = styled.div`
	display: flex;
	align-items: center;
	min-height: ${({ size }) => size}px;
	min-width: ${({ max, size }) => size + max * (size - size * 0.42)}px;
`

const ImageAvatar = styled.img`
	display: inline;
	border-radius: 100%;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-right: -${({ size }) => size * 0.42}px;
	}
`

const LetterAvatar = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	color: ${({theme})=> theme.primary};
	background-color: ${({theme})=> theme.primaryLight};
	line-height: 0;
	font-size: ${({ size }) => size / 2.4}px;
	min-width: ${({ size }) => size}px;
	min-height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-right: -${({ size }) => size * 0.42}px;
	}
`

const DumpAvatar = styled.div`
	display: inline-flex;
	border-radius: 100%;
	background-color: ${({theme})=> theme.primaryLight};
	min-width: ${({ size }) => size}px;
	min-height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-right: -${({ size }) => size * 0.42}px;
	}
`

export default AvatarGroup