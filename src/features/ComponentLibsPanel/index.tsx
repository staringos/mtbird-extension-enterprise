import React, { useState } from "react";
import {
  IComponentInstance,
  IComponentLibs,
  IExtensionFeatureProps,
} from "@mtbird/shared";
import { SchemaSelect, ToolBoxList } from "@mtbird/ui";
import styles from "./style.module.less";
import values from "lodash/values";

const ComponentLibsPanel = ({ context }: IExtensionFeatureProps) => {
  const [mode, setMode] = useState("templates");
  const { componentLibs, addComponent, registeredComponents } = context;
  console.log("componentLibs:", componentLibs);
  const [currentLib, setCurrentLib] = useState(componentLibs?.[0]?.key);

  const handleChange = (e: any) => {
    console.log("e:", e);
    console.log("res.componentLibs:", componentLibs);
    setCurrentLib(e);
  };

  const handleAddComponent = (component: IComponentInstance) => {
    context.addComponent(component);
  };

  const list = values(registeredComponents).filter(
    (cur: IComponentInstance) =>
      cur.componentLib && cur.componentLib === currentLib
  );

  console.log("rrrr registeredComponents:", registeredComponents);
  console.log("rrrr cccc currentLib:", currentLib);

  const options = componentLibs
    ? componentLibs.map((cur: any) => ({ label: cur.title, value: cur.key }))
    : [];

  return (
    <div className={styles.componentLibsWrapper}>
      <div>
        <SchemaSelect
          value={currentLib}
          options={options}
          onChange={handleChange}
        />
      </div>
      <div className={styles.componentList}>
        {registeredComponents && (
          <ToolBoxList list={list} onItemClick={handleAddComponent} />
        )}
      </div>
    </div>
  );
};

export default ComponentLibsPanel;
