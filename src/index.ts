import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './features/ExtensionMarketModal';
import ExtensionStructureTree from './features/ExtensionStructureTree';
import TemplatePanel from './features/TemplatePanel';
import ExtensionBlockContainerPanel from './features/ExtensionBlockContainerPanel'
import ExtensionHistoryPanel from "./features/ExtensionHistoryPanel";
import FormTab from './features/FormTab';
import CSSEditor from './features/CSSEditor';
import EventPanel from './features/EventPanel';
import VariablePanel from './features/VariablePanel';
import DataPanel from './features/DataPanel';
import ComponentLibsPanel from './features/ComponentLibsPanel';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
  context.registerFeature('enterprise.struct-tree.feature', ExtensionStructureTree);
  context.registerFeature('enterprise.template-panel.feature', TemplatePanel);
  context.registerFeature('enterprise.block-container-panel.feature', ExtensionBlockContainerPanel);
  context.registerFeature('enterprise.history.feature', ExtensionHistoryPanel);
  context.registerFeature('enterprise.form-tab.feature', FormTab);
  context.registerFeature('enterprise.event-panel.feature', EventPanel);
  context.registerFeature('enterprise.css-editor.feature', CSSEditor);
  context.registerFeature('enterprise.variable-panel.feature', VariablePanel);
  context.registerFeature('enterprise.data-panel.feature', DataPanel);
  context.registerFeature('enterprise.component-libs-panel.feature', ComponentLibsPanel)
};

export default activity;
