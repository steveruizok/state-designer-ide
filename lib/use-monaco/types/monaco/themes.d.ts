import * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace editor {
        function setTheme(themeName: string | monacoApi.editor.IStandaloneThemeData): void;
        function getTheme(themeName: string): monacoApi.editor.IStandaloneThemeData | null;
        function getDefinedThemes(): {
            [key: string]: monacoApi.editor.IStandaloneThemeData;
        };
        function defineThemes(themes: {
            [key: string]: monacoApi.editor.IStandaloneThemeData;
        }): void;
        function onDidChangeTheme(listener: (theme: {
            name: string;
            theme: monacoApi.editor.IStandaloneThemeData;
        }) => void): monacoApi.IDisposable;
    }
}
declare const _default: monacoApi.plugin.IPlugin;
export default _default;
