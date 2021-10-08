import { css } from "styled-components"
import image from "./assets/bg/blurred/opera-neon-wallpaper.png"

export const glassmorphism = (borderRadius = 0, opacity = 0.75, fallbackOpacity) => css`
  box-shadow: rgb(99 99 99 / 20%) 0px 2px 8px 0px;
  border-radius: ${borderRadius}px;
  background-color: transparent;
  position: relative;
  ::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    @supports (not (backdrop-filter: blur(10px))) {
      background-image:
        linear-gradient(
          rgba(255, 255, 255, ${fallbackOpacity || opacity}),
          rgba(255, 255, 255, ${fallbackOpacity || opacity})
        ),
        url(${image});
      background-size: cover;
      background-clip: content-box;
      background-attachment: fixed;
    }
    @supports (backdrop-filter: blur(10px)) {
      background-color: rgba(255, 255, 255, ${opacity});
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    border-radius: ${borderRadius}px;
  }
`