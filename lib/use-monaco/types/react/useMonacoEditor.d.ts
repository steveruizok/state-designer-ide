import { UseTextModelOptions } from './useTextModel';
import { UseEditorOptions } from './useEditor';
import { UseMonacoOptions } from './useMonaco';
export declare const useMonacoEditor: ({ modelOptions, path, defaultContents, contents, language, onEditorDidMount, options, overrideServices, onChange, ...loaderOptions }?: UseEditorOptions & UseTextModelOptions & UseMonacoOptions) => {
    monaco: typeof import("monaco-editor");
    isLoading: boolean;
    model: import("monaco-editor").editor.ITextModel;
    containerRef: (el: any) => void;
    editor: import("monaco-editor").editor.IStandaloneCodeEditor;
};
