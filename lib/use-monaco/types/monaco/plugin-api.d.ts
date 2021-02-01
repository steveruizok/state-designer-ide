import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace plugin {
        interface IPlugin {
            (monaco: typeof monacoApi): monacoApi.IDisposable | void | Promise<void> | Promise<monacoApi.IDisposable>;
            dependencies?: string[];
            label?: string;
        }
        interface IRemotePlugin {
            dependencies?: string[];
            name?: string;
            url?: string;
            format?: 'url';
        }
        function isInstalled(name: string): boolean;
        function install(...plugins: (IPlugin | IRemotePlugin)[]): Promise<monacoApi.IDisposable>;
    }
}
export declare const createPlugin: ({ dependencies, name, format, ...other }: {
    dependencies?: string[];
    name?: string;
    format?: 'url' | 'local';
}, plugin: monacoApi.plugin.IPlugin) => monacoApi.plugin.IPlugin;
export declare const compose: (...plugins: monacoApi.plugin.IPlugin[]) => monacoApi.plugin.IPlugin;
export declare const createRemotePlugin: ({ dependencies, name, url, fetchOptions, }: {
    dependencies?: string[];
    name?: string;
    url?: string;
    fetchOptions?: object;
}) => monacoApi.plugin.IPlugin;
declare const _default: (monaco: typeof monacoApi) => typeof monacoApi;
export default _default;
