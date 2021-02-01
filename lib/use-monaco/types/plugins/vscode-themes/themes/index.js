"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const codesandbox_json_1 = tslib_1.__importDefault(require("./codesandbox.json"));
const codesandbox_black_1 = tslib_1.__importDefault(require("./codesandbox-black"));
const codesandbox_light_json_1 = tslib_1.__importDefault(require("./codesandbox-light.json"));
const night_owl_json_1 = tslib_1.__importDefault(require("./night-owl.json"));
const nightOwlNoItalics_json_1 = tslib_1.__importDefault(require("./nightOwlNoItalics.json"));
const atom_dark_json_1 = tslib_1.__importDefault(require("./atom-dark.json"));
const atom_light_json_1 = tslib_1.__importDefault(require("./atom-light.json"));
const cobalt2_1 = tslib_1.__importDefault(require("./cobalt2"));
const lucy_json_1 = tslib_1.__importDefault(require("./lucy.json"));
const palenight_json_1 = tslib_1.__importDefault(require("./palenight.json"));
const solarized_light_json_1 = tslib_1.__importDefault(require("./solarized-light.json"));
const shades_of_purple_1 = tslib_1.__importDefault(require("./shades-of-purple"));
const palenight_italic_json_1 = tslib_1.__importDefault(require("./palenight-italic.json"));
const high_contrast_json_1 = tslib_1.__importDefault(require("./high-contrast.json"));
const vscode_light_1 = tslib_1.__importDefault(require("./vscode-light"));
exports.default = [
    {
        name: 'CodeSandbox',
        id: 'codesandbox',
        content: codesandbox_json_1.default,
    },
    {
        name: 'CodeSandbox Black',
        id: 'codesandboxBlack',
        content: codesandbox_black_1.default,
    },
    {
        name: 'CodeSandbox Light',
        id: 'codesandboxLight',
        content: codesandbox_light_json_1.default,
    },
    {
        name: 'Night Owl',
        id: 'nightOwl',
        content: night_owl_json_1.default,
    },
    {
        name: 'Night Owl (No Italics)',
        id: 'nightOwlNoItalics',
        content: nightOwlNoItalics_json_1.default,
    },
    {
        name: 'Atom Dark',
        id: 'atomDark',
        type: 'dark',
        content: atom_dark_json_1.default,
    },
    {
        name: 'Cobalt 2',
        id: 'cobalt2',
        content: cobalt2_1.default,
    },
    {
        name: 'Palenight',
        id: 'palenight',
        content: palenight_json_1.default,
    },
    {
        name: 'Palenight Italic',
        id: 'palenightItalic',
        content: palenight_italic_json_1.default,
    },
    {
        name: 'Shades of Purple',
        id: 'shadesOfPurple',
        content: shades_of_purple_1.default,
    },
    {
        name: 'Lucy',
        id: 'lucy',
        content: lucy_json_1.default,
    },
    {
        name: 'High Contrast',
        id: 'highContrast',
        content: high_contrast_json_1.default,
    },
    {
        name: 'VSCode Light',
        id: 'vscodeLight',
        content: vscode_light_1.default,
    },
    {
        name: 'Atom Light',
        id: 'atomLight',
        content: atom_light_json_1.default,
    },
    {
        name: 'Solarized Light',
        id: 'solarizedLight',
        content: solarized_light_json_1.default,
    },
];
//# sourceMappingURL=index.js.map