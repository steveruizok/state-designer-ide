import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace languages.typescript {
        function loadTypes(name: string, version: string): Promise<{
            [key: string]: string;
        }>;
        function exposeGlobal(imports: string, exports: string): void;
    }
}
declare const _default: (compilerOptions?: monacoApi.languages.typescript.CompilerOptions) => monacoApi.plugin.IPlugin;
export default _default;
