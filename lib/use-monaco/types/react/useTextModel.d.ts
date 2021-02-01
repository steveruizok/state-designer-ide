import type * as monacoApi from 'monaco-editor';
import { MonacoProp } from './useMonaco';
export interface UseTextModelOptions {
    path?: string;
    defaultContents?: string;
    contents?: string;
    onChange?: (value: string, event: monacoApi.editor.IModelContentChangedEvent, model: monacoApi.editor.ITextModel) => void;
    language?: string;
    modelOptions?: monacoApi.editor.ITextModelUpdateOptions;
}
export declare const useTextModel: ({ monaco: customMonaco, contents, language, modelOptions, onChange, defaultContents, path, }: UseTextModelOptions & MonacoProp) => monacoApi.editor.ITextModel;
