import { ITemplateDTO, IExtensionContext } from "@mtbird/shared";
import { Pagination } from "antd";
import React, { useEffect, useState } from "react";
import { deleteTemplate, getTemplateList } from "src/services/template";
import TemplatePanelItem from "../TemplatePanelItem";
import { Modal, message } from "antd";
// import { ExclamationCircleOutlined } from '@ant-design/icons';
import styles from "./style.module.less";

const { confirm } = Modal;

interface IProps {
  scope?: string;
  componentName?: string;
  showDeleteBtn: boolean;
  context: IExtensionContext;
}

const TemplateList = ({
  showDeleteBtn,
  context,
  scope,
  componentName,
}: IProps) => {
  const [data, setData] = useState<any>({ data: [], total: 0 });
  const [pagination, setPagination] = useState({
    pageNum: 1,
    pageSize: 10,
  });

  const handleSelect = (template: ITemplateDTO) => {
    context.addComponent(template.content);
    message.success("操作成功!");
  };

  const refresh = async () => {
    const data = await getTemplateList(
      context,
      scope as string,
      pagination,
      context.storage.getItem("TSK"),
      componentName
    );
    setData(data.data);
  };

  useEffect(() => {
    refresh();
  }, [scope, pagination]);

  useEffect(() => {
    context.eventHub.on(context.EVENT_KEYS.TEMPLATE_ADDED, refresh);
    return () => {
      context.eventHub.off(context.EVENT_KEYS.TEMPLATE_ADDED, refresh);
    };
  }, []);

  const handlePageChange = (pageNum: number) => {
    setPagination({
      ...pagination,
      pageNum,
    });
  };

  const handleToDelete = (id: string, name: string) => {
    confirm({
      icon: <i className="mtbird-icon mtbird-warning-circle" />,
      content: `确定要删除模版(${name})吗？`,
      onOk: async () => {
        await deleteTemplate(context, id);
        message.success("操作成功!");
        refresh();
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  return (
    <div className={styles.templatePanelWrapper}>
      <div className={styles.templatePanelList}>
        {data?.data?.map((cur: any) => {
          return (
            <TemplatePanelItem
              template={cur}
              key={cur.id}
              showDeleteBtn={showDeleteBtn}
              onSelect={handleSelect}
              onDelete={handleToDelete}
            />
          );
        })}
      </div>
      <Pagination
        className={styles.templatePanelPagination}
        size="small"
        current={pagination.pageNum}
        total={data.total}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default TemplateList;
