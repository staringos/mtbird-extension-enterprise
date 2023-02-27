import React from "react";
import { Tree, Empty } from "antd";
import type { DataNode } from "antd/es/tree";
import {
  IComponentInstance,
  IExtensionContext,
  IExtensionDTO,
} from "@mtbird/shared/dist/types";
import styles from "./style.module.less";
import { ComponentTreeNode } from "./ComponentTreeNode";
import { IPageConfig } from "@mtbird/shared/dist/types/types/Page";

interface ComponentDataNode extends DataNode {
  component: IComponentInstance;
  selected: boolean;
}

type IProps = {
  extension: IExtensionDTO;
  context: IExtensionContext;
  refresh: () => void;
};

const ExtensionStructureTree: React.FC<IProps> = ({ context }) => {
  const getRootComponent = (page: IPageConfig | null) => {
    if (!page) {
      return null;
    } else {
      return page.data;
    }
  };

  const selectedIds = new Map(
    context.currentComponent.map((item) => [item.id, true])
  );

  const onComponentNodeSelect = (_: any, info: any) => {
    const node: ComponentDataNode = info.node;
    context.selectComponent([node.component]);
  };

  const renderTreeNodes = (
    rootComponent: IComponentInstance,
    components: IComponentInstance[],
    selectedKeys: string[]
  ): React.ReactNode =>
    components.map((component) => {
      const children = component.children;
      const selected =
        rootComponent !== component && selectedIds.get(component.id) === true;
      if (selected) {
        selectedKeys.push(component.id || "");
      }
      const hasChildComponents =
        children && Array.isArray(children) && children.length > 0;

      // Tree/TreeNode can only accept TreeNode as children.
      if (hasChildComponents) {
        return ComponentTreeNode({
          context,
          component,
          selected,
          children: renderTreeNodes(rootComponent, children, selectedKeys),
        });
      } else {
        return ComponentTreeNode({
          context,
          component,
          selected,
        });
      }
    });

  const { page } = context;
  const rootComponent = getRootComponent(page);

  const selectedKeys: string[] = [];
  const nodes =
    rootComponent &&
    renderTreeNodes(rootComponent, [rootComponent], selectedKeys);

  if (nodes) {
    return (
      <Tree
        selectedKeys={selectedKeys}
        defaultExpandAll={true}
        multiple={true}
        onSelect={onComponentNodeSelect}
        className={styles.extensionStructureTree}
        showLine={true}
      >
        {nodes}
      </Tree>
    );
  } else {
    return <Empty></Empty>;
  }
};

export default ExtensionStructureTree;
