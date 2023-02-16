import React from "react";
import styles from "./VideoViewer.module.scss";

const LoomViewer = ({ embedId }) => (
  <div className={styles.VideoViewerShell}>
    <iframe
      className={styles.VideoContainer}
      src={`https://www.loom.com/embed/${embedId}`}
      title="YouTube video player"
      frameBorder={0}
      allowFullScreen
    />
  </div>
);

export default LoomViewer;