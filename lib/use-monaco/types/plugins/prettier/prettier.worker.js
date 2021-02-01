"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettierWorker = void 0;
const worker_1 = require("../../worker");
class PrettierWorker extends worker_1.MonacoWorker {
    constructor(ctx, config) {
        super(ctx, config);
        this.plugins = [];
        this.prettier = {};
        this.provideDocumentFormattingEdits = async (model) => {
            const { plugins, ...options } = this.options;
            console.log(`[prettier] formatting`);
            const text = this.prettier.format(model.getValue(), {
                plugins: this.plugins,
                singleQuote: true,
                ...options,
            });
            const lines = text.split('\n');
            const formattedFulLRange = {
                startLineNumber: 1,
                endLineNumber: lines.length,
                startColumn: 0,
                endColumn: lines[lines.length - 1].length,
            };
            const originalFullRange = model.getFullModelRange();
            return [
                {
                    range: originalFullRange.endLineNumber > formattedFulLRange.endLineNumber ||
                        (originalFullRange.endLineNumber ===
                            formattedFulLRange.endLineNumber &&
                            originalFullRange.endColumn > formattedFulLRange.endColumn)
                        ? originalFullRange
                        : formattedFulLRange,
                    text,
                },
            ];
        };
        this.options = config;
        this.loader = this.importPrettier();
    }
    async importPrettier() {
        await worker_1.importScript('https://unpkg.com/prettier@2.0.4/standalone.js');
        // @ts-ignore
        this.prettier = prettier;
        for (var plugin of this.options.plugins) {
            // this.plugins.push(
            await worker_1.importScript(`https://unpkg.com/prettier@2.0.4/${plugin}.js`);
            // );
        }
        // @ts-ignore
        this.plugins = prettierPlugins;
    }
}
exports.PrettierWorker = PrettierWorker;
//# sourceMappingURL=prettier.worker.js.map