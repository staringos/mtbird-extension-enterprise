import React, { ReactNode, useEffect, useState } from 'react'
import {Form, Input, Button, Select} from 'antd'
import {ComponentEvent, getModalOptions} from '@mtbird/core'
import {IExtensionContext, IPageConfig, IEvent} from '@mtbird/shared'

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
}

const EventForm = ({context, onClose, editing}: IProps) => {
  const [form] = Form.useForm();
  const action = Form.useWatch('action', form);
  const pageListOptions = context.pageList.map((cur: IPageConfig) => ({label: cur.title, value: cur.id}))
  const modalOptions = getModalOptions(context.page.data)

  useEffect(() => {
    form.setFieldsValue(editing)
  }, [editing])

  const handleFinish = () => {
    context.onChangeValue(`events[${form.getFieldValue('action')}]`, form.getFieldsValue());
    onClose()
  }

  return (
    <Form {...layout} style={{marginTop: 10}} size="small" onFinish={handleFinish} form={form} colon={false}>
      <EventFormItem label="行为" value="type">
        <Select options={EVENT_ACTION} />
      </EventFormItem>
      <EventFormItem label="名称" value="name">
        <Input />
      </EventFormItem>
      <EventFormItem label="动作类型" value="action">
        <Select options={EVENT_TYPE} />
      </EventFormItem>

      {(action === 'open-modal' || action === 'close-modal') && (
        <EventFormItem label="弹窗" value="modalId">
          <Select options={modalOptions} />
        </EventFormItem>
      )}

      {(action === 'link' || action === 'link-blank') && (
        <EventFormItem label="跳转链接" value="src">
          <Input />
        </EventFormItem>
      )}
      {(action === 'link-page') && (
        <EventFormItem label="选择页面" value="pageId">
          <Select options={pageListOptions} />
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