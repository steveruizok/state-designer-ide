"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const dequal_1 = require("dequal");
function checkDeps(deps) {
    if (!deps || !deps.length) {
        throw new Error('useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.');
    }
    if (deps.every(isPrimitive)) {
        throw new Error('useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.');
    }
}
function isPrimitive(val) {
    return val == null || /^[sbn]/.test(typeof val);
}
function useDeepCompareMemoize(value) {
    const ref = React.useRef();
    const signalRef = React.useRef(0);
    if (!dequal_1.dequal(value, ref.current)) {
        ref.current = value;
        signalRef.current += 1;
    }
    return [signalRef.current];
}
function useDeepCompareEffect(callback, dependencies, skipDeep = []) {
    if (process.env.NODE_ENV !== 'production') {
        checkDeps(dependencies);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return React.useEffect(callback, [
        ...useDeepCompareMemoize(dependencies),
        ...skipDeep,
    ]);
}
exports.default = useDeepCompareEffect;
//# sourceMappingURL=useDeepCompareEffect.js.map