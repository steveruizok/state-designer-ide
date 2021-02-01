"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disposeAll = exports.asDisposable = void 0;
function asDisposable(disposables) {
    return {
        dispose: () => Array.isArray(disposables)
            ? disposeAll(disposables.filter(Boolean))
            : typeof disposables?.dispose === 'function'
                ? disposables?.dispose?.()
                : {},
    };
}
exports.asDisposable = asDisposable;
function disposeAll(disposables) {
    while (disposables.length) {
        disposables.pop()?.dispose?.();
    }
}
exports.disposeAll = disposeAll;
//# sourceMappingURL=disposables.js.map