import React, { useEffect, useState } from 'react'
import {Input, Radio, Pagination} from 'antd'
import styles from './style.module.less'
import {IExtensionContext, IExtensionDTO} from '@mtbird/shared'
import ExtensionCard from '../ExtensionCard';
const { Search } = Input;

const SCOPE = [{
  label: '市场',
  value: 'market'
}, {
  label: '团队',
  value: 'team'
}, {
  label: '我的',
  value: 'my'
}]

interface IPaginationResult<D> {
  total: number
  data: D
}

const ExtensionMarketModal = ({ context }: { context: IExtensionContext }) => {
  const [pagination, setPagination] = useState({pageNum: 1, pageSize: 20})
  const [query, setQuery] = useState('')
  const [scope, setScope] = useState('market')
  const [data, setData] = useState<IPaginationResult<Array<IExtensionDTO>>>({data: [], total: 0})

  const toSearch = async () => {
    const res = await context.request.get(process.env.API_URL + '/registry/extension', {
      params:  {...pagination, query, scope, teamId: context.storage.getItem('TSK'), appId: context.page?.appId},
      headers: {
        Authorization: 'Beare ' + context.storage.getItem('AUTH_TOKEN')
      }
    })

    setData(res.data)
  }

  const handlePagination = (pageNum: number) => {
    setPagination({
      ...pagination,
      pageNum
    })
  }

  useEffect(() => {
    toSearch()
  }, [query, pagination, scope])

  const handleSearch = (e: string) => {
    setQuery(e)
  }

  const handleScopeChange = (e: any) => {
    setScope(e.target.value)
  }

  return (
    <div className={styles.extensionMarketContainer}>
      <div className={styles.searchBar}>
        <Search
          placeholder="输入名称或者唯一标识搜索拓展"
          allowClear
          onSearch={handleSearch}
        />
        <Radio.Group className={styles.scopeRadio} value={scope} onChange={handleScopeChange}>
          {SCOPE.map(cur => (
            <Radio.Button value={cur.value} key={cur.value}>{cur.label}</Radio.Button>
          ))}
        </Radio.Group>
      </div>
      <div className={styles.extensionList}>
        {data.data.map(cur => (
          <ExtensionCard key={cur.id} extension={cur} context={context} refresh={toSearch} />
        ))}
      </div>
      <Pagination style={{marginTop: '10px'}} current={pagination.pageNum} onChange={handlePagination} pageSize={pagination.pageSize} total={data.total} />
    </div>
  )
}

export default ExtensionMarketModal