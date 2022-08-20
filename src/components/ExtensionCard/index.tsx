import React from 'react'
import {Card, Button, Modal, message} from 'antd'
import { IExtensionContext, IExtensionDTO } from '@mtbird/shared/dist/types'
import styles from './style.module.less'

const { Meta } = Card;
const { confirm } = Modal;

interface IProps {
  extension: IExtensionDTO,
  context: IExtensionContext,
  refresh: () => void
}

const ExtensionCard = ({extension, context, refresh}: IProps) => {
  const handleInstall = async () => {
    confirm({
      title: '安装拓展',
      content: '安装拓展后会刷新页面，请确定页面内容保存后进行操作!',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const appId = context.page?.['appId']
        if (!appId) return message.error('参数不全!');
        await context.request.post(`${process.env.API_URL}/app/${appId}/extension`, {
          extensionId: extension.id
        }, {
          headers: {
            Authorization: 'Beare ' + context.storage.getItem('AUTH_TOKEN')
          }
        })
        await refresh()
        message.success('拓展安装成功');
      }
    });
  }

  const handleUninstall = () => {
    confirm({
      title: '卸载拓展',
      content: '卸载拓展后会刷新页面，请确定页面内容保存后进行操作!',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        const appId = context.page?.['appId']
        if (!appId) return message.error('参数不全!');
        await context.request.delete(`${process.env.API_URL}/app/${appId}/extension`, {
          data: {
            extensionId: extension.id
          },
          headers: {
            Authorization: 'Beare ' + context.storage.getItem('AUTH_TOKEN')
          }
        })
        refresh()
        message.success('拓展卸载成功');
      },
    });
  }

  return (
    <Card
      className={styles.extensionCard}
      hoverable
      style={{ width: 120 }}
      cover={<img style={{ width: 120, height: 100 }} alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
      <Meta className={styles.extensionMeta} title={extension.title} description={extension.desc} />
      {extension.hasInstalled ? (<Button danger size='small' onClick={handleUninstall}>卸载</Button>) : (<Button type="primary" size='small' onClick={handleInstall}>安装</Button>)}
    </Card>
  )
}

export default ExtensionCard