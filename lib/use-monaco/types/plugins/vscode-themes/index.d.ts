import type * as monacoApi from 'monaco-editor';
import { IVSCodeTheme } from './vscode-to-monaco-theme';
declare module 'monaco-editor' {
    namespace editor {
        function defineTheme(themeName: string, theme: monacoApi.editor.IStandaloneThemeData | IVSCodeTheme): void;
        function setTheme(themeName: string | monacoApi.editor.IStandaloneThemeData | IVSCodeTheme): void;
    }
}
declare const _default: ({ transformTheme, polyfill }?: {
    transformTheme?: (t: any) => any;
    polyfill?: boolean;
}) => monacoApi.plugin.IPlugin;
export default _default;
