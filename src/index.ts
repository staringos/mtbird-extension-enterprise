import { IExtensionContext } from '@mtbird/shared';
import Example from './components/Example';

const activity = (context: IExtensionContext) => {
  context.registerFeature('enterprise.market.modal', Example);
};

export default activity;
