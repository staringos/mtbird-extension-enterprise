import { IComponentCommon, IExtensionContext } from '@mtbird/shared';
import {Button} from 'antd';
import React from 'react';
import values from 'lodash/values';
import ToolBoxForm from '../ToolBoxForm';
import styles from './style.module.less';
import { SchemaGenerator } from '@mtbird/core';

interface IProps {
  context: IExtensionContext;
}

const FormComponents = ({context}: IProps) => {
  const formComponents = values(context.registeredComponents).filter((component: IComponentCommon) => component.category === 'form' && !component.hideInToolbar)
  const handleAddSubmitButton = () => {
    context.addComponent(SchemaGenerator.formItem('', '', [SchemaGenerator.button('提交', {type: 'submit'}, {width: 100}) as any], {}))
  }

  return <div>
    <Button type="default" block size="small" style={{marginBottom: '5px'}} onClick={handleAddSubmitButton}>提交按钮</Button>
    <div className={styles.formTemplates}>
      {formComponents.map((cur: IComponentCommon) => <ToolBoxForm key={cur.componentName} component={cur} context={context} />)}
    </div>
  </div>;
};

export default FormComponents;
