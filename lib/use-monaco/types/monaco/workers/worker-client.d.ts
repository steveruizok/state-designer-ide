import type * as monacoApi from 'monaco-editor';
export declare class WorkerConfig<TOptions> implements monacoApi.IDisposable, monacoApi.worker.IWorkerConfig<TOptions> {
    _monaco: typeof monacoApi;
    private _onDidChange;
    private _config;
    constructor(config: monacoApi.worker.IWorkerConfig<TOptions>, monaco: typeof monacoApi);
    get onDidChange(): monacoApi.IEvent<monacoApi.worker.IWorkerConfig<TOptions>>;
    dispose(): void;
    get config(): monacoApi.worker.IWorkerConfig<TOptions>;
    get languageId(): string;
    get label(): string;
    get providers(): boolean | monacoApi.worker.ILangProvidersOptions;
    get options(): TOptions;
    setConfig(config: monacoApi.worker.IWorkerConfig<TOptions>): void;
    setOptions(options: TOptions): void;
}
export declare class WorkerClient<TOptions, TWorker> implements monacoApi.IDisposable {
    private _config;
    private _idleCheckInterval;
    private _lastUsedTime;
    private _worker;
    private _client;
    private _providerDisposables;
    private _disposables;
    _monaco: typeof monacoApi;
    constructor({ languageId, label, src, options, providers, timeoutDelay, }: monacoApi.worker.IWorkerConfig<TOptions>, monaco: typeof monacoApi);
    get src(): string | (() => Worker);
    get timeoutDelay(): number;
    private _stopWorker;
    dispose(): void;
    _registerProviders(): void;
    get config(): WorkerConfig<TOptions>;
    get onConfigDidChange(): monacoApi.IEvent<monacoApi.worker.IWorkerConfig<TOptions>>;
    private _checkIfIdle;
    private _getClient;
    getSyncedWorker(...resources: monacoApi.Uri[]): Promise<TWorker>;
}
