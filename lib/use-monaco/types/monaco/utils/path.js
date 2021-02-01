"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noEndingSlash = exports.endingSlash = exports.fixPath = void 0;
const fixPath = (path) => path.startsWith('/') ? path : `/${path}`;
exports.fixPath = fixPath;
const endingSlash = (path) => path.endsWith('/') ? path : `${path}/`;
exports.endingSlash = endingSlash;
const noEndingSlash = (path) => !path.endsWith('/') ? path : path.substr(0, path.length - 1);
exports.noEndingSlash = noEndingSlash;
//# sourceMappingURL=path.js.map