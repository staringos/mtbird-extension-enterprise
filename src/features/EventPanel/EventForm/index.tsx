import React, { ReactNode, useEffect } from 'react'
import {Form, Input, Button} from 'antd'
import {ComponentEvent, getModalOptions, SchemaSelect} from '@mtbird/core'
import {IExtensionContext, IPageConfig, IEvent} from '@mtbird/shared'
import styles from './style.module.less'

const {EVENT_TYPE, EVENT_ACTION} = ComponentEvent

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

interface IItemProps {
  children: ReactNode;
  label: string;
  value: string;
}

const EventFormItem = ({children, label, value}: IItemProps) => {
  return<Form.Item name={value} label={<label style={{color: 'white'}}>{label}</label>}>
    {children}
  </Form.Item>
}

interface IProps {
  editing: IEvent;
  context: IExtensionContext;
  onClose: () => void;
  onFinish: (value: IEvent) => void;
}

const EventForm = ({context, onClose, editing, onFinish}: IProps) => {
  const [form] = Form.useForm();
  const type = Form.useWatch('type', form);
  const action = Form.useWatch('action', form);
  const pageListOptions = context.pageList.map((cur: IPageConfig) => ({label: cur.title, value: cur.id}))
  const modalOptions = getModalOptions(context.page.data)

  useEffect(() => {
    form.setFieldsValue(editing)
  }, [editing])

  return (
    <Form {...layout} style={{marginTop: 10}} size="small" onFinish={() => onFinish(form.getFieldsValue())} form={form} colon={false}>
      <EventFormItem label="行为" value="action">
        <SchemaSelect className={styles.schemaFormItem} options={EVENT_ACTION} disabled={editing.action} value={action} onChange={(value: string) => form.setFieldValue(value)}></SchemaSelect>
      </EventFormItem>
      <EventFormItem label="名称" value="name">
        <Input className={styles.schemaFormItem} />
      </EventFormItem>
      <EventFormItem label="动作类型" value="type">
        <SchemaSelect className={styles.schemaFormItem} options={EVENT_TYPE} value={type} onChange={(value: string) => form.setFieldValue('type', value)}>
          {EVENT_TYPE.map((cur: any) => <option value={cur.value}>{cur.label}</option>)}
        </SchemaSelect>
      </EventFormItem>

      {(type === 'open-modal' || type === 'close-modal') && (
        <EventFormItem label="弹窗" value="modalId">
          <SchemaSelect className={styles.schemaFormItem} options={modalOptions} onChange={(value: string) => form.setFieldValue('modalId', value)}>
            {modalOptions.map((cur: any) => <option value={cur.value}>{cur.label}</option>)}
          </SchemaSelect>
        </EventFormItem>
      )}

      {(type === 'link' || type === 'link-blank') && (
        <EventFormItem label="跳转链接" value="src">
          <Input className={styles.schemaFormItem} />
        </EventFormItem>
      )}
      {(type === 'link-page') && (
        <EventFormItem label="选择页面" value="pageId">
          <SchemaSelect className={styles.schemaFormItem} options={pageListOptions} onChange={(value: string) => form.setFieldValue('pageId', value)} />
        </EventFormItem>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button type="default" style={{marginLeft: 10}} onClick={onClose}>
          取消
        </Button>
      </Form.Item>
    </Form>
  );
}

export default EventForm