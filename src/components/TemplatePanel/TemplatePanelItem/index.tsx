import React from 'react'
import {Card} from 'antd'
import styles from './style.module.less'

export interface ITemplateDTO {
  id: string;
  name: string;
  avatar: string;
  content: any;
}

interface IProps {
  onSelect: (template: ITemplateDTO) => void;
  onDelete: (id: string, name: string) => void;
  showDeleteBtn: boolean;
  template: ITemplateDTO;
}

const TemplatePanelItem = ({template, onDelete, onSelect, showDeleteBtn}: IProps) => {
  const handleDelete = (e: any) => {
    e.stopPropagation()
    onDelete(template.id, template.name)
  } 

  return (<Card
    className={styles.templatePanelItem}
    hoverable
    onClick={() => onSelect(template)}
    cover={<img className={styles.avatarImage} alt="example" src={template.avatar || 'https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png'} />}
  >
    <Card.Meta title={template.name} />

    {showDeleteBtn && (
      <div className={styles.deleteButton} onClick={handleDelete}>
        <i className="mtbird-icon mtbird-delete" />
      </div>
    )}
  </Card>)
}

export default TemplatePanelItem