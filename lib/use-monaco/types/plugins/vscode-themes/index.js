"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const monaco_1 = require("../../monaco");
const polyfill_theme_1 = tslib_1.__importDefault(require("./utils/polyfill-theme"));
const vscode_to_monaco_theme_1 = require("./vscode-to-monaco-theme");
exports.default = ({ transformTheme = (t) => t, polyfill = true } = {}) => monaco_1.createPlugin({ name: 'vscode.themes', dependencies: ['core.themes'] }, (monaco) => {
    let oldDefineTheme = monaco.editor.defineTheme;
    monaco.editor.defineTheme = (themeName, theme) => {
        if ('$schema' in theme &&
            theme['$schema'] === 'vscode://schemas/color-theme') {
            const converted = vscode_to_monaco_theme_1.convertTheme(theme);
            const polyfilledColors = polyfill_theme_1.default(converted);
            oldDefineTheme(themeName, transformTheme?.({ ...converted, colors: polyfilledColors }));
        }
        else {
            oldDefineTheme(themeName, theme);
        }
    };
});
//
//# sourceMappingURL=index.js.map