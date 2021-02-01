"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMonaco = exports.useMonacoContext = exports.MonacoProvider = void 0;
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const monaco_1 = require("../monaco");
const create_hook_context_1 = require("create-hook-context");
const plugins_1 = require("../plugins");
const [MonacoProvider, _, __, MonacoContext] = create_hook_context_1.createContext((config) => exports.useMonaco(config), undefined, 'Monaco');
exports.MonacoProvider = MonacoProvider;
function useMonacoContext() {
    const context = react_1.default.useContext(MonacoContext);
    return context;
}
exports.useMonacoContext = useMonacoContext;
const useMonaco = ({ plugins = [], languages = ['javascript', 'typescript', 'html', 'css', 'json'], defaultEditorOptions = {
    automaticLayout: true,
    minimap: {
        enabled: false,
    },
}, onLoad, theme, themes, onThemeChange, ...loaderOptions } = {}) => {
    // Loading (unset once we have initialized monaco)
    let rFirstMount = react_1.default.useRef(true);
    const [isLoading, setIsLoading] = react_1.default.useState(true);
    // Set monaco context to state
    const contextMonaco = useMonacoContext();
    // Monaco instance (use the one in context if we have it)
    const [monaco, setMonaco] = react_1.default.useState(contextMonaco?.monaco
        ? contextMonaco.monaco
        : typeof window !== 'undefined'
            ? window.monaco
            : null);
    // A ref to hold our disposables (don't run these until the hook unmounts!)
    const disposablesRef = react_1.default.useRef([]);
    //
    // Load and/or initialize monaco
    react_1.default.useEffect(() => {
        let cancelable;
        let pluginDisposable;
        let onLoadDisposable;
        // This effect should only run in the browser
        if (typeof window === 'undefined')
            return;
        // If we have monaco already....
        if (monaco && isLoading) {
            if (!window.monaco)
                window.monaco = monaco;
            setIsLoading(false);
            return;
        }
        // If we need to get monaco into state...
        async function initializeMonaco() {
            let monaco = window.monaco;
            // Load monaco if necessary.
            if (monaco === undefined) {
                cancelable = monaco_1.loadMonaco(loaderOptions ?? {});
                monaco = await cancelable;
            }
            // Load plugins
            await monaco.plugin
                .install(...getPlugins(plugins, languages))
                .then((d) => (pluginDisposable = monaco_1.asDisposable(d)));
            // Setup themes
            if (!!themes) {
                monaco.editor.defineThemes(themes);
            }
            // Set the current theme
            if (!!theme) {
                let themeToSet = typeof theme === 'function' ? theme() : theme;
                if (typeof themeToSet === 'string' || !('then' in themeToSet)) {
                    monaco.editor.setTheme(themeToSet);
                }
                else {
                    themeToSet.then(monaco.editor.setTheme);
                }
            }
            // Perform any onLoad tasks.
            if (onLoad) {
                const disposables = await onLoad(monaco);
                if (disposables) {
                    onLoadDisposable = monaco_1.asDisposable(Array.isArray(disposables) ? disposables : [disposables]);
                }
            }
            // Save monaco to window and state.
            window.monaco = monaco;
            setMonaco(monaco);
            setIsLoading(false);
        }
        initializeMonaco().catch((error) => console.error('An error occurred during initialization of Monaco:', error));
        disposablesRef.current = [
            pluginDisposable?.dispose,
            onLoadDisposable?.dispose,
            cancelable?.cancel,
        ];
    }, [monaco, languages, plugins]);
    //
    // Setup onThemeChange event handler
    react_1.default.useEffect(() => {
        if (!monaco)
            return;
        if (!onThemeChange)
            return;
        if (rFirstMount.current)
            return;
        const disposable = monaco.editor.onDidChangeTheme((theme) => {
            onThemeChange(theme, monaco);
        });
        return () => {
            disposable?.dispose?.();
        };
    }, [monaco, onThemeChange, theme]);
    //
    // Setup theme and themes
    react_1.default.useEffect(() => {
        if (!monaco)
            return;
        if (rFirstMount.current)
            return;
        // Setup themes
        if (!!themes) {
            monaco.editor.defineThemes(themes);
        }
        // Set the current theme
        if (!!theme) {
            let themeToSet = typeof theme === 'function' ? theme() : theme;
            if (typeof themeToSet === 'string' || !('then' in themeToSet)) {
                monaco.editor.setTheme(themeToSet);
            }
            else {
                themeToSet.then(monaco.editor.setTheme);
            }
        }
    }, [monaco, theme, themes]);
    //
    // A hook to run changes when monaco changes. (Maybe not needed?)
    const useMonacoEffect = react_1.default.useCallback((cb, deps = []) => {
        return react_1.default.useEffect(() => monaco && cb(monaco), [monaco, ...deps]);
    }, [monaco]);
    // Cleanup disposables on unmount.
    react_1.default.useEffect(() => {
        rFirstMount.current = false;
        return () => disposablesRef.current.forEach((fn) => fn && fn());
    }, []);
    return {
        monaco,
        useMonacoEffect,
        defaultEditorOptions,
        isLoading,
    };
};
exports.useMonaco = useMonaco;
// Helpers
function getPlugins(plugins, languages) {
    return [
        ...plugins
            .map((plug) => typeof plug === 'string' || (Array.isArray(plug) && plug.length === 2)
            ? plugins_1.pluginMap[Array.isArray(plug) ? plug[0] : plug]
                ? plugins_1.pluginMap[Array.isArray(plug) ? plug[0] : plug](Array.isArray(plug) ? plug[1] : {})
                : undefined
            : plug)
            .filter(Boolean),
        ...languages
            .map((plug) => typeof plug === 'string'
            ? monaco_1.basicLanguagePlugins[plug]
                ? monaco_1.basicLanguagePlugins[plug]
                : undefined
            : plug)
            .filter(Boolean),
    ];
}
//# sourceMappingURL=useMonaco.js.map