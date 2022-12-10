import React from 'react'
import {IDataModel, IDataModelField, IComponentInstanceCommon, IExtensionContext} from '@mtbird/shared'
import {CollapsePanel, FormItem, SchemaSelect} from '@mtbird/ui'
import { COLLAPSE_STYLE } from '../constants';

interface IProps {
  currentFirstComponent: IComponentInstanceCommon;
  dataContainerNode: IComponentInstanceCommon;
  context: IExtensionContext;
}

const FieldPanel = ({dataContainerNode, currentFirstComponent, context}: IProps) => {
  const {variables, onChangeValue} = context
  const {targetId} = dataContainerNode.data
  const model = targetId ? variables.$models.find((model: IDataModel) => model.id === targetId) : undefined
  const fieldOptions = model ? model.DataModelField.map((cur: IDataModelField) => ({...cur, label: cur.displayName, value: cur.key})) : [];

  const handleFieldChange = (e: string) => {
    onChangeValue('data.fieldId', e)
    onChangeValue('children', '${{$maps1Data.data.' + e + '}}')
  }

  return (
    <CollapsePanel title="字段" defaultOpen={true} style={COLLAPSE_STYLE}>
      <FormItem label="选择字段">
        <SchemaSelect options={fieldOptions} value={currentFirstComponent.data.fieldId} onChange={handleFieldChange} />
      </FormItem>
    </CollapsePanel>
  )
}

export default FieldPanel