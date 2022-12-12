import React from 'react'
import {Alert} from 'antd'
import styles from './style.module.less'
import { IExtensionFeatureProps } from '@mtbird/shared'
import {COMPONENT_NAME, COMPONENT_TYPE} from '@mtbird/core'
import DataSourcePanel from './DataSourcePanel'
import FieldPanel from './FieldPanel'

const Notice = <Alert message="请选择数据容器（表格、数据列表）或其子元素进行数据绑定, 不可以多选哦～" type="warning" showIcon closable />

const DataPanel = ({context}: IExtensionFeatureProps) => {
  const {currentComponent, currentDataContainer} = context;
  if (!currentComponent || currentComponent.length !== 1) {
    return Notice
  }

  const currentFirstComponent = currentComponent[0]

  // 1. is data container itselfs? bind dataSource avaiable
  const isDataContainer = currentFirstComponent.componentName === COMPONENT_NAME.DATA_LIST

  // 2. is data container's children? bind field avaiable
  // const dataContainerNode = getNodeFromTreeBranch(currentFirstComponent, componentMap, (cp: IComponentInstance) => cp.componentName === COMPONENT_NAME.DATA_LIST)
  const isDataChild = !!currentDataContainer

  if (!currentDataContainer || !currentDataContainer.data) return Notice; 

  return (
    <div className={styles.dataPanelContainer}>
      {isDataContainer && (
        <DataSourcePanel context={context} currentFirstComponent={currentFirstComponent} />
      )}

      {/* Container component cannot bind field */}
      {isDataChild && currentFirstComponent.type !== COMPONENT_TYPE.CONTAINER && currentFirstComponent.componentName !== COMPONENT_NAME.DATA_LIST && (
        <FieldPanel context={context} currentFirstComponent={currentFirstComponent} />
      )}
    </div>)
}

export default DataPanel