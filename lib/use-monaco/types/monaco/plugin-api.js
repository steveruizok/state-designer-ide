"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRemotePlugin = exports.compose = exports.createPlugin = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("./utils");
const createPlugin = ({ dependencies, name, format = 'local', ...other }, plugin) => {
    plugin.dependencies = dependencies;
    plugin.label = name;
    // plugin.format = format;
    return plugin;
};
exports.createPlugin = createPlugin;
const compose = (...plugins) => (obj) => {
    for (var plugin of plugins) {
        plugin(obj);
    }
};
exports.compose = compose;
const scope_eval_1 = tslib_1.__importDefault(require("scope-eval"));
function modularize(text, globals, dependencies) {
    const require = (path) => {
        return dependencies[path];
    };
    const exports = {};
    const module = {
        exports,
    };
    scope_eval_1.default(text, { module, exports, require, ...globals });
    return { module, exports };
}
async function fetchPlugin({ url, fetchOptions = {} }) {
    const response = await fetch(url, {
        ...fetchOptions,
    });
    const text = await response.text();
    const code = text;
    const plugin = (monaco) => {
        try {
            modularize(code, { monaco }, {
                'monaco-editor-core': monaco,
                'monaco-editor': monaco,
                'use-monaco': monaco,
            });
        }
        catch (e) {
            console.log('[monaco] Error installing plugin from', url);
        }
        return {
            dispose: () => { },
        };
    };
    return plugin;
}
const createRemotePlugin = ({ dependencies, name, url, fetchOptions = {}, }) => {
    return exports.createPlugin({
        name,
        dependencies,
    }, async (monaco) => {
        console.log('[monaco] fetching plugin from', url);
        const remotePlugin = await fetchPlugin({ url, fetchOptions });
        return remotePlugin(monaco);
    });
};
exports.createRemotePlugin = createRemotePlugin;
exports.default = (monaco) => {
    const installed = {};
    // monaco.loader.includeBasicLanguages
    //   ? Object.fromEntries(
    //       basicLanguages.map((lang) => [`language.${lang}`, true as any])
    //     )
    //   : {};
    const waitingFor = {};
    function release(done) {
        if (waitingFor[done]) {
            const disposables = waitingFor[done].map((plugin) => {
                let keepWaiting;
                plugin.dependencies.forEach((dep) => {
                    if (!installed[dep]) {
                        keepWaiting = true;
                    }
                });
                if (!keepWaiting) {
                    return installPlugin(plugin);
                }
                else {
                    return null;
                }
            });
            delete waitingFor[done];
            return utils_1.asDisposable(disposables.filter(Boolean));
        }
    }
    async function installPlugin(plugin) {
        console.log(`[monaco] installing plugin: ${plugin.label ?? plugin.name}`);
        let d1 = await plugin(monaco);
        installed[plugin.label ?? plugin.name] = plugin;
        if (plugin.label) {
            let d2 = release(plugin.label);
            return utils_1.asDisposable([d1, d2].filter(Boolean));
        }
        return d1;
    }
    // returns whether to continue to install (true), or not install and wait (false)
    async function checkDependencies(plugin) {
        let waiting;
        plugin.dependencies?.forEach((dep) => {
            if (installed[dep]) {
            }
            else {
                if (!waitingFor[dep]) {
                    waitingFor[dep] = [];
                }
                waitingFor[dep].push(plugin);
                waiting = true;
            }
        });
        if (waiting) {
            return false;
        }
        return true;
    }
    Object.assign(monaco, {
        plugin: {
            isInstalled: (name) => !!installed[name],
            install: async (...plugins) => {
                let disposables = [];
                for (var i in plugins) {
                    let plugin = plugins[i];
                    plugin =
                        typeof plugin === 'function'
                            ? plugin
                            : plugin.url
                                ? await fetchPlugin(plugin)
                                : null;
                    if (!plugin) {
                        throw new Error(`Couldn't resolve plugin, ${plugin}`);
                    }
                    plugin.label = plugin.label ?? plugin.name;
                    if (installed[plugin.label]) {
                        console.log(`[monaco] skipped installing ${plugin.label} (already installed)`);
                        return;
                    }
                    if (!(await checkDependencies(plugin))) {
                        continue;
                    }
                    disposables.push(await installPlugin(plugin));
                }
                return utils_1.asDisposable(disposables.filter(Boolean));
            },
        },
    });
    return monaco;
};
//# sourceMappingURL=plugin-api.js.map