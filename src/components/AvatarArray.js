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
        <AvatarArrayContainer>
            {users.slice(0, users.length > max ? max - 1 : max).map(({ avatar, firstName, lastName }, i) => (
                <Fragment key={i}>
                    {avatar ?
                        <ImageAvatar borderColor={borderColor} size={size} src={avatar} /> :
                        <LetterAvatar borderColor={borderColor} size={size}>{(firstName[0] + lastName[0]).toUpperCase()}</LetterAvatar>
                    }
                </Fragment>
            ))}
            {users.length > max && <LetterAvatar borderColor={borderColor} size={size}>+{users.length - max + 1}</LetterAvatar>}
        </AvatarArrayContainer>
    )
}

const AvatarArrayContainer = styledComponents.div`
    display: flex;
    align-items: center;
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
    background-color: #FF93AF;
    color: #6B001D;
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

export default AvatarArray