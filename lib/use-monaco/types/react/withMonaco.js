"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withMonaco = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const __1 = require("..");
function withMonaco(config, Component) {
    return ({ ...props }) => {
        return (react_1.default.createElement(__1.MonacoProvider, Object.assign({}, config),
            react_1.default.createElement(Component, Object.assign({}, props))));
    };
}
exports.withMonaco = withMonaco;
//# sourceMappingURL=withMonaco.js.map