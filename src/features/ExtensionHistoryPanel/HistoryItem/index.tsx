import React from "react";
import { HistoryItemDO } from "../types";
import { Image } from "antd";
import styles from "./style.module.less";
import $ from "classnames";

type IProps = {
  itemData: HistoryItemDO;
  onRollback: (item: HistoryItemDO) => void;
  isFirstItem: boolean;
};

export const HistoryItem: React.FC<IProps> = ({
  itemData,
  onRollback,
  isFirstItem,
}) => {
  return (
    <div className={styles.historyItem}>
      <div className={styles.timeline}>
        <span
          className={$(styles.beforeTimeline, {
            [styles.beforeTimelineFirstItem]: isFirstItem,
          })}
        />
        {isFirstItem && (
          <div className={styles.firstItemDot}>
            <svg
              className="icon"
              viewBox="0 0 1053 1024"
              version="1.1"
              width="64"
              height="64"
            >
              <path
                d="M570.477039 28.040397L694.725004 290.073071a48.345512 48.345512 0 0 0 36.259134 27.073486l281.370879 43.027506a48.345512 48.345512 0 0 1 27.073486 81.703915l-206.435335 211.269886a48.345512 48.345512 0 0 0-13.053288 42.060595L870.219212 966.910236a48.345512 48.345512 0 0 1-67.683717 52.696607l-253.813936-115.545773a48.345512 48.345512 0 0 0-40.126775 0l-255.747757 115.062318A48.345512 48.345512 0 0 1 185.16331 966.910236l48.345512-268.801046a48.345512 48.345512 0 0 0-13.053288-42.060595L14.020198 443.811798A48.345512 48.345512 0 0 1 41.093685 362.591338l281.370879-43.027505A48.345512 48.345512 0 0 0 358.723697 290.073071L483.455118 28.040397a48.345512 48.345512 0 0 1 87.021921 0z"
                fill="#f4ea2a"
              />
            </svg>
          </div>
        )}
        {!isFirstItem && <span className={styles.dot} />}
        <span className={styles.afterTimeline} />
      </div>
      <div className={styles.historyItemContent}>
        <div className={styles.profile}>
          <Image
            preview={false}
            wrapperClassName={styles.avatar}
            src={itemData.avatar}
            placeholder={<i className="mtbird-icon mtbird-user" />}
          />
          <span className={styles.nickname}>{itemData.nickname}</span>
          <span className={styles.historyId}>{itemData.shortId}</span>
        </div>
        <div className={styles.timeAndAction}>
          <span className={styles.time}>{itemData.date}</span>
          <span
            className={styles.rollback}
            onClick={() => onRollback(itemData)}
          >
            恢复
          </span>
        </div>
      </div>
    </div>
  );
};
