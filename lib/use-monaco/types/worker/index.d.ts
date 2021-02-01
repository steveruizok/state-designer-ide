import { MonacoWorker } from './monaco-worker';
export * from './monaco-worker';
declare global {
    const importScripts: any;
}
export declare const importScript: (src: string) => Promise<unknown>;
export declare function initialize(name: string, WorkerClass: typeof MonacoWorker): void;
