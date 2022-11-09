import React, { useEffect, useState } from 'react';
import { Radio, RadioChangeEvent, Button, Tooltip, message } from 'antd';
import {IComponentInstance, IExtensionContext} from '@mtbird/shared';
import FormComponents from './components/FormComponents';
import TemplateList from '../TemplatePanel/TemplateList';
import styles from './style.module.less';
import isArray from 'lodash/isArray'

interface IProps {
  context: IExtensionContext
}

const FormTab = ({context}: IProps) => {
  const [mode, setMode] = useState('templates');
  const {currentComponent, registeredComponents, addComponent} = context;

  const handleModeChange = (e: RadioChangeEvent) => {
    setMode(e.target.value);
  };

  useEffect(() => {
    const firstComponent = isArray(currentComponent) ? currentComponent[0] : currentComponent
    if (!firstComponent || currentComponent.length > 1) {
      if (mode === 'components') setMode('templates')
      return
    }

    if ((firstComponent as IComponentInstance).type === 'form') {
      if (mode !== 'components') {
        setMode('components')

        context.eventHub.emit(context.EVENT_KEYS.TOOLBAR_SWITCH, {
          target: '表单组件'
        })
      }
    } else {
      setMode('templates')
    }
  }, [currentComponent])

  const handleAddEmptyForm = () => {
    addComponent(registeredComponents?.['Form'].instance);
    message.success("操作成功!")
  }

  return (
    <div className={styles.formTemplateWrapper}>
      <Radio.Group onChange={handleModeChange} value={mode} style={{ marginBottom: 8 }} size="small" disabled>
        <Radio.Button value="templates">
          模版
          <Tooltip placement="bottom" title="选择非表单组件，可以添加表单模版">
            <i className="mtbird-icon mtbird-question-circle" />
          </Tooltip>
          </Radio.Button>
        <Radio.Button value="components">
          组件
          <Tooltip placement="bottom" title="选择表单组件，可以向表单中添加表单组件">
            <i className="mtbird-icon mtbird-question-circle" />
          </Tooltip>
        </Radio.Button>
      </Radio.Group>
      {mode === 'templates' && (
        <Button type="default" block size="small" style={{marginBottom: '5px'}} onClick={handleAddEmptyForm}>添加空白表单</Button>
      )}
      {mode === 'templates' && <TemplateList scope="market" showDeleteBtn={false} context={context} componentName="Form" />}
      {mode === 'components' && <FormComponents context={context} />}
    </div>
  );
};

export default FormTab;
