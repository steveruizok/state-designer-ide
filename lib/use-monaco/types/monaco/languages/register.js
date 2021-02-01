"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const plugin_api_1 = require("../plugin-api");
const languageDefinitions = {};
const lazyLanguageLoaders = {};
class LazyLanguageLoader {
    constructor(languageId) {
        this._languageId = languageId;
        this._loadingTriggered = false;
        this._lazyLoadPromise = new Promise((resolve, reject) => {
            this._lazyLoadPromiseResolve = resolve;
            this._lazyLoadPromiseReject = reject;
        });
    }
    static getOrCreate(languageId) {
        if (!lazyLanguageLoaders[languageId]) {
            lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId);
        }
        return lazyLanguageLoaders[languageId];
    }
    whenLoaded() {
        return this._lazyLoadPromise;
    }
    load() {
        if (!this._loadingTriggered) {
            this._loadingTriggered = true;
            languageDefinitions[this._languageId]?.loader?.().then((mod) => this._lazyLoadPromiseResolve(mod), (err) => this._lazyLoadPromiseReject(err));
        }
        return this._lazyLoadPromise;
    }
}
exports.default = plugin_api_1.createPlugin({
    name: 'core.languages',
    dependencies: ['core.workers'],
}, (monaco) => {
    let monacoLanguageRegister = monaco.languages.register;
    monaco.languages.register = (languageDefintion) => {
        const languageId = languageDefintion.id;
        const lang = monaco.languages
            .getLanguages()
            .find((l) => l.id === languageId);
        if (lang) {
            console.log('[monaco] replacing language:', languageId);
            Object.assign(lang, languageDefintion);
            languageDefinitions[languageId] = languageDefintion;
        }
        else {
            languageDefinitions[languageId] = languageDefintion;
            console.log('[monaco] registering language:', languageId);
        }
        monacoLanguageRegister(languageDefintion);
        if (languageDefintion.loader) {
            const lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId);
            monaco.languages.setMonarchTokensProvider(languageId, lazyLanguageLoader
                .whenLoaded()
                .then((mod) => mod.language)
                .catch((e) => {
                console.error(e);
                return;
            }));
            monaco.languages.onLanguage(languageId, () => {
                lazyLanguageLoader
                    .load()
                    .then((mod) => {
                    if (mod && mod.conf) {
                        monaco.languages.setLanguageConfiguration(languageId, mod.conf);
                    }
                })
                    .catch((err) => {
                    console.error(err);
                    return;
                });
            });
        }
        if (languageDefintion.worker) {
            const config = typeof languageDefintion.worker === 'object'
                ? languageDefintion.worker
                : {};
            monaco.worker.register({ languageId, ...config });
        }
    };
});
//# sourceMappingURL=register.js.map