import type * as monacoApi from 'monaco-editor';
declare type Monaco = typeof monacoApi;
declare module 'monaco-editor' {
    interface LoaderOptions {
        monacoPath: string;
        workersPath: string;
        languagesPath: string;
        monacoCorePkg: string;
        cdn: string;
        monacoVersion: string;
        plugins: monacoApi.plugin.IPlugin[];
        languages: monacoApi.plugin.IPlugin[];
    }
    let loader: LoaderOptions;
}
export interface CancellablePromise<T> extends Promise<T> {
    cancel: () => void;
}
export declare function loadMonaco(options: Partial<monacoApi.LoaderOptions>): CancellablePromise<Monaco>;
export declare class MonacoLoader {
    config: any;
    constructor();
    resolve: any;
    reject: any;
    injectScripts(script: HTMLScriptElement): void;
    handleMainScriptLoad: () => void;
    createScript(src?: string): HTMLScriptElement;
    createMonacoLoaderScript(mainScript: HTMLScriptElement): HTMLScriptElement;
    createMainScript(): HTMLScriptElement;
    isInitialized: boolean;
    wrapperPromise: Promise<typeof monacoApi>;
    init(config: any): CancellablePromise<Monaco>;
}
export declare const monacoLoader: MonacoLoader;
export {};
