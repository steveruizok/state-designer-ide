export declare function processSize(size: string | number): string;
export declare function processDimensions(width: string | number, height: string | number): {
    width: string;
    height: string;
};
export * from './strip-comments';
export * from './path';
export * from './disposables';
export { default as version } from './version';
export declare function noop<T>(): T;
