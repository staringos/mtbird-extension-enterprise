import React, { useEffect, useState } from 'react'
import {Pagination, Radio, Modal, message} from 'antd'
import styles from './style.module.less'
import TemplatePanelItem from './TemplatePanelItem';
import { ITemplateDTO } from '@mtbird/shared';
import { deleteTemplate, getTemplateList } from 'src/services/template';
import { IExtensionContext } from '@mtbird/shared';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

interface IProps {
  context: IExtensionContext
}

const ModeOptions = [
  { label: '市场', value: 'market' },
  { label: '团队', value: 'team' },
  { label: '我的', value: 'my' },
]

const TemplatePanel = ({context}: IProps) => {
  const [scope, setScope] = useState<string>('market');
  const [data, setData] = useState<any>({data: [], total: 0});
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10
  })

  const handleSelect = (template: ITemplateDTO) => {
    context.addComponent(template.content)
    message.success("操作成功!")
  }

  const handleModeChange = (e: any) => {
    setScope(e.target.value)
  }

  const refresh = async () => {
    const data = await getTemplateList(context, scope, pagination, context.storage.getItem('TSK'))
    setData(data.data)
  }

  useEffect(() => {
    refresh()
  }, [scope, pagination])

  useEffect(() => {
    context.eventHub.on(context.EVENT_KEYS.TEMPLATE_ADDED, refresh)
    return () => {
      context.eventHub.off(context.EVENT_KEYS.TEMPLATE_ADDED, refresh)
    }
  }, [])

  const handlePageChange = (pageNum: number) => {
    setPagination({
      ...pagination,
      pageNum
    })
  }

  const handleToDelete = (id: string, name: string) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除模版(${name})吗？`,
      onOk: async () => {
        await deleteTemplate(context, id)
        message.success("操作成功!")
        refresh()
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  return (
    <div className={styles.templatePanel}>
      <Radio.Group options={ModeOptions} onChange={handleModeChange} value={scope} size="small" style={{ marginBottom: 8 }} optionType="button"
        buttonStyle="solid">
      </Radio.Group>
      <div className={styles.templatePanelList}>
        {data?.data?.map((cur: any) => {
          return (
            <TemplatePanelItem template={cur} key={cur.id} showDeleteBtn={scope !== 'market'} onDelete={handleToDelete} onSelect={handleSelect} />
          )
        })}
      </div>
      <Pagination size="small" current={pagination.pageNum} total={data.total} onChange={handlePageChange} />
    </div>
  )
}

export default TemplatePanel