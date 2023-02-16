import React from "react";
import styles from "./VideoViewer.module.scss";

const YoutubeViewer = ({ embedId }) => (
  <div className={styles.VideoViewerShell}>
    <iframe
      className={styles.VideoContainer}
      src={`https://www.youtube.com/embed/${embedId}`}
      title="YouTube video player"
      frameBorder={0}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  </div>
);

export default YoutubeViewer;