import React, { memo } from 'react';
import formatSize from '../../../utils/formatSize';
import styles from './AttachmentField.module.scss';
import { useModal } from '../../ModalManager';
import { useTabView } from '../../TabViewManager';
import { ReactComponent as RemoveIcon } from "@fluentui/svg-icons/icons/delete_24_regular.svg"
import { ReactComponent as UploadIcon } from "@fluentui/svg-icons/icons/cloud_arrow_up_16_regular.svg";
import { ReactComponent as YoutubeIcon } from "../../../assets/brands/youtube.svg";
import { ReactComponent as LoadingSpinner } from "../../../assets/Rolling-1s-200px.svg";
import { ReactComponent as VimeoIcon } from "../../../assets/brands/vimeo.svg";
import { ReactComponent as LoomIcon } from "../../../assets/brands/loom.svg";
import { ReactComponent as FigmaIcon } from "../../../assets/brands/figma.svg";
import { ReactComponent as RedditIcon } from "../../../assets/brands/reddit.svg";
import { ReactComponent as TwitterIcon } from "../../../assets/brands/twitter.svg";
import { ReactComponent as IssuuIcon } from "../../../assets/brands/issuu.svg";
import { ReactComponent as DocumentIcon } from "../../../assets/icons/icons8-document.svg";
import YoutubeViewer from '../../viewers/YoutubeViewer';
import LoomViewer from '../../viewers/LoomViewer';
import FigmaViewer from '../../viewers/FigmaViewer';
import modals from '../../modals';
import Button from '../Button';
import ShadowScroll from '../../ShadowScroll';
import Chip from '../Chip';
import CodeViewer from '../../viewers/CodeViewer';

const AttachmentField = (props) => {
  const {
    name,
    label,
    emptyMsg = "No Files Attached Yet",
    value = [],
    loading,
    readOnly,
    style
  } = props

  const { openTab } = useTabView();
  const { showModal } = useModal();

  const getIcon = (type) => {
    switch (type) {
      case 'embed/youtube':
        return YoutubeIcon;
      case 'embed/vimeo':
        return VimeoIcon;
      case 'embed/loom':
        return LoomIcon;
      case 'embed/figma':
        return FigmaIcon;
      case 'embed/reddit':
        return RedditIcon;
      case 'embed/twitter':
        return TwitterIcon;
      case 'embed/issuu':
        return IssuuIcon;
      case "text/javascript":
      case "text/plain":
      case "application/json":
      case "application/xml":
        return DocumentIcon;
      default:
        return DocumentIcon;
    }
  }

  const handleOpen = (filename, url, contentType) => {
    let tabId, embedId, title, _;
    switch (contentType) {
      case "embed/youtube":
        [_, embedId, title] = /\[(.*?)\]\((.*)\)/.exec(filename);
        tabId = `youtube-${embedId}`;
        openTab([tabId, title, YoutubeIcon, <YoutubeViewer key={tabId} embedId={embedId} />]);
        break;
      case "embed/loom":
        [_, embedId, title] = /\[(.*?)\]\((.*)\)/.exec(filename);
        tabId = `loom-${embedId}`;
        openTab([tabId, title, LoomIcon, <LoomViewer key={tabId} embedId={embedId} />]);
        break;
      case "embed/figma":
        [_, embedId, title] = /\[(.*?)\]\((.*)\)/.exec(filename);
        tabId = `figma-${embedId}`;
        openTab([tabId, title, FigmaIcon, <FigmaViewer key={tabId} embedId={embedId} />]);
        break;
      case "text/javascript":
      case "text/plain":
      case "application/json":
      case "application/xml":
        openTab([url, filename, DocumentIcon, <CodeViewer key={url} url={url} />]);
        break;
      default:
        window.open(url, '_blank');
        break;
    }
  }

  return (
    <div className={styles.AttachmentFieldShell} style={style}>
      <div className={styles.AttachmentFieldHeader}>
        {label && (
          <label htmlFor={name}>
            {label}
          </label>
        )}
        {!loading && !readOnly && (
          <Button
            sm
            secondary
            icon={UploadIcon}
            onClick={() => showModal(modals.UPLOAD)}
          />
        )}
      </div>
      {!loading ? (
        value.length ? (
          <ShadowScroll>
            {value.map((x) => (
              <Chip
                key={x.id}
                primaryLabel={
                  x.contentType.startsWith('embed/')
                    ? /\[(.*?)\]\((.*)\)/.exec(x.filename)[2]
                    : x.filename
                }
                secondaryLabel={
                  x.contentType.startsWith('embed/')
                    ? null
                    : formatSize(x.size)
                }
                avatarIcon={getIcon(x.contentType)}
                actionIcon={RemoveIcon}
                onAction={() => false}
                onClick={() => handleOpen(x.filename, x.url, x.contentType)}
                actionAllowed={!readOnly}
              />
            ))}
          </ShadowScroll>
        ) : (
          <div className={styles.NoAttachments}>
            {emptyMsg}
          </div>
        )
      ) : (
        <div className={styles.NoAttachments}>
          <LoadingSpinner width={18} height={18} />
        </div>
      )}
    </div>
  )
}

export default memo(AttachmentField);