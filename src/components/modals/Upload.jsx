import React, { useEffect, useState } from "react";
import { useModal } from "../ModalManager";
import FileField from "../UI/fields/FileField";
import Modal from "../UI/Modal/";
import { useSelector } from "react-redux";
import styles from "./Upload.module.scss";
import upload from "../../utils/upload";
import formatSize from "../../utils/formatSize";
import ProgressBar from "../UI/ProgressBar";
import API from "../../amplify/API";
import { uploadExternal } from "../../graphql/mutations";
import { ReactComponent as YoutubeIcon } from "../../assets/brands/youtube.svg";
import { ReactComponent as VimeoIcon } from "../../assets/brands/vimeo.svg";
import { ReactComponent as LoomIcon } from "../../assets/brands/loom.svg";
import { ReactComponent as FigmaIcon } from "../../assets/brands/figma.svg";
import { ReactComponent as RedditIcon } from "../../assets/brands/reddit.svg";
import { ReactComponent as TwitterIcon } from "../../assets/brands/twitter.svg";
import { ReactComponent as IssuuIcon } from "../../assets/brands/issuu.svg";
import TextField from "../UI/fields/TextField";

const Upload = ({ importedBlobs }) => {
  
  const selectedTask = useSelector(state => state.app.selectedTask);

  const [mode, setMode] = useState(0);
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [externalError, setExternalError] = useState(null);
  const [files, setFiles] = useState([]);
  const [progress, setProgress] = useState([]);
  const [isBusy, setIsBusy] = useState(false);
  const { modalRef, hideModal } = useModal();

  const toggleMode = () => {
    setMode(mode === 0 ? 1 : 0);
  }

  const handleChangeFiles = (e) => {
    setFiles(e.target.files);
  }

  const handleChangeAttachmentUrl = ({ target: { value } }) => {
    setAttachmentUrl(value);
  }

  const handleUpload = async () => {
    setIsBusy(true);
    if (mode === 0) {
      for (let i = 0; i < files.length; i++) {
        setProgress((prevState) => [...prevState, 0]);
        const fileProgressSetter = (progress) => {
          setProgress((prevState) => {
            const stateClone = [...prevState];
            stateClone[i] = progress;
            return stateClone;
          });
        }
        await upload(files[i], selectedTask, fileProgressSetter);
      }
      setTimeout(() => {
        hideModal();
      }, 1000);
    } else {
      try {
        const urlQueryOpts = { url: attachmentUrl, taskId: selectedTask };
        await API.execute(uploadExternal, urlQueryOpts);
        hideModal();
      } catch (error) {
        setExternalError(error);
        setIsBusy(false);
      }
    }
  }

  useEffect(() => {
    if (importedBlobs) {
      setFiles(importedBlobs);
    }
  }, [importedBlobs]);

  return (
    <Modal
      title="Upload Attachments"
      primaryButtonText="Upload"
      secondaryButtonText="Cancel"
      primaryButtonDisabled={(mode === 0 ? files.length === 0 : !attachmentUrl) || isBusy}
      secondaryButtonDisabled={isBusy}
      onPrimaryButtonClick={handleUpload}
      onSecondaryButtonClick={hideModal}
      modalRef={modalRef}
    >
      {files.length ? (
        <div className={styles.FilesList}>
          {files.map((file, i) => (
            <div key={i} className={styles.FileItem}>
              <div className={styles.FileData}>
                <span className={styles.FileName}>{file.name}</span>
                {" "}
                <span className={styles.FileSize}>{formatSize(file.size)}</span>
              </div>
              {progress[i] !== undefined && (
                <ProgressBar max={100} value={progress[i]} />
              )}
            </div>
          ))}
        </div>
      ) : mode === 0 ? (
        <>
        <FileField onChange={handleChangeFiles} multiple />
          <center>
            <button className={styles.ModeChanger} onClick={toggleMode}>
              Embed external content instead
            </button>
          </center>
        </>
      ) : (
        <>
          <TextField
            type="text"
            label="Attachment URL"
            placeholder="username…"
            onChange={handleChangeAttachmentUrl}
            error={externalError}
            value={attachmentUrl}
          />
          <div className={styles.SupportedProviders}>
            <div>
              <YoutubeIcon />
              <VimeoIcon />
              <LoomIcon />
              <FigmaIcon />
              <RedditIcon />
              <TwitterIcon />
              <IssuuIcon />
            </div>
          </div>
          <center>
            <button className={styles.ModeChanger} onClick={toggleMode}>
              Upload file instead
            </button>
          </center>
        </>
      )}
    </Modal>
  );
};

export default Upload;