import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace plugin {
        let prettier: {
            enable: (languageId: string, options?: any) => monacoApi.IDisposable;
        };
    }
}
declare const _default: (prettierOptions?: any, { workerSrc }?: {
    workerSrc?: string | (() => Worker);
}) => monacoApi.plugin.IPlugin;
export default _default;
