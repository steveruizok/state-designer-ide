"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupWorkerProviders = exports.DiagnosticsProvider = exports.getCompletionItemResolver = exports.getResolver = exports.getSignatureHelpProvider = exports.getProvider = exports.defaultProviderConfig = void 0;
exports.defaultProviderConfig = {
    reference: true,
    rename: true,
    signatureHelp: true,
    hover: true,
    documentSymbol: true,
    documentHighlight: true,
    definition: true,
    implementation: true,
    typeDefinition: true,
    codeLens: true,
    codeAction: true,
    documentFormattingEdit: true,
    documentRangeFormattingEdit: true,
    onTypeFormattingEdit: true,
    link: true,
    completionItem: true,
    color: true,
    foldingRange: true,
    declaration: true,
    selectionRange: true,
    diagnostics: true,
    documentSemanticTokens: true,
    documentRangeSemanticTokens: true,
};
const getProvider = (getWorker, provider) => {
    return async (model, ...args) => {
        let resource = model.uri;
        try {
            const worker = await getWorker(resource);
            return await worker.provide(provider, resource.toString(), ...args.slice(0, args.length - 1));
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
};
exports.getProvider = getProvider;
const getSignatureHelpProvider = (getWorker) => {
    return async (model, position, token, context) => {
        let resource = model.uri;
        try {
            const worker = await getWorker(resource);
            return await worker.provide('signatureHelp', resource.toString(), position, context);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
};
exports.getSignatureHelpProvider = getSignatureHelpProvider;
const getResolver = (getWorker, resolver) => {
    return async (model, ...args) => {
        let resource = model.uri;
        try {
            const worker = await getWorker(resource);
            return await worker.resolve(resolver, resource.toString(), ...args.slice(0, args.length - 1));
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
};
exports.getResolver = getResolver;
const getCompletionItemResolver = (getWorker) => {
    return async (item, token) => {
        try {
            const worker = await getWorker();
            return await worker.resolve('completionItem', item, token);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    };
};
exports.getCompletionItemResolver = getCompletionItemResolver;
class DiagnosticsProvider {
    constructor(client, monaco) {
        this.client = client;
        this._disposables = [];
        this._listener = Object.create(null);
        this._client = client;
        this.monaco = monaco;
        this._disposables.push(monaco.editor.onDidCreateEditor((editor) => {
            this._editor = editor;
        }));
        const onModelAdd = (model) => {
            const modeId = model.getModeId();
            if (modeId !== client.config.languageId) {
                return;
            }
            // console.log(
            //   'model added',
            //   model.uri.toString(),
            //   client.config.languageId,
            //   model.getModeId()
            // );
            let handle;
            // console.log(handle, this._listener, this._client, model);
            this._listener[model.uri.toString()] = model.onDidChangeContent(() => {
                clearTimeout(handle);
                // @ts-ignore
                handle = setTimeout(() => {
                    // if (this.isActiveModel(model)) {
                    this._doValidate(model.uri, modeId);
                    // }
                }, 500);
            });
            // if (this.isActiveModel(model)) {
            this._doValidate(model.uri, modeId);
            // }
        };
        const onModelRemoved = (model) => {
            // console.log(
            //   'model removed',
            //   model.uri.toString(),
            //   client.config.languageId
            // );
            monaco.editor.setModelMarkers(model, client.config.languageId ?? '', []);
            const uriStr = model.uri.toString();
            const listener = this._listener[uriStr];
            if (listener) {
                listener.dispose();
                delete this._listener[uriStr];
            }
        };
        this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd));
        this._disposables.push(monaco.editor.onWillDisposeModel((model) => {
            // console.log(
            //   'model disposed',
            //   model.uri.toString(),
            //   client.config.languageId
            // );
            onModelRemoved(model);
        }));
        this._disposables.push(monaco.editor.onDidChangeModelLanguage((event) => {
            // console.log(
            //   'model changed language',
            //   event.model.uri.toString(),
            //   client.config.languageId
            // );
            onModelRemoved(event.model);
            onModelAdd(event.model);
        }));
        this._disposables.push(client.onConfigDidChange((_) => {
            monaco.editor.getModels().forEach((model) => {
                if (model.getModeId() === client.config.languageId) {
                    onModelRemoved(model);
                    onModelAdd(model);
                }
            });
        }));
        this._disposables.push({
            dispose: () => {
                for (const key in this._listener) {
                    this._listener[key].dispose();
                }
            },
        });
        // monaco.editor.getModels().forEach(onModelAdd);
    }
    isActiveModel(model) {
        if (this._editor) {
            const currentModel = this._editor.getModel();
            if (currentModel &&
                currentModel.uri.toString() === model.uri.toString()) {
                return true;
            }
        }
        return false;
    }
    dispose() {
        this._disposables.forEach((d) => d && d.dispose());
        this._disposables = [];
    }
    async _doValidate(resource, languageId) {
        try {
            const worker = await this.client.getSyncedWorker(resource);
            const diagnostics = await worker.doValidation(resource.toString());
            this.monaco.editor.setModelMarkers(this.monaco.editor.getModel(resource), languageId, diagnostics);
        }
        catch (e) {
            console.error(e);
            return null;
        }
    }
}
exports.DiagnosticsProvider = DiagnosticsProvider;
const setupWorkerProviders = (languageId, providers = exports.defaultProviderConfig, client, monaco) => {
    const disposables = [];
    if (!providers) {
        return [];
    }
    const getWorker = async (...resources) => {
        return await client.getSyncedWorker(...resources);
    };
    providers =
        typeof providers === 'boolean' && providers
            ? exports.defaultProviderConfig
            : providers;
    if (providers.diagnostics) {
        disposables.push(new DiagnosticsProvider(client, monaco));
    }
    if (providers.reference) {
        disposables.push(monaco.languages.registerReferenceProvider(languageId, {
            provideReferences: exports.getProvider(getWorker, 'references'),
        }));
    }
    if (providers.rename) {
        disposables.push(monaco.languages.registerRenameProvider(languageId, {
            provideRenameEdits: exports.getProvider(getWorker, 'renameEdits'),
            resolveRenameLocation: exports.getResolver(getWorker, 'renameLocation'),
        }));
    }
    if (providers.signatureHelp) {
        disposables.push(monaco.languages.registerSignatureHelpProvider(languageId, {
            provideSignatureHelp: exports.getSignatureHelpProvider(getWorker),
        }));
    }
    if (providers.hover) {
        disposables.push(monaco.languages.registerHoverProvider(languageId, {
            provideHover: exports.getProvider(getWorker, 'hover'),
        }));
    }
    if (providers.documentSymbol) {
        disposables.push(monaco.languages.registerDocumentSymbolProvider(languageId, {
            provideDocumentSymbols: exports.getProvider(getWorker, 'documentSymbols'),
        }));
    }
    if (providers.documentHighlight) {
        disposables.push(monaco.languages.registerDocumentHighlightProvider(languageId, {
            provideDocumentHighlights: exports.getProvider(getWorker, 'documentHighlights'),
        }));
    }
    if (providers.definition) {
        disposables.push(monaco.languages.registerDefinitionProvider(languageId, {
            provideDefinition: exports.getProvider(getWorker, 'definition'),
        }));
    }
    if (providers.implementation) {
        disposables.push(monaco.languages.registerImplementationProvider(languageId, {
            provideImplementation: exports.getProvider(getWorker, 'implementation'),
        }));
    }
    if (providers.typeDefinition) {
        disposables.push(monaco.languages.registerTypeDefinitionProvider(languageId, {
            provideTypeDefinition: exports.getProvider(getWorker, 'typeDefinition'),
        }));
    }
    if (providers.codeLens) {
        disposables.push(monaco.languages.registerCodeLensProvider(languageId, {
            provideCodeLenses: exports.getProvider(getWorker, 'codeLenses'),
            resolveCodeLens: exports.getResolver(getWorker, 'codeLens'),
        }));
    }
    if (providers.codeAction) {
        disposables.push(monaco.languages.registerCodeActionProvider(languageId, {
            provideCodeActions: exports.getProvider(getWorker, 'codeActions'),
        }));
    }
    if (providers.documentFormattingEdit) {
        disposables.push(monaco.languages.registerDocumentFormattingEditProvider(languageId, {
            provideDocumentFormattingEdits: exports.getProvider(getWorker, 'documentFormattingEdits'),
        }));
    }
    if (providers.documentRangeFormattingEdit) {
        disposables.push(monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
            provideDocumentRangeFormattingEdits: exports.getProvider(getWorker, 'documentRangeFormattingEdits'),
        }));
    }
    // if (providers.onTypeFormattingEdit) {
    //   disposables.push(
    //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
    //       provideOnTypeFormattingEdits: getProvider(
    //         getWorker,
    //         'onTypeFormattingEdits'
    //       ),
    //     })
    //   );
    // }
    if (providers.link) {
        disposables.push(monaco.languages.registerLinkProvider(languageId, {
            provideLinks: exports.getProvider(getWorker, 'links'),
        }));
    }
    if (providers.completionItem) {
        disposables.push(monaco.languages.registerCompletionItemProvider(languageId, {
            triggerCharacters: providers.completionTriggerCharacters || [],
            provideCompletionItems: exports.getProvider(getWorker, 'completionItems'),
            resolveCompletionItem: exports.getCompletionItemResolver(getWorker),
        }));
    }
    if (providers.color) {
        disposables.push(monaco.languages.registerColorProvider(languageId, {
            provideDocumentColors: exports.getProvider(getWorker, 'documentColors'),
            provideColorPresentations: exports.getProvider(getWorker, 'colorPresentations'),
        }));
    }
    if (providers.foldingRange) {
        disposables.push(monaco.languages.registerFoldingRangeProvider(languageId, {
            provideFoldingRanges: exports.getProvider(getWorker, 'foldingRanges'),
        }));
    }
    if (providers.declaration) {
        disposables.push(monaco.languages.registerDeclarationProvider(languageId, {
            provideDeclaration: exports.getProvider(getWorker, 'declaration'),
        }));
    }
    if (providers.selectionRange) {
        disposables.push(monaco.languages.registerSelectionRangeProvider(languageId, {
            provideSelectionRanges: exports.getProvider(getWorker, 'selectionRanges'),
        }));
    }
    return disposables;
    // if (providers.onTypeFormattingEdit) {
    //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
    // provideOnTypeFormattingEdits: getProvider(getWorker, 'onTypeFormattingEdits')
    // });
    // }
};
exports.setupWorkerProviders = setupWorkerProviders;
//# sourceMappingURL=providers.js.map