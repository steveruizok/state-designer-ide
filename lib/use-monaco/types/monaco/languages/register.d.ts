import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace languages {
        interface ILanguageExtensionPoint {
            /**
             * eg. () => import('./typescript')
             **/
            loader?: () => Promise<ILangImpl>;
            worker?: Omit<worker.IWorkerConfig<any>, 'languageId'> | boolean;
        }
        interface ILangImpl {
            conf: LanguageConfiguration;
            language: IMonarchLanguage;
        }
    }
}
declare const _default: monacoApi.plugin.IPlugin;
export default _default;
