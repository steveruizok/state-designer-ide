import type * as monacoApi from 'monaco-editor';
import { MonacoProp } from './useMonaco';
export interface UseEditorOptions {
    onChange?: (newValue: string, editor: monacoApi.editor.IStandaloneCodeEditor, event: monacoApi.editor.IModelContentChangedEvent, monaco: typeof monacoApi) => void;
    overrideServices?: monacoApi.editor.IEditorOverrideServices | ((monaco: typeof monacoApi) => monacoApi.editor.IEditorOverrideServices);
    options?: monacoApi.editor.IEditorOptions;
    onEditorDidMount?: (editor: monacoApi.editor.IStandaloneCodeEditor, monaco: typeof monacoApi) => monacoApi.IDisposable[] | Promise<void> | void;
}
export declare const useEditor: ({ options, onEditorDidMount, model, monaco: customMonaco, overrideServices, onChange, }: UseEditorOptions & MonacoProp & {
    model: monacoApi.editor.ITextModel;
}) => {
    containerRef: (el: any) => void;
    useEditorEffect: (effect: (obj: monacoApi.editor.IStandaloneCodeEditor) => void, deps: any[]) => void;
    editor: monacoApi.editor.IStandaloneCodeEditor;
};
