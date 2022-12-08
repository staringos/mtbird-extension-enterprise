import React, { useState } from 'react'
import {Radio} from 'antd'
import styles from './style.module.less'
import { IExtensionFeatureProps } from '@mtbird/shared';
import TemplateList from './TemplateList';

const ModeOptions = [
  { label: '市场', value: 'market' },
  { label: '团队', value: 'team' },
  { label: '我的', value: 'my' },
]

const TemplatePanel = ({context}: IExtensionFeatureProps) => {
  const [scope, setScope] = useState<string>('market');

  const handleModeChange = (e: any) => {
    setScope(e.target.value)
  }

  return (
    <div className={styles.templatePanel}>
      <Radio.Group options={ModeOptions} onChange={handleModeChange} value={scope} size="small" style={{ marginBottom: 8 }} optionType="button"
        buttonStyle="solid">
      </Radio.Group>
      <TemplateList scope={scope} showDeleteBtn={scope !== 'market'} context={context}  />
    </div>
  )
}

export default TemplatePanel