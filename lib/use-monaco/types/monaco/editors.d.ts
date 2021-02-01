import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace editor {
        interface IEditorOptions {
            formatOnSave?: boolean;
        }
        function onDidCreateEditor(listener: (editor: monacoApi.editor.IStandaloneCodeEditor) => void): monacoApi.IDisposable;
        function getFocusedEditor(): monacoApi.editor.IStandaloneCodeEditor;
        function getEditors(): monacoApi.editor.IStandaloneCodeEditor[];
    }
}
declare const _default: monacoApi.plugin.IPlugin;
export default _default;
