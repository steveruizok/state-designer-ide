"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_client_1 = require("./worker-client");
const utils_1 = require("../utils");
const utils_2 = require("../utils");
const plugin_api_1 = require("../plugin-api");
exports.default = plugin_api_1.createPlugin({ name: 'core.workers', dependencies: ['core.editors', 'core.loader'] }, (monaco) => {
    console.log('[monaco] base worker path:', monaco.loader.workersPath);
    const javascriptClient = {
        getSyncedWorker: async (...resources) => {
            const getWorker = await monaco.languages.typescript?.getJavaScriptWorker();
            return await getWorker(...resources);
        },
        src: monaco.loader.workersPath + 'ts.monaco.worker.js',
        // @ts-ignore
        config: monaco.languages.typescript?.javascriptDefaults ?? {},
    };
    const typescriptClient = {
        getSyncedWorker: async (...resources) => {
            const getWorker = await monaco.languages.typescript?.getTypeScriptWorker();
            return await getWorker(...resources);
        },
        src: monaco.loader.workersPath + 'ts.monaco.worker.js',
        // @ts-ignore
        config: monaco.languages.typescript?.typescriptDefaults ?? {},
    };
    const defaultClients = (basePath) => ({
        typescript: {
            ...typescriptClient,
            src: basePath + 'ts.monaco.worker.js',
        },
        javascript: {
            ...javascriptClient,
            src: basePath + 'ts.monaco.worker.js',
        },
        editorWorkerService: {
            src: basePath + 'editor.monaco.worker.js',
        },
        html: {
            src: basePath + 'html.monaco.worker.js',
        },
        css: {
            src: basePath + 'css.monaco.worker.js',
        },
        json: {
            src: basePath + 'json.monaco.worker.js',
        },
    });
    class MonacoWorkerApi {
        constructor() {
            this.workerClients = defaultClients;
            this._workers = {};
            this.workerClients = {
                ...this.workerClients,
                ...defaultClients(utils_2.endingSlash(monaco.loader.workersPath)),
            };
            this.setEnvironment({
                getWorker: (label) => {
                    const workerSrc = this.workerClients[label].src;
                    console.log(`[monaco] loading worker: ${label}`);
                    if (typeof workerSrc === 'string') {
                        var workerBlobURL = createBlobURL(`importScripts("${workerSrc}")`);
                        return new Worker(workerBlobURL, {
                            name: label,
                        });
                    }
                    else {
                        return workerSrc();
                    }
                },
            });
        }
        _registerWorker({ onRegister, ...config }) {
            ``;
            console.log(`[monaco] registering worker: ${config.label}`, config);
            const client = new worker_client_1.WorkerClient(config, monaco);
            this.workerClients[config.label ?? ''] = client;
            if (onRegister) {
                onRegister(client, monaco);
            }
            return client;
        }
        register(config) {
            // if (config.languageId) {
            //   return monaco.languages.onLanguage(config.languageId, () => {
            //     return this._registerWorker(config);
            //   });
            // } else {
            return this._registerWorker(config);
            // }
        }
        getClient(label) {
            if (!this.workerClients[label]) {
                throw new Error(`Worker ${label} not registered!`);
            }
            return this.workerClients[label];
        }
        async getWorker(label, ...uri) {
            if (uri.length === 0) {
                const editorUri = monaco.editor.getFocusedEditor()?.getModel()?.uri;
                editorUri && uri.push(editorUri);
            }
            return this.getClient(label).getSyncedWorker(...uri);
        }
        setConfig(label, config) {
            this.getClient(label).config.setConfig(config);
        }
        updateOptions(label, options) {
            this.getClient(label).config.setOptions(options);
        }
        setEnvironment({ getWorkerUrl = utils_1.noop, getWorker = utils_1.noop, baseUrl = undefined, }) {
            if (baseUrl || getWorker || getWorkerUrl) {
                const getWorkerPath = (_moduleId, label) => {
                    const url = getWorkerUrl?.(label);
                    if (url)
                        return url;
                    return undefined;
                };
                // @ts-ignore
                window.MonacoEnvironment = {
                    // baseUrl: baseUrl,
                    getWorker: (_moduleId, label) => {
                        const worker = getWorker?.(label);
                        if (worker) {
                            return worker;
                        }
                        const url = getWorkerPath(_moduleId, label);
                        if (url) {
                            return new Worker(url, {
                                name: label,
                            });
                        }
                        return null;
                    },
                };
            }
            this.environment = { baseUrl, getWorker, getWorkerUrl };
        }
    }
    Object.assign(monaco, {
        worker: new MonacoWorkerApi(),
    });
});
function createBlobURL(workerSrc) {
    var workerSrcBlob, workerBlobURL;
    workerSrcBlob = new Blob([workerSrc], {
        type: 'text/javascript',
    });
    workerBlobURL = window.URL.createObjectURL(workerSrcBlob);
    return workerBlobURL;
}
//# sourceMappingURL=index.js.map