import React from 'react'
import {Input} from 'antd'
import styles from './style.module.less'

const ExtensionMarket = () => {
  return (
    <div className={styles.extensionMarketContainer}>
      <div className={styles.searchBar}>
        <Input />
      </div>
      <div className={styles.extensionList}>

      </div>
    </div>
  )
}

export default ExtensionMarket