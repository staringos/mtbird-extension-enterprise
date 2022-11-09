import React from 'react';
import type { IComponentCommon, IExtensionContext } from '@mtbird/shared';
import styles from './style.module.less';

interface IProps {
  component: IComponentCommon;
  context: IExtensionContext;
}

const ToolBoxForm = ({ component, context }: IProps) => {
  const { addComponent } = context;
  const handleClick = () => {
    addComponent(component.instance);
  };

  return (
    <div className={styles.toolbarBoxContainer} onClick={handleClick}>
      <h3 className={styles.toolbarBoxTitle}>{component.title}</h3>
    </div>
  );
};

export default ToolBoxForm
