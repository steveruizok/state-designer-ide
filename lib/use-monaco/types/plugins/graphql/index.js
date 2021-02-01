"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const monaco_1 = require("../../monaco");
exports.default = (config) => monaco_1.createPlugin({
    name: 'language.graphql.service',
    dependencies: ['core.workers', 'language.graphql'],
}, (monaco) => {
    return monaco.worker.register({
        label: 'graphql',
        languageId: 'graphql',
        options: {
            languageConfig: {
                schemaConfig: config,
            },
        },
        src: monaco.loader.workersPath + 'graphql.monaco.worker.js',
        providers: {
            hover: true,
            // will conflict with prettier plugin, do disable this if you are using that
            documentFormattingEdit: !monaco.plugin.isInstalled('prettier'),
            completionItem: true,
            diagnostics: true,
        },
    });
});
//# sourceMappingURL=index.js.map