import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './components/ExtensionMarketModal';
import ExtensionStructureTree from './components/ExtensionStructureTree';
import TemplatePanel from './components/TemplatePanel';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
  context.registerFeature('enterprise.struct-tree.feature', ExtensionStructureTree)
  context.registerFeature('enterprise.template-panel.feature', TemplatePanel)

};

export default activity;
