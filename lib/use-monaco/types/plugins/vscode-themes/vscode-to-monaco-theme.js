"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTheme = void 0;
const tslib_1 = require("tslib");
const color_1 = tslib_1.__importDefault(require("color"));
function validateColor(color) {
    const c = color_1.default(color);
    return c.hex();
}
function convertTheme(theme) {
    const colors = Object.fromEntries(Object.entries(theme.colors ?? {})
        .map(([k, v]) => {
        try {
            if (k.split('.').length === 2)
                return [k, validateColor(v)];
            else {
                return null;
            }
        }
        catch (e) {
            return null;
        }
    })
        .filter(Boolean));
    const monacoThemeRule = [
        {
            token: 'unmatched',
            foreground: colors['editor.foreground'] ?? colors['foreground'] ?? '#bbbbbb',
        },
    ];
    const returnTheme = {
        inherit: false,
        base: 'vs-dark',
        colors: colors,
        rules: monacoThemeRule,
        encodedTokensColors: [],
    };
    theme.tokenColors.map((color) => {
        if (typeof color.scope == 'string') {
            const split = color.scope.split(/[, ]/g);
            if (split.length > 1) {
                color.scope = split;
                evalAsArray();
                return;
            }
            monacoThemeRule.push(Object.assign({}, Object.fromEntries(Object.entries(color.settings).map(([k, v]) => [
                k,
                ['foreground', 'background'].includes(k) ? validateColor(v) : v,
            ])), {
                // token: color.scope.replace(/\s/g, '')
                token: color.scope,
            }));
            return;
        }
        if (!color.scope) {
            return;
        }
        evalAsArray();
        function evalAsArray() {
            color.scope.map((scope) => {
                monacoThemeRule.push(Object.assign({}, Object.fromEntries(Object.entries(color.settings).map(([k, v]) => [
                    k,
                    ['foreground', 'background'].includes(k) ? validateColor(v) : v,
                ])), {
                    token: scope,
                }));
            });
        }
    });
    return returnTheme;
}
exports.convertTheme = convertTheme;
//# sourceMappingURL=vscode-to-monaco-theme.js.map