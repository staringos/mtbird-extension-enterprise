import React, { useState } from 'react'
import {Button} from 'antd'
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
  const [editing, setEditing] = useState({})

  const handleToAdd = () => {
    setShowForm(true)
  }

  const handleToEdit = (cur: IEvent) => {
    setShowForm(true)
    setEditing(cur)
  }

  const handleCloseEdit = () => {
    setShowForm(false)
    setEditing({})
  }

  const handleDelete = (key: string) => {
    const newEvents = { ...(currentFirstComponent.events || {}) }
    delete newEvents[key]
    context.onChangeValue('events', newEvents)
  }

  return (
    <div className={styles.eventPanelContainer}>
      <div className={styles.eventPanelHeader}>
        <Button type="primary" onClick={handleToAdd}><i className="mtbird-icon mtbird-appstoreadd"></i></Button>
      </div>
      <div className={styles.eventPanelList}>
        {keys(events).map((key: string) => {
          return (
            <div className={styles.eventPanelItem}>
              <div>
                <span>{EVENT_ACTION.find((cur: any) => cur.value === events[key].type).label}</span> - <span>{events[key].name}</span>
              </div>
              <div className={styles.eventPanelItemControl}>
                <Button type="text" onClick={() => handleToEdit(events[key])}><i className="mtbird-icon mtbird-edit-square"></i></Button>
                <Button type="text" onClick={() => handleDelete(key)}><i className="mtbird-icon mtbird-delete"></i></Button>
              </div>
            </div>)
        })}
      </div>
      {showForm && (<EventForm editing={editing} context={context} onClose={handleCloseEdit} />)}
    </div>
  )
}

export default EventPanel