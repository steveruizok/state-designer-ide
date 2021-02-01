export class TypingsWorker extends MonacoWorker {
    constructor(_ctx: import("../../worker").IWorkerContext<undefined>, _options: any);
    fetchTypings(name: any, version: any): Promise<{
        name: any;
        version: any;
        typings: any;
    }>;
}
import { MonacoWorker } from "../../worker/monaco-worker";
