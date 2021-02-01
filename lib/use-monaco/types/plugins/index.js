"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.textmate = exports.vscodeThemes = exports.typings = exports.graphql = exports.prettier = exports.pluginMap = void 0;
const tslib_1 = require("tslib");
const prettier_1 = tslib_1.__importDefault(require("./prettier"));
Object.defineProperty(exports, "prettier", { enumerable: true, get: function () { return prettier_1.default; } });
const graphql_1 = tslib_1.__importDefault(require("./graphql"));
Object.defineProperty(exports, "graphql", { enumerable: true, get: function () { return graphql_1.default; } });
const typings_1 = tslib_1.__importDefault(require("./typings"));
Object.defineProperty(exports, "typings", { enumerable: true, get: function () { return typings_1.default; } });
const vscode_themes_1 = tslib_1.__importDefault(require("./vscode-themes"));
Object.defineProperty(exports, "vscodeThemes", { enumerable: true, get: function () { return vscode_themes_1.default; } });
const textmate_1 = tslib_1.__importDefault(require("./textmate"));
Object.defineProperty(exports, "textmate", { enumerable: true, get: function () { return textmate_1.default; } });
exports.pluginMap = {
    prettier: prettier_1.default,
    graphql: graphql_1.default,
    typings: typings_1.default,
    'vscode-themes': vscode_themes_1.default,
    textmate: textmate_1.default,
};
//# sourceMappingURL=index.js.map