/**
 *  Copyright (c) 2020 GraphQL Contributors.
 *
 *  This source code is licensed under the MIT license found in the
 *  LICENSE file in the root directory of this source tree.
 */
import type { Range as GraphQLRange, Position as GraphQLPosition, Diagnostic, CompletionItem as GraphQLCompletionItem } from 'graphql-language-service-types';
import type * as monaco from 'monaco-editor';
export declare type MonacoCompletionItem = monaco.languages.CompletionItem & {
    isDeprecated?: boolean;
    deprecationReason?: string | null;
};
export declare function toMonacoRange(range: GraphQLRange): monaco.IRange;
export declare function toGraphQLPosition(position: monaco.Position): GraphQLPosition;
export declare function toCompletion(entry: GraphQLCompletionItem, range?: GraphQLRange): GraphQLCompletionItem & {
    range: monaco.IRange;
};
/**
 * Monaco and Vscode have slightly different ideas of marker severity.
 * for example, vscode has Error = 1, whereas monaco has Error = 8. this takes care of that
 * @param severity {DiagnosticSeverity} optional vscode diagnostic severity to convert to monaco MarkerSeverity
 * @returns {monaco.MarkerSeverity} the matching marker severity level on monaco's terms
 */
export declare function toMarkerData(diagnostic: Diagnostic): monaco.editor.IMarkerData;
