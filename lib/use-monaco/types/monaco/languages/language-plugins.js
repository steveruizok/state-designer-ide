"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basicLanguagePlugins = void 0;
const basic_languages_1 = require("./basic-languages");
const plugin_api_1 = require("../plugin-api");
exports.basicLanguagePlugins = Object.fromEntries(basic_languages_1.basicLanguages.map((lang) => [
    lang,
    plugin_api_1.createPlugin({ name: 'language.' + lang }, async (monaco) => {
        if (basic_languages_1.knownBasicLanguages.includes(lang)) {
            await monaco.plugin.install(plugin_api_1.createRemotePlugin({
                name: 'language.' + lang + '.basic',
                dependencies: [],
                url: monaco.loader.languagesPath + `${lang}.basic.js`,
            }));
        }
        if (basic_languages_1.knonwLanguageServices.includes(lang)) {
            await monaco.plugin.install(plugin_api_1.createRemotePlugin({
                name: 'language.' + lang + '.service',
                dependencies: [],
                url: monaco.loader.languagesPath + `${lang}.service.js`,
            }));
        }
        if (basic_languages_1.languageServiceAliases[lang]) {
            await monaco.plugin.install(plugin_api_1.createRemotePlugin({
                name: 'language.' + basic_languages_1.languageServiceAliases[lang] + '.service',
                dependencies: [],
                url: monaco.loader.languagesPath +
                    `${basic_languages_1.languageServiceAliases[lang]}.service.js`,
            }));
        }
    }),
]));
//# sourceMappingURL=language-plugins.js.map