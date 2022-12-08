import React, { useState } from 'react'
import {List} from '@mtbird/ui'
import {IExtensionFeatureProps, IVariable} from '@mtbird/shared'
import {Button} from 'antd'
import {DATA} from '@mtbird/core'

import styles from './style.module.less'
import VariableEditor, {VARIABLE_SOURCE_TYPE} from './VariableEditor'

const VariablePanel = ({context}: IExtensionFeatureProps) => {
  const {page, onChangeValue} = context;
  const [showEdit, setShowEdit] = useState(false);
  const [data, setData] = useState<IVariable | undefined>();
  const [dataIndex, setDataIndex] = useState<number>(-1);

  const columns = [
    {
      key: 'name',
      name: '名称',
    }, {
      key: 'sourceType',
      name: '数据源类型',
      render: (cur: IVariable) => {
        return VARIABLE_SOURCE_TYPE[cur.sourceType];
      }
    }, {
      key: 'dataType',
      name: '数据类型',
      render: (cur: IVariable) => {
        return DATA.DATA_TYPE[cur.dataType]
      }
    }
  ]

  const handleAdd = () => {
    setShowEdit(true)
  }
  
  const handleHide = () => {
    setShowEdit(false)
    setData(undefined)
    setDataIndex(-1)
  }

  const handleToChange = (data: Record<string, any>, i?: number) => {
    setData(data);
    setDataIndex(i as number);
    setShowEdit(true);
  }

  const handleDelete = (data: Record<string, any>, i: number | undefined) => {
    const newVariables = [...(page.data.variables || [])]
    newVariables.splice(i as number, 1)
    onChangeValue('variables', newVariables,page.data.id)
  }

  const handleEditFinish = (data: IVariable) => {
    let newVariables = [...(page.data.variables || [])]
    if (dataIndex === -1) {
      newVariables.push(data)
    } else {
      newVariables[dataIndex] = data
    }

    onChangeValue('variables', newVariables, page.data.id)
    handleHide();
  }

  return (
    <div className={styles.variablePanel}>
      <div className={styles.variablePanelListArea}>
        <Button size="small" type="primary" onClick={handleAdd}>新建变量</Button>
        <List color="var(--color-text-4)" data={page.data.variables || []} columns={columns} onToChange={handleToChange} onDelete={handleDelete} />
      </div>
      {showEdit && (
        <div className={styles.variablePanelEditor}>
          <VariableEditor onFinish={handleEditFinish} onHide={handleHide} data={data} />
        </div>
      )}
    </div>
  )
}

export default VariablePanel