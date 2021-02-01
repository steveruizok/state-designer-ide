"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonacoWorker = void 0;
class MonacoWorker {
    constructor(_ctx, _options) {
        this.ctx = _ctx;
        this.options = _options;
    }
    getModels() {
        return this.ctx.getMirrorModels();
    }
    getModel(uri) {
        let models = this.getModels();
        for (let index = 0; index < models.length; index++) {
            let model = models[index];
            if (model.uri.toString() === uri) {
                Object.assign(model, {
                    getFullModelRange: () => ({
                        startLineNumber: 1,
                        endLineNumber: model.getLineCount(),
                        startColumn: 1,
                        endColumn: model.getLineContent(model.getLineCount()).length + 1,
                    }),
                });
                return model;
            }
        }
        return null;
    }
    getText(uri) {
        return this.getModel(uri).getValue() || '';
    }
    // proxy function used by the client to delegate different kind of providers
    provide(provider, uri, ...args) {
        const providerFunc = 'provide' + provider.charAt(0).toUpperCase() + provider.slice(1);
        if (this[providerFunc]) {
            return this[providerFunc](this.getModel(uri), ...args);
        }
        else {
            console.error(`No provider for ${provider}`);
            return null;
        }
    }
    // proxy function used by the client to delegate different kind of resolvers
    resolve(resolver, uri, ...args) {
        const resolverFunc = 'resolve' + resolver.charAt(0).toUpperCase() + resolver.slice(1);
        if (this[resolverFunc]) {
            return this[resolverFunc](this.getModel(uri), ...args);
        }
        else {
            console.error(`No resolver for ${resolver}`);
            return null;
        }
    }
}
exports.MonacoWorker = MonacoWorker;
//# sourceMappingURL=monaco-worker.js.map