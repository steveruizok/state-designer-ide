"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMonacoEditor = void 0;
const useTextModel_1 = require("./useTextModel");
const useEditor_1 = require("./useEditor");
const useMonaco_1 = require("./useMonaco");
const useMonacoEditor = ({ modelOptions, path, defaultContents, contents, language, onEditorDidMount, options, 
// files,
// syncAllFiles,
overrideServices, onChange, ...loaderOptions } = {}) => {
    const { monaco, isLoading } = useMonaco_1.useMonaco({
        ...loaderOptions,
        languages: (loaderOptions?.languages ?? []).includes(language)
            ? loaderOptions?.languages
            : [...(loaderOptions?.languages ?? []), language],
    });
    const model = useTextModel_1.useTextModel({
        path,
        contents,
        defaultContents,
        language,
        modelOptions,
        monaco,
    });
    const { containerRef, editor } = useEditor_1.useEditor({
        model,
        monaco,
        onEditorDidMount,
        onChange,
        overrideServices,
        options,
    });
    return { monaco, isLoading, model, containerRef, editor };
};
exports.useMonacoEditor = useMonacoEditor;
//# sourceMappingURL=useMonacoEditor.js.map