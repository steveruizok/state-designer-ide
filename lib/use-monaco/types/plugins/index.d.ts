import { default as prettier } from './prettier';
import { default as graphql } from './graphql';
import { default as typings } from './typings';
import { default as vscodeThemes } from './vscode-themes';
import { default as textmate } from './textmate';
export declare const pluginMap: {
    prettier: (prettierOptions?: any, { workerSrc }?: {
        workerSrc?: string | (() => Worker);
    }) => import("monaco-editor").plugin.IPlugin;
    graphql: (config: import("graphql-language-service").SchemaConfig) => import("monaco-editor").plugin.IPlugin;
    typings: (compilerOptions?: import("monaco-editor").languages.typescript.CompilerOptions) => import("monaco-editor").plugin.IPlugin;
    'vscode-themes': ({ transformTheme, polyfill }?: {
        transformTheme?: (t: any) => any;
        polyfill?: boolean;
    }) => import("monaco-editor").plugin.IPlugin;
    textmate: () => import("monaco-editor").plugin.IPlugin;
};
export { prettier, graphql, typings, vscodeThemes, textmate };
