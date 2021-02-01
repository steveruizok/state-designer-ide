"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = exports.importScript = void 0;
const tslib_1 = require("tslib");
const monaco_worker_1 = require("./monaco-worker");
const simpleWorker_1 = require("../../node_modules/monaco-editor/esm/vs/base/common/worker/simpleWorker");
const editorSimpleWorker_1 = require("../../node_modules/monaco-editor/esm/vs/editor/common/services/editorSimpleWorker");
const hashCode = function (s) {
    var hash = 0;
    if (s.length == 0) {
        return hash;
    }
    for (var i = 0; i < s.length; i++) {
        var char = s.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
};
tslib_1.__exportStar(require("./monaco-worker"), exports);
const importScript = async (src) => {
    const _this = self;
    if (_this.define) {
        return await new Promise((resolve, reject) => {
            _this.define(`${hashCode(src)}`, [src], (val) => {
                resolve(val);
            });
        });
    }
    else {
        importScripts(src);
        // throw new Error('Not on AMD');
    }
};
exports.importScript = importScript;
var initialized = false;
function initialize(name, WorkerClass) {
    if (initialized) {
        return;
    }
    initialized = true;
    var simpleWorker = new simpleWorker_1.SimpleWorkerServer(function (msg) {
        //@ts-ignore
        self.postMessage(msg);
    }, function (host) {
        return new editorSimpleWorker_1.EditorSimpleWorker(host, (ctx, options) => {
            return new WorkerClass(ctx, options);
        });
    });
    self.onmessage = function (e) {
        simpleWorker.onmessage(e.data);
    };
    self[name + 'MonacoWorker'] = WorkerClass;
}
exports.initialize = initialize;
// @ts-ignore
self.initialize = initialize;
// @ts-ignore
self.MonacoWorker = monaco_worker_1.MonacoWorker;
//# sourceMappingURL=index.js.map