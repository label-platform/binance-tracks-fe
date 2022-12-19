import { plugin as ethereumPlugin } from './plugins/ethereum';
import { IPlugin } from './common/plugin';

interface IPluginMap {
    [key: string]: IPlugin;
}
const pluginMap: IPluginMap = {
    ethereum: ethereumPlugin,
};

export function getPluginByType<T extends IPlugin>(type = 'ethereum'): T {
    return pluginMap[type] as T;
}
