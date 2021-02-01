import type * as monacoApi from 'monaco-editor';
import type { WorkerClient } from './worker-client';
declare module 'monaco-editor' {
    namespace worker {
        interface ILangProvidersOptions {
            reference?: boolean;
            rename?: boolean;
            signatureHelp?: boolean;
            hover?: boolean;
            documentSymbol?: boolean;
            documentHighlight?: boolean;
            definition?: boolean;
            implementation?: boolean;
            typeDefinition?: boolean;
            codeLens?: boolean;
            codeAction?: boolean;
            documentFormattingEdit?: boolean;
            documentRangeFormattingEdit?: boolean;
            onTypeFormattingEdit?: boolean;
            link?: boolean;
            completionItem?: boolean;
            completionTriggerCharacters?: string[];
            color?: boolean;
            foldingRange?: boolean;
            declaration?: boolean;
            selectionRange?: boolean;
            diagnostics?: boolean | {
                disableWhenInactive?: boolean;
            };
        }
    }
}
export declare const defaultProviderConfig: {
    reference: boolean;
    rename: boolean;
    signatureHelp: boolean;
    hover: boolean;
    documentSymbol: boolean;
    documentHighlight: boolean;
    definition: boolean;
    implementation: boolean;
    typeDefinition: boolean;
    codeLens: boolean;
    codeAction: boolean;
    documentFormattingEdit: boolean;
    documentRangeFormattingEdit: boolean;
    onTypeFormattingEdit: boolean;
    link: boolean;
    completionItem: boolean;
    color: boolean;
    foldingRange: boolean;
    declaration: boolean;
    selectionRange: boolean;
    diagnostics: boolean;
    documentSemanticTokens: boolean;
    documentRangeSemanticTokens: boolean;
};
export declare const getProvider: (getWorker: monacoApi.worker.IWorkerAccessor<any>, provider: string) => (model: monacoApi.editor.IModel, ...args: any[]) => Promise<any>;
export declare const getSignatureHelpProvider: (getWorker: monacoApi.worker.IWorkerAccessor<any>) => (model: monacoApi.editor.ITextModel, position: monacoApi.IPosition, token: monacoApi.CancellationToken, context: monacoApi.languages.SignatureHelpContext) => Promise<any>;
export declare const getResolver: (getWorker: monacoApi.worker.IWorkerAccessor<any>, resolver: string) => (model: monacoApi.editor.IModel, ...args: any[]) => Promise<any>;
export declare const getCompletionItemResolver: (getWorker: monacoApi.worker.IWorkerAccessor<any>) => (item: monacoApi.languages.CompletionItem, token: monacoApi.CancellationToken) => Promise<any>;
export declare class DiagnosticsProvider {
    private client;
    private _disposables;
    private _listener;
    private _editor?;
    private _client?;
    monaco: typeof monacoApi;
    isActiveModel(model: monacoApi.editor.ITextModel): boolean;
    constructor(client: WorkerClient<any, any>, monaco: typeof monacoApi);
    dispose(): void;
    private _doValidate;
}
export declare const setupWorkerProviders: (languageId: string, providers: monacoApi.worker.ILangProvidersOptions | boolean, client: WorkerClient<any, any>, monaco: typeof monacoApi) => monacoApi.IDisposable[];
