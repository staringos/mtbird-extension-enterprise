import React, { useEffect, useRef } from "react";
import { Tree } from "antd";
import {
  MinusSquareOutlined,
  CopyOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { DataNode } from "antd/es/tree";

import type {
  IExtensionContext,
  IComponentInstance,
} from "@mtbird/shared/dist/types";

const { TreeNode } = Tree;

interface IProps {
  context: IExtensionContext;
  component: IComponentInstance;
  selected: boolean;
  children?: React.ReactNode;
}

const ComponentNames = {
  ContainerRoot: "页面根组件",
  Button: "按钮",
  Text: "文本",
  ContainerBlock: "区块组件",
  ButtonGroup: '按钮组',
  Container: '容器',
  Image: '图片',
  SplitLine: '分割线',
  Video: '视频',
  Shape: '形状'
};

import styles from "./style.module.less";

interface ComponentDataNode extends DataNode {
  component: IComponentInstance;
  selected: boolean;
}

export default function ComponentTreeNode({
  context,
  component,
  selected,
  children,
}: IProps) {
  const type = component.type;
  const titleText = getTitleText(component);
  const isLeaf = type !== "container";

  const copyDidClick = () => {
    context.copyComponent();
  };

  const deleteDidClick = () => {
    context.deleteComponent();
  };

  const title = (
    <div className={styles.title}>
      <span>{titleText}</span>
      {selected && (
        <>
          <div className={styles.action} onClick={copyDidClick}>
            <CopyOutlined />
          </div>
          <div className={styles.action} onClick={deleteDidClick}>
            <DeleteOutlined />
          </div>
        </>
      )}
    </div>
  );

  const nodeData: ComponentDataNode = {
    title,
    key: `${component.id}`,
    component: component,
    selected,
    isLeaf,
    switcherIcon: isLeaf ? <MinusSquareOutlined /> : undefined,
  };
  return (
    <TreeNode
      {...nodeData}
      data={nodeData}
      className={styles.componentTreeNode}
    >
      {children}
    </TreeNode>
  );
}

function getTitleText(component: IComponentInstance) {
  const componentName =
    ComponentNames[component.componentName] || component.componentName;
  if (component.type === "form" || component.componentName === "Text") {
    const subtitleText = getSubtitleText(component);
    return `${componentName}${subtitleText}`;
  } else {
    return componentName;
  }

  function getSubtitleText(component: IComponentInstance) {
    if (!component.children) {
      return "";
    }
    let subtitleText = `${component.children}`;
    if (subtitleText.length > 4) {
      subtitleText = subtitleText.substring(0, 4) + "…";
    }
    return ` (${subtitleText})`;
  }
}
