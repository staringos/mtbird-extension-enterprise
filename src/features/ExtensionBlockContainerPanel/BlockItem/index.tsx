import { IExtensionContext } from "@mtbird/shared";
import { IComponentInstance } from "@mtbird/shared/dist/types/types/Component";
import React, { useState } from "react";
import { toPng } from "html-to-image";
import $ from "classnames";

import styles from "./style.module.less";
// import {ArrowDownOutlined, ArrowUpOutlined, CopyOutlined, DeleteOutlined} from "@ant-design/icons";
import { Image } from "antd";

type IProps = {
  context: IExtensionContext;
  block: IComponentInstance;
  isSelected: boolean;
};

const DEFAULT_BLOCK_PREVIEW_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABAQMAAAAl21bKAAAAA1BMVEXZ2dmK1ydDAAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==";

export const BlockItem: React.FC<IProps> = ({ context, block, isSelected }) => {
  const [previewUrl, setPreviewUrl] = useState<string>(
    DEFAULT_BLOCK_PREVIEW_URL
  );

  const canvas = block.id && document.getElementById(block.id);
  if (canvas) {
    toPng(canvas).then(function (dataUrl) {
      setPreviewUrl(dataUrl);
    });
  }

  return (
    <div
      className={$(styles.blockItem, { [styles.selected]: isSelected })}
      onClick={() => context.selectComponent([block])}
    >
      {isSelected && (
        <div className={styles.itemActions}>
          <i
            className={"mtbird-icon mtbird-arrowup " + styles.itemAction}
            onClick={() => context.goLower()}
          />
          <i
            className={"mtbird-icon mtbird-arrowdown " + styles.itemAction}
            onClick={() => context.goUpper()}
          />
          <i
            className={"mtbird-icon mtbird-file-copy " + styles.itemAction}
            onClick={() => context.copyComponent()}
          />
          <i
            className={"mtbird-icon mtbird-delete " + styles.itemAction}
            onClick={() => context.deleteComponent()}
          />
        </div>
      )}
      <Image
        preview={false}
        wrapperClassName={styles.preview}
        alt={`block ${block.id}`}
        src={previewUrl}
        fallback={DEFAULT_BLOCK_PREVIEW_URL}
      ></Image>
    </div>
  );
};
