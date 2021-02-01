"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerClient = exports.WorkerConfig = void 0;
const utils_1 = require("../utils");
const providers_1 = require("./providers");
class WorkerConfig {
    constructor(config, monaco) {
        this._config = config;
        this._monaco = monaco;
        this._onDidChange = new this._monaco.Emitter();
    }
    // @ts-ignore
    get onDidChange() {
        return this._onDidChange.event;
    }
    dispose() {
        this._onDidChange.dispose();
    }
    get config() {
        return this._config;
    }
    get languageId() {
        return this._config.languageId;
    }
    get label() {
        return this._config.label;
    }
    get providers() {
        return this._config.providers;
    }
    get options() {
        return this._config.options;
    }
    setConfig(config) {
        this._config = Object.assign({}, this._config, config);
        this._onDidChange.fire(this._config);
    }
    setOptions(options) {
        this._config.options = Object.assign({}, this._config.options, options);
        this._onDidChange.fire(this._config);
    }
}
exports.WorkerConfig = WorkerConfig;
const STOP_WHEN_IDLE_FOR = 10 * 60 * 1000; // 2min
class WorkerClient {
    constructor({ languageId, label = languageId, src, options, providers = providers_1.defaultProviderConfig, timeoutDelay = STOP_WHEN_IDLE_FOR, }, monaco) {
        this._config = new WorkerConfig({
            languageId,
            label,
            src,
            options,
            providers,
            timeoutDelay,
        }, monaco);
        this._monaco = monaco;
        this._idleCheckInterval = window.setInterval(() => this._checkIfIdle(), 30 * 1000);
        this._lastUsedTime = 0;
        this._worker = null;
        this._client = null;
        const stopWorkerConfigListener = this._config.onDidChange(() => this._stopWorker());
        const registerProviderListener = this._config.onDidChange(() => this._registerProviders());
        this._providerDisposables = [];
        this._disposables = [
            stopWorkerConfigListener,
            registerProviderListener,
            this._config,
        ];
        this._registerProviders();
    }
    get src() {
        return this._config.config.src;
    }
    get timeoutDelay() {
        return this._config.config.timeoutDelay;
    }
    _stopWorker() {
        if (this._worker) {
            this._worker.dispose();
            this._worker = null;
        }
        this._client = null;
    }
    dispose() {
        clearInterval(this._idleCheckInterval);
        utils_1.disposeAll(this._disposables);
        this._stopWorker();
    }
    _registerProviders() {
        if (this.config.languageId) {
            utils_1.disposeAll(this._providerDisposables);
            this._providerDisposables = providers_1.setupWorkerProviders(this.config.languageId, this.config.providers, this, this._monaco);
            this._disposables.push(utils_1.asDisposable(this._providerDisposables));
        }
    }
    get config() {
        return this._config;
    }
    get onConfigDidChange() {
        return this._config.onDidChange;
    }
    _checkIfIdle() {
        if (!this._worker) {
            return;
        }
        let timePassedSinceLastUsed = Date.now() - this._lastUsedTime;
        if (timePassedSinceLastUsed > this.timeoutDelay) {
            this._stopWorker();
        }
    }
    _getClient() {
        this._lastUsedTime = Date.now();
        if (!this._client) {
            const _this = this;
            this._worker = this._monaco.editor.createWebWorker(
            // new Proxy(
            //   {},
            //   {
            //     get: function (target, prop, receiver) {
            //       console.log(prop);
            //       if (prop === 'getModel') {
            //         return _this._monaco.editor.getModel;
            //       }
            //       if (prop === 'getModels') {
            //         return _this._monaco.editor.getModels;
            //       }
            //       throw new Error('Invalid operation on getModel');
            //     },
            //   }
            // ),
            // @ts-ignore
            {
                moduleId: this.config.label,
                // this._monaco.worker.environment.workerLoader,
                label: this.config.label,
                createData: {
                    ...this.config.options,
                },
            });
            this._client = this._worker.getProxy();
        }
        return this._client;
    }
    async getSyncedWorker(...resources) {
        const client = await this._getClient();
        await this._worker?.withSyncedResources(resources);
        return client;
    }
}
exports.WorkerClient = WorkerClient;
// @ts-ignore
//# sourceMappingURL=worker-client.js.map