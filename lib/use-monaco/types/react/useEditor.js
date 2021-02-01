"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useEditor = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const useDeepCompareEffect_1 = tslib_1.__importDefault(require("./useDeepCompareEffect"));
const monaco_1 = require("../monaco");
const useMonaco_1 = require("./useMonaco");
const useEditor = ({ options = {}, onEditorDidMount = monaco_1.noop, model, monaco: customMonaco, overrideServices, onChange = monaco_1.noop, }) => {
    // const [container, setContainer] = React.useRef<HTMLDivElement>();
    const monacoContext = useMonaco_1.useMonacoContext();
    const contextMonaco = monacoContext?.monaco;
    const monaco = customMonaco || contextMonaco;
    const defaultEditorOptions = react_1.default.useRef(monacoContext?.defaultEditorOptions);
    defaultEditorOptions.current = monacoContext?.defaultEditorOptions;
    const [container, setContainer] = react_1.default.useState();
    const [editor, setEditor, useEditorEffect] = useStateWithEffects();
    const editorRef = react_1.default.useRef(editor);
    editorRef.current = editor;
    const elWatcher = useElementWatcher((el) => {
        if (el !== container) {
            setContainer(el);
        }
    });
    const subscriptionRef = react_1.default.useRef(null);
    react_1.default.useEffect(() => {
        if (!monaco || !container) {
            return;
        }
        if (container.getElementsByClassName('monaco-editor').length === 0) {
            console.log(`[monaco] creating editor`, { options, container });
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            const monacoEditor = monaco.editor.create(container, { ...(defaultEditorOptions.current ?? {}), ...options }, typeof overrideServices === 'function'
                ? overrideServices(monaco)
                : overrideServices);
            let didMount = onEditorDidMount(monacoEditor, monaco);
            let userDisposables;
            if (didMount && Array.isArray(didMount)) {
                userDisposables = monaco_1.asDisposable(didMount);
            }
            setEditor(monacoEditor);
            return () => {
                if (userDisposables) {
                    userDisposables.dispose();
                }
            };
        }
    }, [monaco, container, setEditor]);
    react_1.default.useEffect(() => {
        return () => {
            if (editor) {
                editor?.dispose?.();
            }
        };
    }, []);
    useEditorEffect((editor) => {
        if (model) {
            editor.setModel(model);
        }
    }, [model]);
    useEditorEffect((editor) => {
        subscriptionRef.current = editor.onDidChangeModelContent((event) => {
            if (editor) {
                onChange(editor?.getValue(), editor, event, monaco);
            }
        });
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.dispose();
            }
        };
    }, [onChange]);
    useDeepCompareEffect_1.default(() => {
        if (editor) {
            editor.updateOptions(options);
        }
    }, [options], [editor]);
    return {
        containerRef: elWatcher,
        useEditorEffect,
        editor,
    };
};
exports.useEditor = useEditor;
function useElementWatcher(watcher) {
    const lastRef = react_1.default.useRef(null);
    const elRef = react_1.default.useRef((el) => {
        lastRef.current?.();
        lastRef.current = el ? watcher(el) : null;
    });
    return elRef.current;
}
function useStateWithEffects() {
    const [state, setState] = react_1.default.useState();
    const useStateEffect = (effect, deps) => {
        react_1.default.useEffect(() => {
            if (state) {
                return effect(state);
            }
        }, [state, ...deps]);
    };
    return [state, setState, useStateEffect];
}
//# sourceMappingURL=useEditor.js.map