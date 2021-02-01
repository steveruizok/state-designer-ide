import React from 'react';
import type * as monacoApi from 'monaco-editor';
import { basicLanguagePlugins } from '../monaco';
import { pluginMap } from '../plugins';
declare type Monaco = typeof monacoApi;
declare global {
    interface Window {
        monaco: Monaco;
    }
}
export declare type MonacoProp = {
    monaco?: Monaco | undefined | null;
};
declare type PromiseOrNot<T> = Promise<T> | T;
export interface UseMonacoOptions extends Partial<Omit<monacoApi.LoaderOptions, 'plugins' | 'languages'>> {
    onLoad?: (monaco: typeof monacoApi) => PromiseOrNot<monacoApi.IDisposable | monacoApi.IDisposable[] | void | undefined>;
    themes?: any;
    defaultEditorOptions?: monacoApi.editor.IEditorOptions;
    plugins?: (keyof typeof pluginMap | [keyof typeof pluginMap, any] | monacoApi.plugin.IPlugin)[];
    languages?: (keyof typeof basicLanguagePlugins | [keyof typeof basicLanguagePlugins, any] | monacoApi.plugin.IPlugin)[];
    onThemeChange?: (theme: any, monaco: typeof monacoApi) => PromiseOrNot<void>;
    theme?: string | monacoApi.editor.IStandaloneThemeData | (() => PromiseOrNot<monacoApi.editor.IStandaloneThemeData>);
}
interface CreatedMonacoContext {
    monaco: Monaco;
    isLoading: boolean;
    useMonacoEffect: (cb: (monaco?: Monaco) => void | (() => void), deps?: any[]) => void;
    defaultEditorOptions?: monacoApi.editor.IEditorOptions;
}
declare const MonacoProvider: React.FC<React.PropsWithChildren<UseMonacoOptions>>;
export { MonacoProvider };
export declare function useMonacoContext(): CreatedMonacoContext;
export declare const useMonaco: ({ plugins, languages, defaultEditorOptions, onLoad, theme, themes, onThemeChange, ...loaderOptions }?: UseMonacoOptions) => CreatedMonacoContext;
