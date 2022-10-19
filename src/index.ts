import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './components/ExtensionMarketModal';
import ExtensionStructureTree from './components/ExtensionStructureTree';
import TemplatePanel from './components/TemplatePanel';
import ExtensionBlockContainerPanel from './components/ExtensionBlockContainerPanel'

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
  context.registerFeature('enterprise.struct-tree.feature', ExtensionStructureTree)
  context.registerFeature('enterprise.template-panel.feature', TemplatePanel)
  context.registerFeature('enterprise.block-container-panel.feature', ExtensionBlockContainerPanel)
};

export default activity;
