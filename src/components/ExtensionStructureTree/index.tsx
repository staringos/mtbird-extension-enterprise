import React from "react";
import {Tree} from "antd";
import type {DataNode} from "antd/es/tree";
import {IComponentInstance, IExtensionContext, IExtensionDTO,} from "@mtbird/shared/dist/types";
import styles from "./style.module.less";
import ComponentTreeNode from "./ComponentTreeNode";

interface ComponentDataNode extends DataNode {
  component: IComponentInstance;
  selected: boolean;
}

type IProps = {
  extension: IExtensionDTO;
  context: IExtensionContext;
  refresh: () => void;
}

const ExtensionStructureTree = ({ extension, context, refresh }: IProps) => {
  const getRootComponent = () => {
    const page = context.page;
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

  const rootComponent = getRootComponent();
  if (!rootComponent) {
    return;
  }

  const selectedKeys:string[] = []

  const renderTreeNodes = (components: IComponentInstance[]): React.ReactNode =>
    components.map((component) => {
      const type = component.type;
      const children = component.children;
      const selected = rootComponent !== component &&  selectedIds.get(component.id) === true;
      if (selected) {
        selectedKeys.push(component.id || '')
      }
      const hasChildComponents =
        type === "container" &&
        children &&
        Array.isArray(children) &&
        children.length > 0;

        // Tree/TreeNode can only accept TreeNode as children.
      if (hasChildComponents) {
        return ComponentTreeNode({
          context,
          component,
          selected,
          children: renderTreeNodes(children),
        });
      } else {
        return ComponentTreeNode({
          context,
          component,
          selected,
        });
      }
    });

  const nodes = renderTreeNodes([rootComponent]);
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
};

export default ExtensionStructureTree;
