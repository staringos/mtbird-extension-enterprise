import { IExtensionContext } from '@mtbird/shared';
import ExtensionMarketModal from './components/ExtensionMarketModal';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', ExtensionMarketModal);
};

export default activity;
