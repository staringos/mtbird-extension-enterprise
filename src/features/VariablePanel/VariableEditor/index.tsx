import React, { useEffect } from 'react'
import {Form, Button, Input} from 'antd'
import {SchemaSelect} from '@mtbird/ui'
import styles from './style.module.less'
import {DATA} from '@mtbird/core'
import {IVariable} from '@mtbird/shared'
import keys from 'lodash/keys'

export const VARIABLE_SOURCE_TYPE = {
  defaultValue: '初始值',
  dataModel: '数据模型',
  api: 'API',
  pageParams: '页面参数'
}

export const VARIABLE_SOURCE_TYPE_OPTIONS = keys(VARIABLE_SOURCE_TYPE).map((cur: string) => {
  return {
    label: VARIABLE_SOURCE_TYPE[cur],
    value: cur
  }
})

interface IProps {
  data?: IVariable;
  onHide: () => void;
  onFinish: (data: IVariable) => void;
}

const VariableEditor = ({data, onFinish, onHide}: IProps) => {
  const [form] = Form.useForm();
  const dataType = Form.useWatch('dataType', form);
  const sourceType = Form.useWatch('sourceType', form);

  useEffect(() => {
    if (data) {
      form.setFieldsValue(data)
    }
  }, [data])

  const handleFinish = () => {
    const data = form.getFieldsValue()
    onFinish(data)
  }

  return (
    <Form
      className={styles.variableEditor}
      name="basic"
      form={form}
      size="small"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      onFinish={handleFinish}
      autoComplete="off"
    >
      <Form.Item
        label="变量名"
        name="name"
        rules={[{ required: true, message: '请输入变量名称!' }]}
        disabled={data}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="变量类型"
        name="dataType"
        rules={[{ required: true, message: '请选择变量类型!' }]}
      >
        <SchemaSelect options={DATA.DATA_TYPE_OPTIONS} value={dataType} onChange={(value: string) => form.setFieldValue(value)} />
      </Form.Item>

      <Form.Item
        label="变量来源"
        name="sourceType"
        rules={[{ required: true, message: '请选择来源类型!' }]}
      >
        <SchemaSelect options={VARIABLE_SOURCE_TYPE_OPTIONS} value={sourceType} onChange={(value: string) => form.setFieldValue(value)} />
      </Form.Item>

      {sourceType === 'dataModels' && <Form.Item
          label="数据模型"
          name="dataModelsId"
        >
          <SchemaSelect options={VARIABLE_SOURCE_TYPE_OPTIONS} value={sourceType} onChange={(value: string) => form.setFieldValue(value)} />
        </Form.Item>
      }

      {sourceType === 'defaultValue' && <Form.Item
          label="初始值"
          name="defaultValue"
        >
          <Input />
        </Form.Item>
      }

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          提交
        </Button>
        <Button type="default" onClick={onHide} style={{marginLeft: 10}}>
          取消
        </Button>
      </Form.Item>
    </Form>
  )
}

export default VariableEditor