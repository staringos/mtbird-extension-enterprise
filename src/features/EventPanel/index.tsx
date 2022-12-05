import React, { useState } from 'react'
import {Button, Alert} from 'antd'
import styles from './style.module.less'
import { IExtensionContext, IEvent } from '@mtbird/shared'
import {ComponentEvent} from '@mtbird/core'
import EventForm from './EventForm'
import keys from 'lodash/keys'

const {EVENT_ACTION} = ComponentEvent


interface IProps {
  context: IExtensionContext
}

const EventPanel: React.FC<IProps> = ({context}) => {
  const {currentComponent} = context
  const currentFirstComponent = currentComponent[0]
  const events = currentFirstComponent.events || {}
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<IEvent | Record<string, any>>({})
  const [editingIndex, setEditingIndex] = useState(-1)
  const isDisable = currentComponent.length !== 1

  const handleToAdd = () => {
    setShowForm(true)
  }

  const handleToEdit = (cur: IEvent, i: number) => {
    setShowForm(true)
    setEditing(cur)
    setEditingIndex(i)
  }

  const handleCloseEdit = () => {
    setShowForm(false)
    setEditing({})
    setEditingIndex(-1)
  }

  const handleDelete = (key: string, i: number) => {
    const newEvents = { ...(currentFirstComponent.events || {}) }
    newEvents[key].splice(i, 1)
    context.onChangeValue('events', newEvents)
  }

  const handleFinish = (value: IEvent) => {
    const newEvents = {...events}
    if (editing.action) {
      newEvents[value.action][editingIndex] = value
    } else {
      if (newEvents[value.action]) {
        newEvents[value.action].push(value)
      } else {
        newEvents[value.action] = [value]
      }
    }

    context.onChangeValue('events', newEvents)
    handleCloseEdit()
  }

  return (
    <div className={styles.eventPanelContainer}>
      <Alert message="事件配置需保存后，预览/发布才能生效，编辑器内无事件效果" type="success" showIcon closable />
      {isDisable && (
        <Alert message="只有选择单个组件，才可以编辑事件" type="warning" showIcon closable />
      )}
      <div className={styles.eventPanelHeader}>
        <Button type="primary" onClick={handleToAdd} disabled={isDisable}><i className="mtbird-icon mtbird-appstoreadd"></i></Button>
      </div>
      <div className={styles.eventPanelList}>
        {keys(events).map((key: string) => {
          return (events[key] || []).map((item: IEvent, i: number) => {
            return (
              <div className={styles.eventPanelItem}>
                <div>
                  <span>{EVENT_ACTION.find((cur: any) => cur.value === item?.action)?.label}</span> - <span>{item?.name}</span>
                </div>
                <div className={styles.eventPanelItemControl}>
                  <Button type="text" disabled={isDisable} onClick={() => handleToEdit(item, i)}><i className="mtbird-icon mtbird-edit-square"></i></Button>
                  <Button type="text" disabled={isDisable} onClick={() => handleDelete(key, i)}><i className="mtbird-icon mtbird-delete"></i></Button>
                </div>
              </div>)
          })
          return 
        })}
      </div>
      {showForm && (<EventForm onFinish={handleFinish} editing={editing} context={context} onClose={handleCloseEdit} />)}
    </div>
  )
}

export default EventPanel