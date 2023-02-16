import React, { useEffect, useRef, useState } from 'react';
import styles from "./FileField.module.scss"
import { ReactComponent as UploadIllustration } from "../../../assets/undraw_add_files_re_v09g.svg";

const FileField = (props) => {

  const {
    name,
    multiple,
    onChange
  } = props;

  const [inDropZone, setInDropZone] = useState(false);
  const [fileList, setFileList] = useState([]);
  const inputFile = useRef(null);

  const handleDragEnter = (event) => {
    event.preventDefault();
    setInDropZone(true);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setInDropZone(true);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = event.dataTransfer ?
      [...event.dataTransfer.files] :
      [...event.target.files];
    if (files) {
      setFileList(multiple ? fileList.concat(files) : files);
      setInDropZone(false);
    }
  };

  useEffect(() => {
    const result = [];
    for (const file of fileList) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        const blob = new Blob([reader.result], { type: file.type });
        blob["name"] = file.name;
        result.push(blob);
        if (onChange && result.length === fileList.length) {
          onChange({
            target: {
              files: result,
              name: name,
            },
          });
        }
      };
    }
  }, [fileList]);

  return (
    <div
      className={[
        styles.FileFieldContainer,
        "noselect"
      ].join(" ")}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onClick={() => inputFile.current.click()}
    >
      <div>
        <div className={styles.FieldLabel}>
          <UploadIllustration width={150} height={150} />
          <span>Drag and drop file here</span>
          <span>or click to select file</span>
        </div>
      </div>
      <input
        name={name}
        type='file'
        ref={inputFile}
        onChange={handleDrop}
        multiple={multiple}
      />
    </div>
  );
}

export default FileField;