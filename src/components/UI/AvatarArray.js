import React, { Fragment } from "react"
import styledComponents from "styled-components"

const AvatarArray = (props) => {
	const {
		max,
		users,
		borderColor,
		size
	} = props

	return (
		<AvatarArrayContainer max={max} size={size}>
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
		</AvatarArrayContainer>
	)
}

const AvatarArrayContainer = styledComponents.div`
	display: flex;
	align-items: center;
	min-height: ${({ size }) => size}px;
	min-width: ${({ max, size }) => size + max * (size - size * 0.42)}px;
`

const ImageAvatar = styledComponents.img`
	display: inline;
	border-radius: 100%;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-inline-end: -${({ size }) => size * 0.42}px;
	}
`

const LetterAvatar = styledComponents.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 100%;
	color: #006EFF;
	background-color: #CCE2FF;
	line-height: 0;
	font-size: ${({ size }) => size / 2.4}px;
	min-width: ${({ size }) => size}px;
	min-height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-inline-end: -${({ size }) => size * 0.42}px;
	}
`

const DumpAvatar = styledComponents.div`
	display: inline-flex;
	border-radius: 100%;
	background-color: #CCE2FF;
	min-width: ${({ size }) => size}px;
	min-height: ${({ size }) => size}px;
	width: ${({ size }) => size}px;
	height: ${({ size }) => size}px;
	border: 2px solid ${({ borderColor }) => borderColor};
	&:not(:last-child) {
		margin-inline-end: -${({ size }) => size * 0.42}px;
	}
`

export default AvatarArray