import type * as monacoApi from 'monaco-editor';
import { basicLanguages } from './basic-languages';
export declare const basicLanguagePlugins: {
    [k in typeof basicLanguages[number]]: monacoApi.plugin.IPlugin;
};
