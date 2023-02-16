import React from "react";
import styles from "./VideoViewer.module.scss";

const FigmaViewer = ({ embedId }) => (
  <div className={styles.VideoViewerShell}>
    <iframe
      className={styles.VideoContainer}
      src={`https://www.figma.com/embed?embed_host=astra&url=https://www.figma.com/file/${decodeURIComponent(embedId)}`}
      title="YouTube video player"
      frameBorder={0}
      allowFullScreen
    />
  </div>
);

export default FigmaViewer;