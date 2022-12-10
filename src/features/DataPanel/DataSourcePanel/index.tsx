import {CollapsePanel, FormItem, SchemaSelect} from '@mtbird/ui'
import {IExtensionContext, IComponentInstanceCommon} from '@mtbird/shared'
import { COMPONENT } from '@mtbird/core'
import { COLLAPSE_STYLE } from '../constants';

const {DATA_SOURCE_OPTIONS} = COMPONENT

interface IProps {
  context: IExtensionContext;
  currentFirstComponent: IComponentInstanceCommon;
}

const DataSourcePanel = ({currentFirstComponent, context}: IProps) => {
  const {variables, onChangeValue} = context;
  const {data} = currentFirstComponent;

  const handleTypeChange = (value: string) => {
    onChangeValue('data.type', value)
  }

  const handleModelChange = (value: string) => {
    onChangeValue('data.targetId', value)
  }

  return (
    <CollapsePanel title="数据源" defaultOpen={true} style={COLLAPSE_STYLE}>
      <FormItem label="数据源类型">
        <SchemaSelect options={DATA_SOURCE_OPTIONS} value={data.type} onChange={handleTypeChange} />
      </FormItem>
      {data.type === 'model' && (
        <FormItem label="数据模型">
          <SchemaSelect options={variables.$modelsOptions} value={data.targetId} onChange={handleModelChange} />
        </FormItem>
      )}
    </CollapsePanel>
  )
}

export default DataSourcePanel