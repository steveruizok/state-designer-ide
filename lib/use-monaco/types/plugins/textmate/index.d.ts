import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace languages {
        let registerSyntax: (language: string, syntax?: monacoApi.plugin.textmate.SyntaxSource) => Promise<void>;
        interface ILanguageExtensionPoint {
            /**
             * eg. () => import('./typescript')
             **/
            syntax?: monacoApi.plugin.textmate.SyntaxSource;
        }
    }
    namespace plugin {
        namespace textmate {
            type SyntaxSource = {
                format?: 'url';
                scopeName?: string;
                url?: string;
                responseFormat?: 'json' | 'plist';
            } | {
                format?: 'json';
                scopeName?: string;
                content?: '';
            };
        }
    }
}
declare const _default: () => monacoApi.plugin.IPlugin;
export default _default;
