import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './components/ExtensionMarketModal';
import ExtensionStructureTree from './components/ExtensionStructureTree';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
  context.registerFeature('enterprise.struct-tree.feature', ExtensionStructureTree)
};

export default activity;
