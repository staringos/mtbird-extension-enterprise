import React, {useEffect, useRef, useState} from 'react'
import {List, message, Modal} from 'antd'
import VirtualList from 'rc-virtual-list'
import {
    ExtensionProps,
    HistoryItemDO,
    HistoryItemDTO,
    HistoryListData,
    HistoryListDTO,
    ResponseDTO,
    RollbackResultDTO
} from './types'
import {HistoryItem} from './HistoryItem'
import styles from './style.module.less'
import {ExclamationCircleOutlined} from "@ant-design/icons";

const PAGE_LIMIT = 40

const ExtensionHistoryPanel: React.FC<ExtensionProps> = ({context}) => {
    const initialListData: HistoryListData = {
        pagination: {
            pageNum: 1,
            pageSize: PAGE_LIMIT
        },
        data: [],
        pagedData: [false],
        total: 0
    }
    const [listData, setListData] = useState<HistoryListData>(JSON.parse(JSON.stringify(initialListData)))
    const [loading, setLoading] = useState<boolean>(false)
    const [isDataInitialed, setDataInitialed] = useState<boolean>(false)
    const [hasMoreData, setHasMoreData] = useState<boolean>(true)
    const [panelHeight, setPanelHeight] = useState<number>(0)

    const rootRef = useRef<HTMLDivElement>(null)

    const historyItemMapper = (item: HistoryItemDTO): HistoryItemDO => {
        const date = new Date(item.createdAt)
        return {
            id: item.id,
            pageId: item.pageId,
            shortId: item.id.slice(0, 6),
            avatar: item.creator.avatar || undefined,
            nickname: item.creator.nickname || 'User',
            // TODO: Use a open-source module to format date
            date: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
        }
    }

    const authHeaders = () => {
        return {
            headers: {
                Authorization: `Beare ${context.storage.getItem('AUTH_TOKEN')}`
            }
        }
    }

    const fetchData = async (listData: HistoryListData, force?: boolean) => {
        if (force !== true) {
            if (loading || !hasMoreData) {
                return
            }
        }
        setLoading(true)
        try {
            const res: ResponseDTO<HistoryListDTO<HistoryItemDTO>> = await context.request.get(
                `${process.env.API_URL}/page/${context.page?.id}/history`,
                {
                    params: {...listData.pagination},
                    ...authHeaders()
                }
            )

            if (res.status == 200 && res.data && res.data.code == 200) {
                const {data: {data}} = res
                const hasData = Array.isArray(data) && data.length > 0
                if (hasData) {
                    for (let i = listData.pagedData.length - 1; i <= listData.pagination.pageNum; i++) {
                        listData.pagedData.push(false)
                    }
                    listData.pagedData[listData.pagination.pageNum] = data.map(historyItemMapper)

                    const newData: HistoryItemDO[] = []
                    for (let items of listData.pagedData) {
                        if (items) {
                            newData.push(...items)
                        }
                    }

                    listData.data = newData
                    listData.pagination.pageNum++;
                    listData.total = newData.length
                    setListData(listData)
                }
                setHasMoreData(hasData && listData.total < res.data.total)
            }
        } finally {
            setLoading(false)
        }
    }

    const rollback = async (itemData: HistoryItemDO) => {
        const res: ResponseDTO<RollbackResultDTO> = await context.request.put(
            `${process.env.API_URL}/page/${itemData.pageId}/history/${itemData.id}/rollback`,
            null,
            authHeaders()
        )
        console.log(res)
        if (res.status != 200) {
            throw res
        }
    }

    const reloadList = async () => {
        await fetchData(JSON.parse(JSON.stringify(initialListData)), true);
    }

    const rollbackDidClick = (itemData: HistoryItemDO) => {
        Modal.confirm({
            icon: <ExclamationCircleOutlined/>,
            title: '恢复修改',
            content: `确定要恢复修改 ${itemData.shortId} 吗？`,
            onOk: async () => {
                try {
                    await rollback(itemData)
                    message.success("操作成功!")
                    await reloadList()
                } catch (e) {
                    message.error("操作失败!")
                }
            }
        })
    }

    const getTopFromWindow = (e: HTMLElement | null): number => {
        if (!e) {
            return 0
        } else {
            return e.offsetTop + getTopFromWindow(e.offsetParent as (HTMLElement | null))
        }
    }

    const updatePanelHeightEffect = () => {
        const rootView = rootRef.current
        if (rootView) {
            let top = getTopFromWindow(rootView)
            const updater = () => {
                if (top <= 0) {
                    top = getTopFromWindow(rootView)
                }
                setPanelHeight(self.innerHeight - top)
            }
            if (top > 0) {
                updater()
            }
            self.addEventListener("resize", updater)
            return () => {
                self.removeEventListener("resize", updater)
            }
        }
    }

    const initDataEffect = () => {
        if (isDataInitialed) {
            return
        }
        fetchData(listData).then(() => {
            setDataInitialed(true)
        })
    }

    const onListScroll = async (ev: React.UIEvent<HTMLElement, UIEvent>) => {
        if (loading || !hasMoreData) {
            return
        }
        if (ev.currentTarget.scrollHeight - ev.currentTarget.scrollTop <= panelHeight) {
            await fetchData(listData);
        }
    }

    useEffect(updatePanelHeightEffect)
    useEffect(initDataEffect, [isDataInitialed])

    return (
        <div className={styles.extensionHistoryPanel} ref={rootRef} style={{
            height: `${panelHeight}px`
        }}>
            <span className={styles.timeline} hidden={listData.total <= 0}/>
            <List
                className={styles.list}
                split={false}
                itemLayout={'vertical'}
                loading={loading}
            >
                <VirtualList
                    data={listData.data}
                    height={panelHeight}
                    onScroll={onListScroll}
                    virtual={true}
                    itemKey="history-item"
                >
                    {(itemData, index) => (
                        <List.Item>
                            <HistoryItem
                                itemData={itemData}
                                isFirstItem={index === 0}
                                onRollback={rollbackDidClick}
                            />
                            {index === listData.total - 1 &&
                                <div className={styles.footer}/>
                            }
                        </List.Item>

                    )}
                </VirtualList>
            </List>
        </div>
    )
}

export default ExtensionHistoryPanel