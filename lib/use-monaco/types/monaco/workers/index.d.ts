import type * as monacoApi from 'monaco-editor';
declare module 'monaco-editor' {
    namespace worker {
        interface IWorkerAccessor<TWorker> {
            (...uris: monacoApi.Uri[]): Promise<TWorker>;
        }
        interface IWorkerConfig<TOptions> {
            label?: string;
            languageId?: string;
            src?: string | (() => Worker);
            options?: TOptions;
            timeoutDelay?: number;
            providers?: boolean | monacoApi.worker.ILangProvidersOptions;
        }
        interface IWorkerRegistrationOptions<T> extends IWorkerConfig<T> {
            onRegister?: (client: any, monaco: typeof monacoApi) => void;
        }
        function register<TOptions>(config: worker.IWorkerConfig<TOptions>): monacoApi.IDisposable;
        function setup(basePath?: string): void;
        function getClient<TOptions, TWorker extends any>(label: string): any;
        function getWorker<TWorker extends any>(label: string, ...uri: monacoApi.Uri[]): Promise<TWorker>;
        function setEnvironment(environment?: Environment): void;
        function updateConfig<TOptions>(label: string, config?: Omit<monacoApi.worker.IWorkerConfig<TOptions>, 'languageId' | 'label'>): void;
        function updateOptions<TOptions>(label: string, options?: TOptions): void;
    }
}
declare const _default: monacoApi.plugin.IPlugin;
export default _default;
