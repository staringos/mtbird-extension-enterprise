import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './features/ExtensionMarketModal';
import ExtensionStructureTree from './features/ExtensionStructureTree';
import TemplatePanel from './features/TemplatePanel';
import ExtensionBlockContainerPanel from './features/ExtensionBlockContainerPanel'
import ExtensionHistoryPanel from "./features/ExtensionHistoryPanel";
import FormTab from './features/FormTab';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
  context.registerFeature('enterprise.struct-tree.feature', ExtensionStructureTree)
  context.registerFeature('enterprise.template-panel.feature', TemplatePanel)
  context.registerFeature('enterprise.block-container-panel.feature', ExtensionBlockContainerPanel)
  context.registerFeature('enterprise.history.feature', ExtensionHistoryPanel)
  context.registerFeature('enterprise.form-tab.feature', FormTab)
};

export default activity;
