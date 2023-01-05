import React, { useEffect } from 'react'
import {CollapsePanel, FormItem, SchemaSelect, SchemaInput} from '@mtbird/ui'
import {IExtensionContext, IComponentInstanceCommon, IDataModel, IDataModelField, ISearch } from '@mtbird/shared'
import { COMPONENT, DATA } from '@mtbird/core'
import {Form, Space, Input, Button, Typography} from 'antd'
import { COLLAPSE_STYLE } from '../constants'
import styles from './style.module.less'

const {Title} = Typography

const {DATA_SOURCE_OPTIONS} = COMPONENT

const ConditionOptions = [
  {
    label: '等于',
    value: 'eq'
  }, {
    label: '模糊等于',
    value: 'like'
  }, {
    label: '大于',
    value: 'gt'
  }, {
    label: '小于',
    value: 'lt'
  }, {
    label: '大于等于',
    value: 'ge'
  }, {
    label: '小于等于',
    value: 'le'
  }, {
    label: '不等于',
    value: 'ne'
  }, 
]

interface IProps {
  context: IExtensionContext;
  currentFirstComponent: IComponentInstanceCommon;
}

const DataSourcePanel = ({currentFirstComponent, context}: IProps) => {
  const [form] = Form.useForm()
  const {variables, onChangeValue, currentDataContainer} = context;
  const {data} = currentFirstComponent;
  const {targetId} = currentDataContainer?.data || {}
  const model = targetId ? variables.$models.find((model: IDataModel) => model.id === targetId) : undefined
  const fieldOptions = model ? [...DATA.DATA_MODEL_SYSTEM_OPTIONS, ...model.DataModelField.map((cur: IDataModelField) => ({...cur, label: cur.displayName, value: `data.${cur.key}`}))] : [...DATA.DATA_MODEL_SYSTEM_OPTIONS];

  useEffect(() => {
    if (data && data.search) {
      form.setFieldsValue({ search: data?.search })
    }
  }, [currentFirstComponent])

  const handleTypeChange = (value: string) => {
    onChangeValue('data.type', value)
  }

  const handleModelChange = (value: string) => {
    onChangeValue('data.targetId', value)
  }

  const handleConditionChange = () => {
    const data = form.getFieldsValue()

    // 只有所有信息都填写完毕，才会提交
    const search = data.search.filter((cur: ISearch) => {
      return cur.keyPath && cur.operator && cur.value
    })

    onChangeValue('data.search', search)
  }

  return (
    <CollapsePanel id="" title="数据源" defaultOpen={true} style={COLLAPSE_STYLE}>
      <FormItem label="数据源类型">
        <SchemaSelect options={DATA_SOURCE_OPTIONS} value={data?.type} onChange={handleTypeChange} />
      </FormItem>
      {data?.type === 'model' && (
        <FormItem label="数据模型">
          <SchemaSelect options={variables.$modelsOptions} value={data?.targetId} onChange={handleModelChange} />
        </FormItem>
      )}

      {data?.type === 'model' && (
        <Form form={form} className={styles.searchCondition}>
          <Title level={5} style={{color: 'white'}}>搜索条件</Title>
          <Form.List name="search">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space key={key} style={{ display: 'flex', marginBottom: 0 }} align="baseline">
                    <Form.Item
                      {...restField}
                      name={[name, 'keyPath']}
                      rules={[{ required: true, message: '请选择字段' }]}
                    >
                      <SchemaSelect placeholder="选择字段" options={fieldOptions} onChange={handleConditionChange}  />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'operator']}
                      rules={[{ required: true, message: '请选择操作' }]}
                    >
                      <SchemaSelect placeholder="选择操作" options={ConditionOptions} onChange={handleConditionChange} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      rules={[{ required: true, message: '请输入搜索值' }]}
                    >
                      <SchemaInput placeholder="搜索值" styleInner={{width: '50px'}} onBlur={handleConditionChange} />
                    </Form.Item>
                    <i className={"mtbird-icon mtbird-minus-circle " + styles.text} onClick={() => {remove(name);handleConditionChange()}} />
                  </Space>
                ))}
                <Form.Item>
                  <Button type="link" onClick={() => add()} block icon={<i className="mtbird-icon mtbird-plus" />}>
                    添加搜索条件
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      )}
    </CollapsePanel>
  )
}

export default DataSourcePanel