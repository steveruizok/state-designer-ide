"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const onigasm_1 = require("onigasm");
const monaco_textmate_1 = require("monaco-textmate");
const monaco_textmate_2 = require("monaco-textmate");
const tm_to_monaco_token_1 = require("./tm-to-monaco-token");
const monaco_1 = require("../../monaco");
class TokenizerState {
    constructor(_ruleStack) {
        this._ruleStack = _ruleStack;
    }
    get ruleStack() {
        return this._ruleStack;
    }
    clone() {
        return new TokenizerState(this._ruleStack);
    }
    equals(other) {
        if (!other ||
            !(other instanceof TokenizerState) ||
            other !== this ||
            other._ruleStack !== this._ruleStack) {
            return false;
        }
        return true;
    }
}
const knonwSyntaxes = {
    'source.graphql': {
        format: 'url',
        responseFormat: 'json',
        scopeName: 'source.graphql',
        url: 'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/kumar-harsh.graphql-for-vscode-1.13.0/syntaxes/graphql.json',
    },
    'source.json.comments': {
        format: 'url',
        scopeName: 'source.json.comments',
        responseFormat: 'json',
        url: 'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/json/syntaxes/JSONC.tmLanguage.json',
    },
    'source.tsx': {
        format: 'url',
        scopeName: 'source.tsx',
        responseFormat: 'plist',
        url: 'https://raw.githubusercontent.com/microsoft/TypeScript-TmLanguage/master/TypeScriptReact.tmLanguage',
    },
    'source.css': {
        format: 'url',
        scopeName: 'source.css',
        responseFormat: 'json',
        url: 'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/css/syntaxes/css.tmLanguage.json',
    },
    'text.html.basic': {
        format: 'url',
        scopeName: 'text.html.basic',
        responseFormat: 'json',
        url: 'https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/html/syntaxes/html.tmLanguage.json',
    },
};
const knonwScopes = {
    graphql: 'source.graphql',
    json: 'source.json.comments',
    typescript: 'source.tsx',
    javascript: 'source.tsx',
    css: 'source.css',
    html: 'text.html.basic',
};
exports.default = () => monaco_1.createPlugin({
    name: 'textmate',
    dependencies: ['core.editors'],
}, async (monaco) => {
    await onigasm_1.loadWASM('https://www.unpkg.com/onigasm/lib/onigasm.wasm');
    const syntaxes = {
        ...knonwSyntaxes,
    };
    // map of monaco "language id's" to TextMate scopeNames
    const grammars = {};
    const registry = new monaco_textmate_1.Registry({
        getGrammarDefinition: async (scopeName) => {
            const repo = syntaxes[scopeName];
            if (!repo) {
                return {
                    format: 'json',
                    content: '{}',
                };
            }
            if (repo.format === 'url') {
                return {
                    format: repo.responseFormat,
                    content: await (await fetch(repo.url)).text(),
                };
            }
            else {
                return repo;
            }
        },
    });
    async function registerSyntax(language, scopeName = knonwScopes[language], syntax = knonwSyntaxes[scopeName]) {
        syntax = syntax.format ? syntax : knonwSyntaxes[scopeName];
        syntaxes[scopeName] = syntax;
        grammars[language] = scopeName;
        const grammar = await registry.loadGrammar(scopeName);
        monaco.languages.setTokensProvider(language, {
            getInitialState: () => new TokenizerState(monaco_textmate_2.INITIAL),
            tokenize: (line, state) => {
                const oldStack = state.ruleStack;
                try {
                    const res = grammar.tokenizeLine(line, state.ruleStack);
                    const editor = monaco.editor.getFocusedEditor();
                    const tokens = {
                        endState: new TokenizerState(res.ruleStack),
                        tokens: res.tokens.map((token) => ({
                            ...token,
                            // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
                            scopes: editor
                                ? tm_to_monaco_token_1.textMateToMonacoToken(editor, token.scopes)
                                : token.scopes.join(' '),
                        })),
                    };
                    return tokens;
                }
                catch (e) {
                    return {
                        endState: new TokenizerState(oldStack),
                        tokens: [],
                    };
                }
            },
        });
    }
    monaco.languages.registerSyntax = (language, syntax) => registerSyntax(language, syntax?.scopeName, syntax);
    let oldRegister = monaco.languages.register;
    monaco.languages.register = (def) => {
        if (knonwScopes[def.id] && def.loader) {
            delete def.loader;
        }
        oldRegister(def);
        if (def.id === 'json') {
            monaco.languages.json?.jsonDefaults?.setModeConfiguration({
                tokens: false,
            });
        }
        if (knonwScopes[def.id]) {
            monaco.languages.registerSyntax(def.id);
        }
    };
});
//# sourceMappingURL=index.js.map