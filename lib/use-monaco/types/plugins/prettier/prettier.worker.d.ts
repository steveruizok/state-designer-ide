import { MonacoWorker, IWorkerContext } from '../../worker';
export declare class PrettierWorker extends MonacoWorker {
    options: {
        parser: string;
        plugins: string[];
    };
    loader: Promise<any>;
    plugins: any[];
    prettier: any;
    constructor(ctx: IWorkerContext<undefined>, config: {
        parser: string;
        plugins: string[];
    });
    importPrettier(): Promise<void>;
    provideDocumentFormattingEdits: MonacoWorker['provideDocumentFormattingEdits'];
}
