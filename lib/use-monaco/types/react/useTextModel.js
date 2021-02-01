"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTextModel = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const monaco_1 = require("../monaco");
const useMonaco_1 = require("./useMonaco");
const useDeepCompareEffect_1 = tslib_1.__importDefault(require("./useDeepCompareEffect"));
function findMonacoModel(monaco, path) {
    return monaco?.editor.getModel(monaco.Uri.file(monaco_1.fixPath(path)));
}
function initializeMonacoModel(monaco, modelPath, value, language) {
    modelPath = monaco_1.fixPath(modelPath);
    let model = findMonacoModel(monaco, modelPath);
    if (model) {
        // If a model exists, we need to update it's value
        // This is needed because the content for the file might have been modified externally
        // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
        if (value) {
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value,
                },
            ], () => null);
        }
    }
    else {
        console.log(`[monaco] creating model:`, modelPath, { value, language });
        model = monaco?.editor.createModel(value || '', language, monaco?.Uri.file(modelPath));
        model?.updateOptions({
            tabSize: 2,
            insertSpaces: true,
        });
    }
    return model;
}
const useTextModel = ({ monaco: customMonaco, contents, language, modelOptions = {}, onChange = monaco_1.noop, defaultContents = '', path, }) => {
    const contextMonaco = useMonaco_1.useMonacoContext()?.monaco;
    const monaco = customMonaco || contextMonaco;
    path =
        path ??
            `model${monaco?.languages.getLanguages().find((l) => l.id === language)
                ?.extensions?.[0] ?? '.js'}`;
    let modelPath = monaco_1.fixPath(path);
    const [model, setModel] = react_1.default.useState();
    const resolvedContents = contents != null ? contents : defaultContents;
    const resolvedContentsRef = react_1.default.useRef(resolvedContents);
    resolvedContentsRef.current = resolvedContents;
    react_1.default.useEffect(() => {
        if (monaco) {
            const model = initializeMonacoModel(monaco, modelPath, resolvedContentsRef.current);
            if (model) {
                setModel(model);
            }
        }
    }, [monaco, modelPath]);
    react_1.default.useEffect(() => {
        if (model) {
            const disposable = model.onDidChangeContent((event) => {
                onChange(model.getValue(), event, model);
            });
            return () => {
                disposable?.dispose?.();
            };
        }
    }, [model, onChange]);
    react_1.default.useEffect(() => {
        if (!monaco || !language) {
            return;
        }
        if (model) {
            console.log(`[monaco] setting language for ${model.uri.path}: ${language}`);
            monaco.editor.setModelLanguage(model, language);
        }
    }, [monaco, model, language]);
    react_1.default.useEffect(() => {
        let value = resolvedContents;
        if (model && value && value !== model.getValue()) {
            model.pushEditOperations([], [
                {
                    range: model.getFullModelRange(),
                    text: value,
                },
            ], () => null);
        }
    }, [model, resolvedContents]);
    useDeepCompareEffect_1.default(() => {
        if (model) {
            model.updateOptions(modelOptions);
        }
    }, [modelOptions], [model]);
    return model;
};
exports.useTextModel = useTextModel;
//# sourceMappingURL=useTextModel.js.map