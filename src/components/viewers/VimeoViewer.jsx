import React from "react";
import styles from "./VideoViewer.module.scss";

const VimeoViewer = ({ embedId }) => (
  <div className={styles.VideoViewerShell}>
    <iframe
      className={styles.VideoContainer}
      src={`https://player.vimeo.com/video/${embedId}?h=fcd828adaf`}
      width={1600}
      height={900}
      frameBorder={0}
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export default VimeoViewer;