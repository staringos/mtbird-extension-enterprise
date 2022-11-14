import React from "react";
import {Tree} from "antd";
import {CopyOutlined, DeleteOutlined, MinusSquareOutlined,} from "@ant-design/icons";
import type {DataNode} from "antd/es/tree";

import type {IComponentInstance, IExtensionContext,} from "@mtbird/shared/dist/types";
import styles from "./style.module.less";


const { TreeNode } = Tree;

interface IProps {
  context: IExtensionContext;
  component: IComponentInstance;
  selected: boolean;
  children?: React.ReactNode;
}

interface ComponentDataNode extends DataNode {
  component: IComponentInstance;
  selected: boolean;
}

export const ComponentTreeNode : React.FC<IProps> = ({
  context,
  component,
  selected,
  children,
}) => {
  const titleText = getTitleText(context, component);
  const isLeaf = !Array.isArray(component.children) || component.children.length <= 0

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

function getTitleText(context: IExtensionContext, component: IComponentInstance) {
  let componentName = context.registeredComponents && context.registeredComponents[component.componentName] && context.registeredComponents[component.componentName].title;

  if (typeof componentName !== 'string' || componentName.length <= 0) {
    componentName = component.componentName
  }

  if (typeof component.children === 'number' || typeof component.children === 'string') {
    return `${componentName}${getSubtitleText(component)}`;
  } else {
    return componentName;
  }
}
function getSubtitleText(component: IComponentInstance) {
    let subtitleText = `${component.children}`;
    if (subtitleText.length > 4) {
        subtitleText = subtitleText.substring(0, 4) + "…";
    }
    return ` (${subtitleText})`;
}
