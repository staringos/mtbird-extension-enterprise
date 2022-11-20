import React, { useEffect, useRef, useState } from 'react'
import {Input, Alert} from 'antd'
import get from 'lodash/get'
import entries from 'lodash/entries'
import styles from './style.module.less'

import { IExtensionContext } from '@mtbird/shared/dist/types'

interface IProps {
  context: IExtensionContext
}

const CSSEditor = ({context}: IProps) => {
  const [currentEditKey, setCurrentEditKey] = useState<Array<string>>([])
  const [editValue, setEditValue] = useState('')
  const keyInputRef = useRef<any>()
  const valueInputRef = useRef<any>()
  const [style, setStyle] = useState<Record<string, any>>({})

  const handleOpenEdit = (e: any, key: string, type: 'key' | 'value') => {
    e?.stopPropagation()
    setCurrentEditKey([key, type])

    if (type === 'key') {
      setEditValue(key)
      setTimeout(() => {
        keyInputRef.current.focus()
      })
      return 
    }

    setEditValue(style[key])
    setTimeout(() => {
      valueInputRef.current.focus()
    })
  }

  const handleFinishEdit = () => {
    const tmp = {...style}
    const [key, type] = currentEditKey

    // key or value is empty，delete that line
    if (!editValue || editValue.trim().length === 0) {
      delete tmp[key];
      setStyle(tmp)
      return
    }

    // not change anything
    if (type === 'key' && key === editValue || type === 'value' && tmp[key] === editValue) return clear();

    if (type === 'key') {
      tmp[editValue] = tmp[key]
      // Object.defineProperty(tmp, editValue, Object.getOwnPropertyDescriptor(tmp, key) as any);
      delete tmp[key];
    }

    if (type === 'value') {
      tmp[key] = editValue;
    }

    // update
    setStyle(tmp)
    context.onChangeValue('props.style', tmp)

    // if key, blur auto edit value
    if (type === 'key') {
      handleOpenEdit(null, editValue, 'value')
      setEditValue(style[editValue])
      return
    }

    clear()
  }

  const clear = () => {
    setEditValue('')
    setCurrentEditKey([])
  }

  const handleEditChange = (e: any) => {
    setEditValue(e.target.value)
  }

  useEffect(() => {
    console.log("currentComponent:", context.currentComponent)
    const style = get(context, 'currentComponent[0].props.style')
    setStyle({...style})

    if (currentEditKey.length > 0) {
      clear()
    }
  }, [context.currentComponent])

  const handleAdd = () => {
    setStyle({
      ...style,
      '': ''
    })

    setCurrentEditKey(['', 'key'])
    setTimeout(() => {
      keyInputRef.current?.focus()
    })
  }

  const handleKeyDown = (e: any) => {
    if (e.key === 'Enter') {
      handleFinishEdit()
    }
  }

  return (
    <div className={styles.cssEditorWrapper} onDoubleClick={handleAdd}>
      <Alert message="样式双击编辑，双击空白处新增，样式名为驼峰格式，默认单位为px" type="warning" showIcon closable />
      <ul className={styles.cssEditorList}>
        {entries(style).map((item: Array<string>) => (
          <li className={styles.cssEditorItem}>
            {currentEditKey[0] === item[0] && currentEditKey[1] === 'key' ? 
              (<Input onKeyDown={handleKeyDown} value={editValue} ref={keyInputRef} onChange={handleEditChange} className={styles.propertiesEditor} size="small" onBlur={handleFinishEdit} />) 
              : 
              <span className={styles.cssEditorListName} onDoubleClick={(e) => handleOpenEdit(e, item[0], 'key')}>{item[0]}: </span>}
            {currentEditKey[0] === item[0] && currentEditKey[1] === 'value' ? 
              (<Input onKeyDown={handleKeyDown} value={editValue} ref={valueInputRef} onChange={handleEditChange} className={styles.propertiesEditor} size="small" onBlur={handleFinishEdit} />)
              : 
              <span className={styles.cssEditorListValue} onDoubleClick={(e) => handleOpenEdit(e, item[0], 'value')}>{item[1]};</span>}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CSSEditor