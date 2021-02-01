"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noop = exports.version = exports.processDimensions = exports.processSize = void 0;
const tslib_1 = require("tslib");
function processSize(size) {
    size = String(size);
    return !/^\d+$/.test(size) ? size : `${size}px`;
}
exports.processSize = processSize;
function processDimensions(width, height) {
    const fixedWidth = processSize(width);
    const fixedHeight = processSize(height);
    return {
        width: fixedWidth,
        height: fixedHeight,
    };
}
exports.processDimensions = processDimensions;
tslib_1.__exportStar(require("./strip-comments"), exports);
tslib_1.__exportStar(require("./path"), exports);
tslib_1.__exportStar(require("./disposables"), exports);
var version_1 = require("./version");
Object.defineProperty(exports, "version", { enumerable: true, get: function () { return tslib_1.__importDefault(version_1).default; } });
function noop() {
    return undefined;
}
exports.noop = noop;
//# sourceMappingURL=index.js.map