import React from 'react'
import {IDataModel, IDataModelField, IComponentInstanceCommon, IExtensionContext} from '@mtbird/shared'
import {CollapsePanel, FormItem, SchemaSelect} from '@mtbird/ui'
import {COMPONENT_NAME} from '@mtbird/core'
import { COLLAPSE_STYLE } from '../constants'

interface IProps {
  currentFirstComponent: IComponentInstanceCommon;
  context: IExtensionContext;
}

const FieldBindConfig = {
  [COMPONENT_NAME.IMAGE]: 'props.src',
  [COMPONENT_NAME.BUTTON]: 'children',
  [COMPONENT_NAME.TEXT]: 'children',
  [COMPONENT_NAME.VIDEO]: 'props.src',
  [COMPONENT_NAME.ICON]: 'className',
  [COMPONENT_NAME.SHAPE]: 'data.path',
}

const FieldPanel = ({currentFirstComponent, context}: IProps) => {
  const {variables, onChangeValue, currentDataContainer} = context
  const {targetId} = currentDataContainer?.data || {}
  const model = targetId ? variables.$models.find((model: IDataModel) => model.id === targetId) : undefined
  const fieldOptions = model ? model.DataModelField.map((cur: IDataModelField) => ({...cur, label: cur.displayName, value: cur.key})) : [];

  const handleFieldChange = (e: string) => {
    // `DataList` component variable key
    let key = '$maps1Data'

    // `DataDetail` component variable key
    if (currentDataContainer?.componentName === COMPONENT_NAME.DATA_DETAIL) {
      key = '$detail' + (currentDataContainer?.data?.targetId || '') + 'Data'
    }

    onChangeValue('data.fieldId', e)
    onChangeValue(FieldBindConfig[currentFirstComponent.componentName], '${{'+ key + '.data.' + e + '}}')
  }

  return (
    <CollapsePanel title="字段" defaultOpen={true} style={COLLAPSE_STYLE}>
      <FormItem label="选择字段">
        <SchemaSelect options={fieldOptions} value={currentFirstComponent.data?.fieldId} onChange={handleFieldChange} />
      </FormItem>
    </CollapsePanel>
  )
}

export default FieldPanel