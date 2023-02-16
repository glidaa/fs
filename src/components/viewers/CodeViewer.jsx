import React, { memo, useEffect } from "react";
import hljs from "highlight.js/es/common";
import styles from "./CodeViewer.module.scss";
import "highlight.js/styles/github.css";

const CodeViewer = ({ url }) => {

  const [code, setCode] = React.useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch(url);
      const text = await response.text();
      setCode(text);
    })();
  }, []);

  return (
    <div className={styles.CodeViewerShell}>
      {code && (
        <pre className={styles.CodeContainer}>
          <code className="hljs">
            <div className={styles.LineNumbers}>
              {code.split(/\r\n|\r|\n/).map((_, i) => i + 1).join(' \n')}
            </div>
            <div
              className={styles.CodeWrapper}
              dangerouslySetInnerHTML={{
                __html: hljs.highlightAuto(code).value,
              }}
            />
          </code>
        </pre>
      )}
    </div>
  );
};

export default memo(CodeViewer);
