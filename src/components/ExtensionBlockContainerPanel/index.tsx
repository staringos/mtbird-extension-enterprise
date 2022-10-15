import React from "react";

import {Button} from 'antd';
// @ts-ignore
import styles from "./style.module.less";
import {IExtensionContext, IExtensionDTO} from "@mtbird/shared";
import { SchemaGenerator } from '@mtbird/core';
import {IComponentInstance} from "@mtbird/shared/dist/types/types/Component";
import {BlockItem} from './BlockItem'

type IProps = {
    extension: IExtensionDTO;
    context: IExtensionContext;
    refresh: () => void;
}

const ExtensionBlockContainerPanel: React.FC<IProps> = ({context}) => {
    const getAllBlocks = (): IComponentInstance[] => {
        const components = context.page?.data?.children;
        if (!Array.isArray(components)) {
            return []
        }
        return components.filter(component => component.componentName === 'ContainerBlock')
    }

    const selectedIds = new Map(
        context.currentComponent.map((item) => [item.id, true])
    );

    SchemaGenerator.container([], {})

    const addBlankBlock = () => {
        context.addComponent({
            type: 'container',
            componentName: 'ContainerBlock',
            props: {
                style: {
                    position: 'relative',
                    height: 500
                }
            },
            children: []
        } as any)
    }

    const toTemplateTab = () => {
        context.eventHub.emit(context.EVENT_KEYS.TOOLBAR_SWITCH, {
            target: '模版',
            params: {
                filter: {
                    componentName: 'ContainerBlock'
                }
            }
        })
    }

    return <div className={styles.extensionBlockContainerPanel}>
        <div className={styles.actions}>
            <Button size="small" onClick={addBlankBlock}>+ 空白</Button>
            <Button size="small" onClick={toTemplateTab}>模版</Button>
        </div>
        <div className={styles.blocks}>
            {getAllBlocks().map(block =>
                <BlockItem key={`block-${block.id}`}
                           isSelected={!!selectedIds.get(block.id)}
                           context={context}
                           block={block}
                ></BlockItem>)}
        </div>
    </div>
}

export default ExtensionBlockContainerPanel