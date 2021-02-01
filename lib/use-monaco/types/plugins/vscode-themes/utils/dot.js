"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.object = void 0;
const dot_object_1 = require("dot-object");
/* eslint-disable */
/**
 * Version of 'object' from 'dot-object' that doesn't mutate the existing variable.
 * It converts eg.
 *
 * ```js
 * { 'activityBar.background': '#ddd' }
 * to
 * { activityBar: {background: '#ddd' } }
 */
function object(obj) {
    return dot_object_1.object(JSON.parse(JSON.stringify(obj)));
}
exports.object = object;
//# sourceMappingURL=dot.js.map