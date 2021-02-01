import { MonacoWorker, IWorkerContext } from '../../worker';
import { ICreateData } from './types';
import type { editor, Position, IRange } from 'monaco-editor';
import type { SchemaResponse, CompletionItem as GraphQLCompletionItem } from 'graphql-language-service';
import type * as monacoApi from 'monaco-editor';
import type { GraphQLSchema, DocumentNode } from 'graphql';
export declare type MonacoCompletionItem = monacoApi.languages.CompletionItem & {
    isDeprecated?: boolean;
    deprecationReason?: string | null;
};
export declare class GraphQLWorker extends MonacoWorker {
    private _ctx;
    private _languageService;
    private _formattingOptions;
    constructor(ctx: IWorkerContext, createData: ICreateData);
    getSchemaResponse(_uri?: string): Promise<SchemaResponse | null>;
    setSchema(schema: string): Promise<void>;
    loadSchema(_uri?: string): Promise<GraphQLSchema | null>;
    validate(uri: string): Promise<editor.IMarkerData[]>;
    doComplete(uri: string, position: Position): Promise<(GraphQLCompletionItem & {
        range: IRange;
    })[]>;
    doHover(uri: string, position: Position): Promise<{
        content: string | import("vscode-languageserver-types").MarkupContent | {
            language: string;
            value: string;
        } | import("vscode-languageserver-types").MarkedString[];
        range: IRange;
    }>;
    doValidation(uri: any): Promise<editor.IMarkerData[]>;
    getSchema(): Promise<string>;
    provideHover: MonacoWorker['provideHover'];
    provideCompletionItems: MonacoWorker['provideCompletionItems'];
    resolveCompletionItem: MonacoWorker['resolveCompletionItem'];
    doParse(text: string): Promise<DocumentNode>;
}
