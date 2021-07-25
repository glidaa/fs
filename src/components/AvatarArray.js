import React from "react"
import styledComponents from "styled-components"

const AvatarArray = (props) => {
    const {
        borderColor,
        size
    } = props
    return (
        <AvatarArrayContainer>
            <ImageAvatar borderColor={borderColor} size={size} src="https://i.pravatar.cc/38?img=2" />
            <ImageAvatar borderColor={borderColor} size={size} src="https://i.pravatar.cc/38?img=3" />
            <ImageAvatar borderColor={borderColor} size={size} src="https://i.pravatar.cc/38?img=4" />
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

export default AvatarArray