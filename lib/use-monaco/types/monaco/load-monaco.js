"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.monacoLoader = exports.MonacoLoader = exports.loadMonaco = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const plugin_api_1 = tslib_1.__importDefault(require("./plugin-api"));
const register_1 = tslib_1.__importDefault(require("./languages/register"));
const themes_1 = tslib_1.__importDefault(require("./themes"));
const editors_1 = tslib_1.__importDefault(require("./editors"));
const shortcuts_1 = tslib_1.__importDefault(require("./shortcuts"));
const workers_1 = tslib_1.__importDefault(require("./workers"));
const plugin_api_2 = require("./plugin-api");
const version_1 = tslib_1.__importDefault(require("./utils/version"));
const merge = (target, source) => {
    Object.keys(source).forEach((key) => {
        if (source[key] instanceof Object)
            target[key] &&
                Object.assign(source[key], merge(target[key], source[key]));
    });
    return { ...target, ...source };
};
function cdnPath(root, pkg, version, path) {
    return `${utils_1.endingSlash(root)}${pkg}@${version}${path}`;
}
function loadMonaco(options) {
    const { monacoVersion = '0.21.2', monacoCorePkg = 'monaco-editor-core', cdn = 'https://cdn.jsdelivr.net/npm', monacoPath = utils_1.endingSlash(cdnPath(cdn, monacoCorePkg, monacoVersion, '/')), workersPath = utils_1.endingSlash(cdnPath(cdn, 'use-monaco', version_1.default, '/dist/workers/')), languagesPath = utils_1.endingSlash(cdnPath(cdn, 'use-monaco', version_1.default, '/dist/languages/')), plugins = [], languages = [], } = options;
    const loaderPlugin = plugin_api_2.createPlugin({ name: 'core.loader' }, (monaco) => {
        monaco.loader = {
            monacoCorePkg,
            monacoVersion,
            cdn,
            monacoPath: utils_1.endingSlash(monacoPath),
            workersPath: utils_1.endingSlash(workersPath),
            languagesPath: utils_1.endingSlash(languagesPath),
            plugins,
            languages,
        };
    });
    console.log('[monaco] loading monaco from', monacoPath, '...');
    const cancelable = exports.monacoLoader.init({
        paths: { vs: utils_1.endingSlash(monacoPath) + 'min/vs' },
    });
    let disposable;
    const promise = cancelable
        .then(async (monaco) => {
        console.log('[monaco] loaded monaco');
        monaco = plugin_api_1.default(monaco);
        disposable = await monaco.plugin.install(loaderPlugin, register_1.default, themes_1.default, editors_1.default, shortcuts_1.default, workers_1.default, ...plugins, ...languages);
        return monaco;
    })
        .catch((error) => console.error('An error occurred during initialization of Monaco:', error));
    promise.cancel = () => {
        cancelable.cancel?.();
        disposable?.dispose?.();
    };
    return promise;
}
exports.loadMonaco = loadMonaco;
const makeCancelable = function (promise) {
    let hasCanceled_ = false;
    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then((val) => hasCanceled_ ? reject('operation is manually canceled') : resolve(val));
        promise.catch((error) => reject(error));
    });
    const cancellablePromise = Object.assign(wrappedPromise, {
        cancel: () => (hasCanceled_ = true),
    });
    return cancellablePromise;
};
class MonacoLoader {
    constructor() {
        this.handleMainScriptLoad = () => {
            document.removeEventListener('monaco_init', this.handleMainScriptLoad);
            this.resolve(window.monaco);
        };
        this.isInitialized = false;
        this.wrapperPromise = new Promise((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
        this.config = {};
    }
    injectScripts(script) {
        document.body.appendChild(script);
    }
    createScript(src) {
        const script = document.createElement('script');
        return src && (script.src = src), script;
    }
    createMonacoLoaderScript(mainScript) {
        const loaderScript = this.createScript(`${utils_1.noEndingSlash(this.config.paths.vs)}/loader.js`);
        loaderScript.onload = () => this.injectScripts(mainScript);
        loaderScript.onerror = this.reject;
        return loaderScript;
    }
    createMainScript() {
        const mainScript = this.createScript();
        mainScript.innerHTML = `
      require.config(${JSON.stringify(this.config)});
      require(['vs/editor/editor.main'], function() {
        document.dispatchEvent(new Event('monaco_init'));
      });
    `;
        mainScript.onerror = this.reject;
        return mainScript;
    }
    init(config) {
        if (!this.isInitialized) {
            //@ts-ignore
            if (window.monaco && window.monaco.editor) {
                //@ts-ignore
                return new Promise((res, rej) => res(window.monaco));
            }
            this.config = merge(this.config, config);
            document.addEventListener('monaco_init', this.handleMainScriptLoad);
            const mainScript = this.createMainScript();
            const loaderScript = this.createMonacoLoaderScript(mainScript);
            this.injectScripts(loaderScript);
        }
        this.isInitialized = true;
        return makeCancelable(this.wrapperPromise);
    }
}
exports.MonacoLoader = MonacoLoader;
exports.monacoLoader = new MonacoLoader();
//# sourceMappingURL=load-monaco.js.map