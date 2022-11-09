import { IComponentCommon, IExtensionContext } from '@mtbird/shared/dist/types';
import React from 'react';
import values from 'lodash/values';
import ToolBoxForm from '../ToolBoxForm';
import styles from './style.module.less';

interface IProps {
  context: IExtensionContext;
}

const FormComponents = ({context}: IProps) => {
  const formComponents = values(context.registeredComponents).filter((component: IComponentCommon) => component.category === 'form' && !component.hideInToolbar)
  return <div className={styles.formTemplates}>
    {formComponents.map((cur: IComponentCommon) => <ToolBoxForm key={cur.componentName} component={cur} context={context} />)}
  </div>;
};

export default FormComponents;
