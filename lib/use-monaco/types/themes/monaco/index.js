"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.themeNames = void 0;
const tslib_1 = require("tslib");
const ayu_light_1 = tslib_1.__importDefault(require("./ayu-light"));
const ayu_dark_1 = tslib_1.__importDefault(require("./ayu-dark"));
const ocean_1 = tslib_1.__importDefault(require("./ocean"));
const monaco_themes_1 = tslib_1.__importDefault(require("./monaco-themes"));
const allThemes = {
    ocean: ocean_1.default,
    'ayu-light': ayu_light_1.default,
    'ayu-dark': ayu_dark_1.default,
    ...monaco_themes_1.default,
};
exports.default = allThemes;
exports.themeNames = {};
Object.keys(allThemes).forEach((theme) => {
    exports.themeNames[toTitleCase(theme)] = theme;
});
function toTitleCase(str) {
    return str
        .toLowerCase()
        .replace(/-/g, ' ')
        .replace(/(?:^|[\s])\w/g, function (match) {
        return match.toUpperCase();
    })
        .replace(' Theme', '');
}
//# sourceMappingURL=index.js.map