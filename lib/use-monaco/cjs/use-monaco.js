"use strict"

Object.defineProperty(exports, "__esModule", { value: true })

const log = process.env.NODE_ENV === "production" ? () => {} : () => {} // console.log : () => {}

var scopeEval = require("scope-eval")
var useDebounce = require("use-debounce")
var React = require("react")
var dequal = require("dequal")
var createHookContext = require("create-hook-context")
var deepmerge = require("deepmerge")
var Color = require("color")
var dot = require("dot-object")
var onigasm = require("onigasm")
var monacoTextmate = require("monaco-textmate")

function _interopDefaultLegacy(e) {
  return e && typeof e === "object" && "default" in e ? e : { default: e }
}

var scopeEval__default = /*#__PURE__*/ _interopDefaultLegacy(scopeEval)
var React__default = /*#__PURE__*/ _interopDefaultLegacy(React)
var deepmerge__default = /*#__PURE__*/ _interopDefaultLegacy(deepmerge)
var Color__default = /*#__PURE__*/ _interopDefaultLegacy(Color)
var dot__default = /*#__PURE__*/ _interopDefaultLegacy(dot)

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ("value" in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key]
          }
        }
      }

      return target
    }

  return _extends.apply(this, arguments)
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {}
  var target = {}
  var sourceKeys = Object.keys(source)
  var key, i

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i]
    if (excluded.indexOf(key) >= 0) continue
    target[key] = source[key]
  }

  return target
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return
  if (typeof o === "string") return _arrayLikeToArray(o, minLen)
  var n = Object.prototype.toString.call(o).slice(8, -1)
  if (n === "Object" && o.constructor) n = o.constructor.name
  if (n === "Map" || n === "Set") return Array.from(o)
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
    return _arrayLikeToArray(o, minLen)
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]

  return arr2
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (
      Array.isArray(o) ||
      (it = _unsupportedIterableToArray(o)) ||
      (allowArrayLike && o && typeof o.length === "number")
    ) {
      if (it) o = it
      var i = 0
      return function () {
        if (i >= o.length)
          return {
            done: true,
          }
        return {
          done: false,
          value: o[i++],
        }
      }
    }

    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
    )
  }

  it = o[Symbol.iterator]()
  return it.next.bind(it)
}

// A type of promise-like that resolves synchronously and supports only one observer
const _Pact = /*#__PURE__*/ (function () {
  function _Pact() {}
  _Pact.prototype.then = function (onFulfilled, onRejected) {
    const result = new _Pact()
    const state = this.s
    if (state) {
      const callback = state & 1 ? onFulfilled : onRejected
      if (callback) {
        try {
          _settle(result, 1, callback(this.v))
        } catch (e) {
          _settle(result, 2, e)
        }
        return result
      } else {
        return this
      }
    }
    this.o = function (_this) {
      try {
        const value = _this.v
        if (_this.s & 1) {
          _settle(result, 1, onFulfilled ? onFulfilled(value) : value)
        } else if (onRejected) {
          _settle(result, 1, onRejected(value))
        } else {
          _settle(result, 2, value)
        }
      } catch (e) {
        _settle(result, 2, e)
      }
    }
    return result
  }
  return _Pact
})()

// Settles a pact synchronously
function _settle(pact, state, value) {
  if (!pact.s) {
    if (value instanceof _Pact) {
      if (value.s) {
        if (state & 1) {
          state = value.s
        }
        value = value.v
      } else {
        value.o = _settle.bind(null, pact, state)
        return
      }
    }
    if (value && value.then) {
      value.then(_settle.bind(null, pact, state), _settle.bind(null, pact, 2))
      return
    }
    pact.s = state
    pact.v = value
    const observer = pact.o
    if (observer) {
      observer(pact)
    }
  }
}

function _isSettledPact(thenable) {
  return thenable instanceof _Pact && thenable.s & 1
}

// Asynchronously iterate through an object that has a length property, passing the index as the first argument to the callback (even as the length property changes)
function _forTo(array, body, check) {
  var i = -1,
    pact,
    reject
  function _cycle(result) {
    try {
      while (++i < array.length && (!check || !check())) {
        result = body(i)
        if (result && result.then) {
          if (_isSettledPact(result)) {
            result = result.v
          } else {
            result.then(
              _cycle,
              reject || (reject = _settle.bind(null, (pact = new _Pact()), 2)),
            )
            return
          }
        }
      }
      if (pact) {
        _settle(pact, 1, result)
      } else {
        pact = result
      }
    } catch (e) {
      _settle(pact || (pact = new _Pact()), 2, e)
    }
  }
  _cycle()
  return pact
}

// Asynchronously iterate through an object's properties (including properties inherited from the prototype)
// Uses a snapshot of the object's properties
function _forIn(target, body, check) {
  var keys = []
  for (var key in target) {
    keys.push(key)
  }
  return _forTo(
    keys,
    function (i) {
      return body(keys[i])
    },
    check,
  )
}

const _iteratorSymbol =
  /*#__PURE__*/ typeof Symbol !== "undefined"
    ? Symbol.iterator || (Symbol.iterator = Symbol("Symbol.iterator"))
    : "@@iterator"

const _asyncIteratorSymbol =
  /*#__PURE__*/ typeof Symbol !== "undefined"
    ? Symbol.asyncIterator ||
      (Symbol.asyncIterator = Symbol("Symbol.asyncIterator"))
    : "@@asyncIterator"

// Asynchronously call a function and send errors to recovery continuation
function _catch(body, recover) {
  try {
    var result = body()
  } catch (e) {
    return recover(e)
  }
  if (result && result.then) {
    return result.then(void 0, recover)
  }
  return result
}

function parseJSONWithComments(json) {
  var tokenizer = /"|(\/\*)|(\*\/)|(\/\/)|\n|\r/g,
    in_string = false,
    in_multiline_comment = false,
    in_singleline_comment = false,
    tmp,
    tmp2,
    new_str = [],
    ns = 0,
    from = 0,
    lc,
    rc
  tokenizer.lastIndex = 0

  while ((tmp = tokenizer.exec(json))) {
    // @ts-ignore
    lc = RegExp.leftContext // @ts-ignore

    rc = RegExp.rightContext

    if (!in_multiline_comment && !in_singleline_comment) {
      tmp2 = lc.substring(from)

      if (!in_string) {
        tmp2 = tmp2.replace(/(\n|\r|\s)*/g, "")
      }

      new_str[ns++] = tmp2
    }

    from = tokenizer.lastIndex

    if (tmp[0] == '"' && !in_multiline_comment && !in_singleline_comment) {
      tmp2 = lc.match(/(\\)*$/)

      if (!in_string || !tmp2 || tmp2[0].length % 2 == 0) {
        // start of string with ", or unescaped " character found to end string
        in_string = !in_string
      }

      from-- // include " character in next catch

      rc = json.substring(from)
    } else if (
      tmp[0] == "/*" &&
      !in_string &&
      !in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_multiline_comment = true
    } else if (
      tmp[0] == "*/" &&
      !in_string &&
      in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_multiline_comment = false
    } else if (
      tmp[0] == "//" &&
      !in_string &&
      !in_multiline_comment &&
      !in_singleline_comment
    ) {
      in_singleline_comment = true
    } else if (
      (tmp[0] == "\n" || tmp[0] == "\r") &&
      !in_string &&
      !in_multiline_comment &&
      in_singleline_comment
    ) {
      in_singleline_comment = false
    } else if (
      !in_multiline_comment &&
      !in_singleline_comment &&
      !/\n|\r|\s/.test(tmp[0])
    ) {
      new_str[ns++] = tmp[0]
    }
  }

  new_str[ns++] = rc
  return new_str.join("").replace(/,}/, "}")
}

var fixPath = function fixPath(path) {
  return path.startsWith("/") ? path : "/" + path
}
var endingSlash = function endingSlash(path) {
  return path.endsWith("/") ? path : path + "/"
}
var noEndingSlash = function noEndingSlash(path) {
  return !path.endsWith("/") ? path : path.substr(0, path.length - 1)
}

function asDisposable(disposables) {
  return {
    dispose: function dispose() {
      var _disposables$dispose

      return Array.isArray(disposables)
        ? disposeAll(disposables.filter(Boolean))
        : typeof (disposables === null || disposables === void 0
            ? void 0
            : disposables.dispose) === "function"
        ? disposables === null || disposables === void 0
          ? void 0
          : (_disposables$dispose = disposables.dispose) === null ||
            _disposables$dispose === void 0
          ? void 0
          : _disposables$dispose.call(disposables)
        : {}
    },
  }
}
function disposeAll(disposables) {
  while (disposables.length) {
    var _disposables$pop, _disposables$pop$disp
    ;(_disposables$pop = disposables.pop()) === null ||
    _disposables$pop === void 0
      ? void 0
      : (_disposables$pop$disp = _disposables$pop.dispose) === null ||
        _disposables$pop$disp === void 0
      ? void 0
      : _disposables$pop$disp.call(_disposables$pop)
  }
}

var version = "0.0.40"

function processSize(size) {
  size = String(size)
  return !/^\d+$/.test(size) ? size : size + "px"
}
function processDimensions(width, height) {
  var fixedWidth = processSize(width)
  var fixedHeight = processSize(height)
  return {
    width: fixedWidth,
    height: fixedHeight,
  }
}
function noop() {
  return undefined
}

var fetchPlugin = function fetchPlugin(_ref3) {
  var url = _ref3.url,
    _ref3$fetchOptions = _ref3.fetchOptions,
    fetchOptions = _ref3$fetchOptions === void 0 ? {} : _ref3$fetchOptions

  try {
    return Promise.resolve(fetch(url, Object.assign({}, fetchOptions))).then(
      function (response) {
        return Promise.resolve(response.text()).then(function (text) {
          var code = text

          var plugin = function plugin(monaco) {
            try {
              modularize(
                code,
                {
                  monaco: monaco,
                },
                {
                  "monaco-editor-core": monaco,
                  "monaco-editor": monaco,
                  "use-monaco": monaco,
                },
              )
            } catch (e) {
              log("[monaco] Error installing plugin from", url)
            }

            return {
              dispose: function dispose() {},
            }
          }

          return plugin
        })
      },
    )
  } catch (e) {
    return Promise.reject(e)
  }
}

var createPlugin = function createPlugin(_ref, plugin) {
  var dependencies = _ref.dependencies,
    name = _ref.name,
    other = _objectWithoutPropertiesLoose(_ref, [
      "dependencies",
      "name",
      "format",
    ])

  plugin.dependencies = dependencies
  plugin.label = name // plugin.format = format;

  return plugin
}
var compose = function compose() {
  for (
    var _len = arguments.length, plugins = new Array(_len), _key = 0;
    _key < _len;
    _key++
  ) {
    plugins[_key] = arguments[_key]
  }

  return function (obj) {
    for (
      var _iterator = _createForOfIteratorHelperLoose(plugins), _step;
      !(_step = _iterator()).done;

    ) {
      var plugin = _step.value
      plugin(obj)
    }
  }
}

function modularize(text, globals, dependencies) {
  var require = function require(path) {
    return dependencies[path]
  }

  var exports = {}
  var module = {
    exports: exports,
  }
  scopeEval__default["default"](
    text,
    Object.assign(
      {
        module: module,
        exports: exports,
        require: require,
      },
      globals,
    ),
  )
  return {
    module: module,
    exports: exports,
  }
}

var createRemotePlugin = function createRemotePlugin(_ref2) {
  var dependencies = _ref2.dependencies,
    name = _ref2.name,
    url = _ref2.url,
    _ref2$fetchOptions = _ref2.fetchOptions,
    fetchOptions = _ref2$fetchOptions === void 0 ? {} : _ref2$fetchOptions
  return createPlugin(
    {
      name: name,
      dependencies: dependencies,
    },
    function (monaco) {
      try {
        log("[monaco] fetching plugin from", url)
        return Promise.resolve(
          fetchPlugin({
            url: url,
            fetchOptions: fetchOptions,
          }),
        ).then(function (remotePlugin) {
          return remotePlugin(monaco)
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  )
}
var withPlugins = function (monaco) {
  // returns whether to continue to install (true), or not install and wait (false)
  var checkDependencies = function checkDependencies(plugin) {
    try {
      var _plugin$dependencies

      var waiting
      ;(_plugin$dependencies = plugin.dependencies) === null ||
      _plugin$dependencies === void 0
        ? void 0
        : _plugin$dependencies.forEach(function (dep) {
            if (installed[dep]) {
            } else {
              if (!waitingFor[dep]) {
                waitingFor[dep] = []
              }

              waitingFor[dep].push(plugin)
              waiting = true
            }
          })

      if (waiting) {
        return Promise.resolve(false)
      }

      return Promise.resolve(true)
    } catch (e) {
      return Promise.reject(e)
    }
  }

  var installPlugin = function installPlugin(plugin) {
    try {
      var _plugin$label2

      log(
        "[monaco] installing plugin: " +
          ((_plugin$label2 = plugin.label) !== null && _plugin$label2 !== void 0
            ? _plugin$label2
            : plugin.name),
      )
      return Promise.resolve(plugin(monaco)).then(function (d1) {
        var _plugin$label3

        installed[
          (_plugin$label3 = plugin.label) !== null && _plugin$label3 !== void 0
            ? _plugin$label3
            : plugin.name
        ] = plugin

        if (plugin.label) {
          var d2 = release(plugin.label)
          return asDisposable([d1, d2].filter(Boolean))
        }

        return d1
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  var installed = {} // monaco.loader.includeBasicLanguages
  //   ? Object.fromEntries(
  //       basicLanguages.map((lang) => [`language.${lang}`, true as any])
  //     )
  //   : {};

  var waitingFor = {}

  function release(done) {
    if (waitingFor[done]) {
      var disposables = waitingFor[done].map(function (plugin) {
        var keepWaiting
        plugin.dependencies.forEach(function (dep) {
          if (!installed[dep]) {
            keepWaiting = true
          }
        })

        if (!keepWaiting) {
          return installPlugin(plugin)
        } else {
          return null
        }
      })
      delete waitingFor[done]
      return asDisposable(disposables.filter(Boolean))
    }
  }

  Object.assign(monaco, {
    plugin: {
      isInstalled: function isInstalled(name) {
        return !!installed[name]
      },
      install: function () {
        for (
          var _len2 = arguments.length, plugins = new Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          plugins[_key2] = arguments[_key2]
        }

        try {
          var _exit2 = false

          var _temp5 = function _temp5(_result) {
            return _exit2 ? _result : asDisposable(disposables.filter(Boolean))
          }

          var disposables = []

          var _temp6 = _forIn(
            plugins,
            function (i) {
              function _temp2(_fetchPlugin) {
                var _plugin$label

                plugin = _temp ? _fetchPlugin : _fetchPlugin

                if (!plugin) {
                  throw new Error("Couldn't resolve plugin, " + plugin)
                }

                plugin.label =
                  (_plugin$label = plugin.label) !== null &&
                  _plugin$label !== void 0
                    ? _plugin$label
                    : plugin.name

                if (installed[plugin.label]) {
                  log(
                    "[monaco] skipped installing " +
                      plugin.label +
                      " (already installed)",
                  )
                  _exit2 = true
                  return
                }

                return Promise.resolve(checkDependencies(plugin)).then(
                  function (_checkDependencies) {
                    if (!_checkDependencies) {
                      return
                    }

                    var _push = disposables.push
                    return Promise.resolve(installPlugin(plugin)).then(
                      function (_installPlugin) {
                        _push.call(disposables, _installPlugin)
                      },
                    )
                  },
                )
              }

              var plugin = plugins[i]

              var _temp = typeof plugin === "function",
                _plugin$url = _temp || plugin.url

              return _temp || !_plugin$url
                ? _temp2(
                    _temp ? plugin : _plugin$url ? fetchPlugin(plugin) : null,
                  )
                : Promise.resolve(
                    _temp ? plugin : _plugin$url ? fetchPlugin(plugin) : null,
                  ).then(_temp2)
            },
            function () {
              return _exit2
            },
          )

          return Promise.resolve(
            _temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6),
          )
        } catch (e) {
          return Promise.reject(e)
        }
      },
    },
  })
  return monaco
}

var languageDefinitions = {}
var lazyLanguageLoaders = {}

var LazyLanguageLoader = /*#__PURE__*/ (function () {
  LazyLanguageLoader.getOrCreate = function getOrCreate(languageId) {
    if (!lazyLanguageLoaders[languageId]) {
      lazyLanguageLoaders[languageId] = new LazyLanguageLoader(languageId)
    }

    return lazyLanguageLoaders[languageId]
  }

  function LazyLanguageLoader(languageId) {
    var _this = this

    this._languageId = void 0
    this._loadingTriggered = void 0
    this._lazyLoadPromise = void 0
    this._lazyLoadPromiseResolve = void 0
    this._lazyLoadPromiseReject = void 0
    this._languageId = languageId
    this._loadingTriggered = false
    this._lazyLoadPromise = new Promise(function (resolve, reject) {
      _this._lazyLoadPromiseResolve = resolve
      _this._lazyLoadPromiseReject = reject
    })
  }

  var _proto = LazyLanguageLoader.prototype

  _proto.whenLoaded = function whenLoaded() {
    return this._lazyLoadPromise
  }

  _proto.load = function load() {
    var _this2 = this

    if (!this._loadingTriggered) {
      var _languageDefinitions$, _languageDefinitions$2

      this._loadingTriggered = true
      ;(_languageDefinitions$ = languageDefinitions[this._languageId]) ===
        null || _languageDefinitions$ === void 0
        ? void 0
        : (_languageDefinitions$2 = _languageDefinitions$.loader) === null ||
          _languageDefinitions$2 === void 0
        ? void 0
        : _languageDefinitions$2.call(_languageDefinitions$).then(
            function (mod) {
              return _this2._lazyLoadPromiseResolve(mod)
            },
            function (err) {
              return _this2._lazyLoadPromiseReject(err)
            },
          )
    }

    return this._lazyLoadPromise
  }

  return LazyLanguageLoader
})()

var languagesPlugin = createPlugin(
  {
    name: "core.languages",
    dependencies: ["core.workers"],
  },
  function (monaco) {
    var monacoLanguageRegister = monaco.languages.register

    monaco.languages.register = function (languageDefintion) {
      var languageId = languageDefintion.id
      var lang = monaco.languages.getLanguages().find(function (l) {
        return l.id === languageId
      })

      if (lang) {
        log("[monaco] replacing language:", languageId)
        Object.assign(lang, languageDefintion)
        languageDefinitions[languageId] = languageDefintion
      } else {
        languageDefinitions[languageId] = languageDefintion
        log("[monaco] registering language:", languageId)
      }

      monacoLanguageRegister(languageDefintion)

      if (languageDefintion.loader) {
        var lazyLanguageLoader = LazyLanguageLoader.getOrCreate(languageId)
        monaco.languages.setMonarchTokensProvider(
          languageId,
          lazyLanguageLoader
            .whenLoaded()
            .then(function (mod) {
              return mod.language
            })
            ["catch"](function (e) {
              console.error(e)
              return
            }),
        )
        monaco.languages.onLanguage(languageId, function () {
          lazyLanguageLoader
            .load()
            .then(function (mod) {
              if (mod && mod.conf) {
                monaco.languages.setLanguageConfiguration(languageId, mod.conf)
              }
            })
            ["catch"](function (err) {
              console.error(err)
              return
            })
        })
      }

      if (languageDefintion.worker) {
        var config =
          typeof languageDefintion.worker === "object"
            ? languageDefintion.worker
            : {}
        monaco.worker.register(
          Object.assign(
            {
              languageId: languageId,
            },
            config,
          ),
        )
      }
    }
  },
)

var themes = createPlugin(
  {
    name: "core.themes",
    dependencies: ["core.editors"],
  },
  function (monaco) {
    var setTheme = monaco.editor.setTheme
    var definedThemes = {}

    var _onDidChangeTheme = new monaco.Emitter()

    monaco.editor.onDidChangeTheme = _onDidChangeTheme.event
    var defineTheme = monaco.editor.defineTheme

    monaco.editor.defineTheme = function (name, theme) {
      defineTheme(name, theme)
      definedThemes[name] = theme
    }

    monaco.editor.setTheme = function (theme) {
      if (typeof theme === "string") {
        try {
          var resolvedTheme = JSON.parse(parseJSONWithComments(theme))

          if (
            typeof resolvedTheme === "object" &&
            (resolvedTheme === null || resolvedTheme === void 0
              ? void 0
              : resolvedTheme.colors)
          ) {
            monaco.editor.setTheme(resolvedTheme)
            return
          } else {
            log("[monaco] setting theme:", theme)
            setTheme(theme)

            _onDidChangeTheme.fire({
              name: theme,
              theme: definedThemes[theme],
            })
          }
        } catch (e) {
          log("[monaco] setting theme:", theme)
          setTheme(theme)

          _onDidChangeTheme.fire({
            name: theme,
            theme: definedThemes[theme],
          })
        }
      } else if (typeof theme === "object") {
        try {
          monaco.editor.defineTheme("custom", theme)
          log("[monaco] setting theme:", theme)
          setTheme("custom")

          _onDidChangeTheme.fire({
            name: "custom",
            theme: theme,
          })
        } catch (e) {
          console.warn("[monaco] error setting theme: " + e)
        }
      }
    }

    monaco.editor.getDefinedThemes = function () {
      return definedThemes
    }

    monaco.editor.defineThemes = function (themes) {
      Object.keys(themes).forEach(function (themeName) {
        monaco.editor.defineTheme(themeName, themes[themeName])
      })
    }

    monaco.editor.getTheme = function (themeName) {
      var _monaco$editor$getFoc

      return (_monaco$editor$getFoc = monaco.editor.getFocusedEditor()) ===
        null || _monaco$editor$getFoc === void 0
        ? void 0
        : _monaco$editor$getFoc["_themeService"]
    }
  },
) // function setupThemes(
//   monaco: typeof monacoApi,
//   // editor: monacoApi.editor.IStandaloneCodeEditor,
//   themes: any
// ) {
//   // const allThemes = {
//   //   // ...defaultThemes,
//   //   ...themes,
//   // };
//   // Object.keys(allThemes).forEach((themeName) => {
//   //   monaco.editor.defineTheme(
//   //     themeName,
//   //     allThemes[themeName as keyof typeof allThemes]
//   //   );
//   // });
//   // editor.addSelectAction({
//   //   id: 'editor.action.selectTheme',
//   //   label: 'Preferences: Color Theme',
//   //   choices: () => Object.keys(themeNames),
//   //   runChoice: (choice, mode, ctx, api) => {
//   //     if (mode === 0) {
//   //       api.editor.setTheme(themeNames[choice]);
//   //     } else if (mode === 1) {
//   //       api.editor.setTheme(themeNames[choice]);
//   //     }
//   //   },
//   //   runAction: function (editor: any, api: any) {
//   //     const _this: any = this;
//   //     const currentTheme = editor._themeService._theme.themeName;
//   //     log(currentTheme);
//   //     const controller = _this.getController(editor);
//   //     const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
//   //     controller.widget.quickOpenWidget.callbacks.onCancel = function () {
//   //       debugger;
//   //       monaco.editor.setTheme(currentTheme);
//   //       oldDestroy();
//   //     };
//   //     log(
//   //       controller,
//   //       controller.widget.quickOpenWidget.callbacks.onCancel,
//   //       this
//   //     );
//   //     _this.show(editor);
//   //     return Promise.resolve();
//   //   },
//   // });
// }
// // A list of color names:
// 'foreground' // Overall foreground color. This color is only used if not overridden by a component.
// 'errorForeground' // Overall foreground color for error messages. This color is only used if not overridden by a component.
// 'descriptionForeground' // Foreground color for description text providing additional information, for example for a label.
// 'focusBorder' // Overall border color for focused elements. This color is only used if not overridden by a component.
// 'contrastBorder' // An extra border around elements to separate them from others for greater contrast.
// 'contrastActiveBorder' // An extra border around active elements to separate them from others for greater contrast.
// 'selection.background' // The background color of text selections in the workbench (e.g. for input fields or text areas). Note that this does not apply to selections within the editor.
// 'textSeparator.foreground' // Color for text separators.
// 'textLink.foreground' // Foreground color for links in text.
// 'textLink.activeForeground' // Foreground color for active links in text.
// 'textPreformat.foreground' // Foreground color for preformatted text segments.
// 'textBlockQuote.background' // Background color for block quotes in text.
// 'textBlockQuote.border' // Border color for block quotes in text.
// 'textCodeBlock.background' // Background color for code blocks in text.
// 'widget.shadow' // Shadow color of widgets such as find/replace inside the editor.
// 'input.background' // Input box background.
// 'input.foreground' // Input box foreground.
// 'input.border' // Input box border.
// 'inputOption.activeBorder' // Border color of activated options in input fields.
// 'input.placeholderForeground' // Input box foreground color for placeholder text.
// 'inputValidation.infoBackground' // Input validation background color for information severity.
// 'inputValidation.infoBorder' // Input validation border color for information severity.
// 'inputValidation.warningBackground' // Input validation background color for information warning.
// 'inputValidation.warningBorder' // Input validation border color for warning severity.
// 'inputValidation.errorBackground' // Input validation background color for error severity.
// 'inputValidation.errorBorder' // Input validation border color for error severity.
// 'dropdown.background' // Dropdown background.
// 'dropdown.foreground' // Dropdown foreground.
// 'dropdown.border' // Dropdown border.
// 'list.focusBackground' // List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
// 'list.focusForeground' // List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
// 'list.activeSelectionBackground' // List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
// 'list.activeSelectionForeground' // List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.
// 'list.inactiveSelectionBackground' // List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
// 'list.inactiveSelectionForeground' // List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.
// 'list.hoverBackground' // List/Tree background when hovering over items using the mouse.
// 'list.hoverForeground' // List/Tree foreground when hovering over items using the mouse.
// 'list.dropBackground' // List/Tree drag and drop background when moving items around using the mouse.
// 'list.highlightForeground' // List/Tree foreground color of the match highlights when searching inside the list/tree.
// 'pickerGroup.foreground' // Quick picker color for grouping labels.
// 'pickerGroup.border' // Quick picker color for grouping borders.
// 'button.foreground' // Button foreground color.
// 'button.background' // Button background color.
// 'button.hoverBackground' // Button background color when hovering.
// 'badge.background' // Badge background color. Badges are small information labels, e.g. for search results count.
// 'badge.foreground' // Badge foreground color. Badges are small information labels, e.g. for search results count.
// 'scrollbar.shadow' // Scrollbar shadow to indicate that the view is scrolled.
// 'scrollbarSlider.background' // Slider background color.
// 'scrollbarSlider.hoverBackground' // Slider background color when hovering.
// 'scrollbarSlider.activeBackground' // Slider background color when active.
// 'progressBar.background' // Background color of the progress bar that can show for long running operations.
// 'editor.background' // Editor background color.
// 'editor.foreground' // Editor default foreground color.
// 'editorWidget.background' // Background color of editor widgets, such as find/replace.
// 'editorWidget.border' // Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.
// 'editor.selectionBackground' // Color of the editor selection.
// 'editor.selectionForeground' // Color of the selected text for high contrast.
// 'editor.inactiveSelectionBackground' // Color of the selection in an inactive editor.
// 'editor.selectionHighlightBackground' // Color for regions with the same content as the selection.
// 'editor.findMatchBackground' // Color of the current search match.
// 'editor.findMatchHighlightBackground' // Color of the other search matches.
// 'editor.findRangeHighlightBackground' // Color the range limiting the search.
// 'editor.hoverHighlightBackground' // Highlight below the word for which a hover is shown.
// 'editorHoverWidget.background' // Background color of the editor hover.
// 'editorHoverWidget.border' // Border color of the editor hover.
// 'editorLink.activeForeground' // Color of active links.
// 'diffEditor.insertedTextBackground' // Background color for text that got inserted.
// 'diffEditor.removedTextBackground' // Background color for text that got removed.
// 'diffEditor.insertedTextBorder' // Outline color for the text that got inserted.
// 'diffEditor.removedTextBorder' // Outline color for text that got removed.
// 'editorOverviewRuler.currentContentForeground' // Current overview ruler foreground for inline merge-conflicts.
// 'editorOverviewRuler.incomingContentForeground' // Incoming overview ruler foreground for inline merge-conflicts.
// 'editorOverviewRuler.commonContentForeground' // Common ancestor overview ruler foreground for inline merge-conflicts.
// 'editor.lineHighlightBackground' // Background color for the highlight of line at the cursor position.
// 'editor.lineHighlightBorder' // Background color for the border around the line at the cursor position.
// 'editor.rangeHighlightBackground' // Background color of highlighted ranges, like by quick open and find features.
// 'editorCursor.foreground' // Color of the editor cursor.
// 'editorWhitespace.foreground' // Color of whitespace characters in the editor.
// 'editorIndentGuide.background' // Color of the editor indentation guides.
// 'editorLineNumber.foreground' // Color of editor line numbers.
// 'editorRuler.foreground' // Color of the editor rulers.
// 'editorCodeLens.foreground' // Foreground color of editor code lenses
// 'editorBracketMatch.background' // Background color behind matching brackets
// 'editorBracketMatch.border' // Color for matching brackets boxes
// 'editorOverviewRuler.border' // Color of the overview ruler border.
// 'editorGutter.background' // Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.
// 'editorError.foreground' // Foreground color of error squigglies in the editor.
// 'editorError.border' // Border color of error squigglies in the editor.
// 'editorWarning.foreground' // Foreground color of warning squigglies in the editor.
// 'editorWarning.border' // Border color of warning squigglies in the editor.
// 'editorMarkerNavigationError.background' // Editor marker navigation widget error color.
// 'editorMarkerNavigationWarning.background' // Editor marker navigation widget warning color.
// 'editorMarkerNavigation.background' // Editor marker navigation widget background.
// 'editorSuggestWidget.background' // Background color of the suggest widget.
// 'editorSuggestWidget.border' // Border color of the suggest widget.
// 'editorSuggestWidget.foreground' // Foreground color of the suggest widget.
// 'editorSuggestWidget.selectedBackground' // Background color of the selected entry in the suggest widget.
// 'editorSuggestWidget.highlightForeground' // Color of the match highlights in the suggest widget.
// 'editor.wordHighlightBackground' // Background color of a symbol during read-access, like reading a variable.
// 'editor.wordHighlightStrongBackground' // Background color of a symbol during write-access, like writing to a variable.
// 'peekViewTitle.background' // Background color of the peek view title area.
// 'peekViewTitleLabel.foreground' // Color of the peek view title.
// 'peekViewTitleDescription.foreground' // Color of the peek view title info.
// 'peekView.border' // Color of the peek view borders and arrow.
// 'peekViewResult.background' // Background color of the peek view result list.
// 'peekViewResult.lineForeground' // Foreground color for line nodes in the peek view result list.
// 'peekViewResult.fileForeground' // Foreground color for file nodes in the peek view result list.
// 'peekViewResult.selectionBackground' // Background color of the selected entry in the peek view result list.
// 'peekViewResult.selectionForeground' // Foreground color of the selected entry in the peek view result list.
// 'peekViewEditor.background' // Background color of the peek view editor.
// 'peekViewEditorGutter.background' // Background color of the gutter in the peek view editor.
// 'peekViewResult.matchHighlightBackground' // Match highlight color in the peek view result list.
// 'peekViewEditor.matchHighlightBackground' // Match highlight color in the peek view editor.

var editors = createPlugin(
  {
    name: "core.editors",
    dependencies: [],
  },
  function (monaco) {
    var createMonacoEditor = monaco.editor.create

    var _onCreatedEditor = new monaco.Emitter() // const onDidCreateEditor = monaco.editor.onDidCreateEditor;

    monaco.editor.onDidCreateEditor = _onCreatedEditor.event // let _defaultEditorOptions = {};
    // monaco.editor.getDefaultEditorOptions = () => {
    //   let editorOptions = _defaultEditorOptions;
    //   log(editorOptions);
    //   return editorOptions;
    // };
    // monaco.editor.setDefaultEditorOptions = (opts) => {
    //   log(opts);
    //   Object.keys(opts).forEach((k) => {
    //     _defaultEditorOptions[k] = opts[k];
    //   });
    // };

    monaco.editor.create = function (domElement, options, override) {
      var editor = createMonacoEditor(domElement, options, override)

      _onCreatedEditor.fire(editor)

      return editor
    }

    var editors = []
    var focusedEditor = null

    monaco.editor.getFocusedEditor = function () {
      return focusedEditor
    }

    monaco.editor.getEditors = function () {
      return editors
    }

    return monaco.editor.onDidCreateEditor(function (editor) {
      editors.push(editor)

      if (!focusedEditor) {
        focusedEditor = editor
      }

      editor.onDidFocusEditorText(function () {
        focusedEditor = editor
      })
      editor.onDidDispose(function () {
        editors = editors.filter(function (ed) {
          return ed !== editor
        })
      })
    })
  },
) // editor.addSelectAction = function (descriptor) {
// return editor.addAction(new QuickSelectAction(descriptor, monaco) as any);
// };
// function setupCommandPaletteShortcuts(
//   editor: monacoApi.editor.IStandaloneCodeEditor
// ) {
//   // for firefox support (wasn't able to intercept key)
//   editor.addCommand(
//     monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_C,
//     () => {
//       editor.trigger('ctrl-shift-c', 'editor.action.quickCommand', null);
//     }
//   );
//   editor.addCommand(
//     monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_P,
//     () => {
//       editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
//     }
//   );
//   window.addEventListener('keydown', (event: any) => {
//     if (event.metaKey && event.shiftKey && event.code === 'KeyP') {
//       editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
//       event.stopPropagation();
//     }
//   });
// }
// @ts-ignore
// import { BaseEditorQuickOpenAction } from '../../node_modules/monaco-editor/esm/vs/editor/standalone/browser/quickOpen/editorQuickOpen';
// @ts-ignore
// import {
//   QuickOpenModel,
//   QuickOpenEntry,
//   // @ts-ignore
// } from '../../node_modules/monaco-editor/esm/vs/base/parts/quickopen/browser/quickOpenModel';
// @ts-ignore
// import { matchesFuzzy } from '../../node_modules/monaco-editor/esm/vs/base/common/filters';
// export type IQuickSelectAction = Omit<
//   monacoApi.editor.IActionDescriptor,
//   'run'
// > & {
//   choices?: () => Promise<string[]> | string[];
//   runChoice?: (
//     choice: string,
//     mode: number,
//     context: any,
//     api: typeof monacoApi
//   ) => Promise<boolean | void> | boolean | void;
//   runAction?: (
//     editor: monacoApi.editor.IStandaloneCodeEditor,
//     api: typeof monacoApi
//   ) => Promise<void>;
// };
// export class QuickSelectAction extends BaseEditorQuickOpenAction {
//   choices?: IQuickSelectAction['choices'];
//   runChoice: IQuickSelectAction['runChoice'];
//   id?: string;
//   label?: string;
//   precondition?: string;
//   keybindings?: number[];
//   keybindingContext?: string;
//   contextMenuGroupId?: string;
//   contextMenuOrder?: number;
//   runAction?: IQuickSelectAction['runAction'];
//   api: typeof monacoApi;
//   constructor(descriptor: IQuickSelectAction, api: typeof monacoApi) {
//     super(descriptor.label, descriptor);
//     Object.assign(this, descriptor);
//     const _this: any = this;
//     this.runAction =
//       descriptor?.runAction ??
//       (async function (editor: any, api: any, payload: any) {
//         await _this.show(editor, payload);
//         return;
//       } as any);
//     this.api = api;
//   }
// getOptions(
//   editor: monaco.editor.IStandaloneCodeEditor,
//   choices: string[],
//   searchValue: string
// ) {
//   const _this = this;
//   const entries: QuickOpenEntry[] = [];
//   choices.forEach((name) => {
//     var highlights = matchesFuzzy(searchValue, name);
//     if (highlights) {
//       const entry = new QuickOpenEntry();
//       entry.getLabel = () => name;
//       entry.setHighlights(highlights);
//       entry.run = function (mode: number, context: any) {
//         if (mode === 0) {
//           _this.runChoice?.(name, mode, context, _this.api);
//           return false;
//         } else if (mode === 1 /* OPEN */) {
//           // Use a timeout to give the quick open widget a chance to close itself first
//           setTimeout(function () {
//             // Some actions are enabled only when editor has focus
//             editor.focus();
//             _this.runChoice?.(name, mode, context, _this.api);
//           }, 50);
//           return true;
//         }
//         return false;
//       };
//       entries.push(entry);
//     }
//   });
//   return entries;
// }
//   async show(editor: monacoApi.editor.IStandaloneCodeEditor) {
//     const _this: any = this;
//     const choices = await _this.choices();
//     _this._show(_this.getController(editor), {
//       getModel: function (value: string) {
//         // return new QuickOpenModel(
//         //   _this.getOptions(editor, choices, value)
//         //   // _this._editorActionsToEntries(keybindingService, editor, value)
//         // );
//       },
//       getAutoFocus: function (searchValue: string) {
//         return {
//           autoFocusFirstEntry: true,
//           autoFocusPrefixMatch: searchValue,
//         };
//       },
//     });
//   }
//   run() {
//     const editor = arguments[0];
//     const _this = this;
//     _this.runAction?.apply(_this, [editor, monacoApi]);
//     return Promise.resolve();
//   }
// }
// export class SetThemeAction extends QuickSelectAction {
//   constructor() {
//     super();
//   }
//   _getThemeEntries(editor, searchValue) {
//     const _this = this;
//     const entries = [];
//     Object.keys(themeNames).forEach((name) => {
//       var highlights = matchesFuzzy(searchValue, name);
//       if (highlights) {
//         const entry = new QuickOpenEntry();
//         entry.getLabel = () => name;
//         entry.setHighlights(highlights);
//         entry.run = function (mode, context) {
//           if (mode === 0) {
//             _this.api.editor.setTheme(themeNames[name]);
//             return false;
//           } else if (mode === 1 /* OPEN */) {
//             // Use a timeout to give the quick open widget a chance to close itself first
//             setTimeout(function () {
//               // Some actions are enabled only when editor has focus
//               editor.focus();
//               _this.api.editor.setTheme(themeNames[name]);
//               localStorage.setItem('theme', themeNames[name]);
//             }, 50);
//             return true;
//           }
//         };
//         entries.push(entry);
//       }
//     });
//     return entries;
//   }
//   run() {
//     const editor: monacoApi.editor.IStandaloneCodeEditor = arguments[0];
//     const currentTheme = editor._themeService._theme.themeName;
//     this.show(editor);
//     const _this = this;
//     const controller = _this.getController(editor);
//     const oldDestroy = controller.widget.quickOpenWidget.callbacks.onCancel;
//     controller.widget.quickOpenWidget.callbacks.onCancel = function () {
//       monaco.editor.setTheme(currentTheme);
//       oldDestroy();
//     };
//     return Promise.resolve();
//   }
// }

var shortcuts = createPlugin(
  {
    name: "core.shortcuts",
    dependencies: ["core.editors"],
  },
  function (monaco) {
    return monaco.editor.onDidCreateEditor(function (editor) {
      var _editor$getRawOptions

      if (
        (_editor$getRawOptions = editor.getRawOptions()) === null ||
        _editor$getRawOptions === void 0
          ? void 0
          : _editor$getRawOptions.formatOnSave
      ) {
        editor.addCommand(
          monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
          function () {
            editor === null || editor === void 0
              ? void 0
              : editor.trigger("ctrl-s", "editor.action.formatDocument", null)
          },
        )
      } // }
      // for firefox support (wasn't able to intercept key)
      // editor.addCommand(
      //   monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_C,
      //   () => {
      //     editor.trigger('ctrl-shift-c', 'editor.action.quickCommand', null);
      //   }
      // );
      // editor.addCommand(
      //   monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KEY_P,
      //   () => {
      //     editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
      //   }
      // );
      // window.addEventListener('keydown', (event: any) => {
      //   if (event.metaKey && event.shiftKey && event.code === 'KeyP') {
      //     editor.trigger('ctrl-shift-p', 'editor.action.quickCommand', null);
      //     event.stopPropagation();
      //   }
      // });
    })
  },
)

var defaultProviderConfig = {
  reference: true,
  rename: true,
  signatureHelp: true,
  hover: true,
  documentSymbol: true,
  documentHighlight: true,
  definition: true,
  implementation: true,
  typeDefinition: true,
  codeLens: true,
  codeAction: true,
  documentFormattingEdit: true,
  documentRangeFormattingEdit: true,
  onTypeFormattingEdit: true,
  link: true,
  completionItem: true,
  color: true,
  foldingRange: true,
  declaration: true,
  selectionRange: true,
  diagnostics: true,
  documentSemanticTokens: true,
  documentRangeSemanticTokens: true,
}
var getProvider = function getProvider(getWorker, provider) {
  return function (model) {
    for (
      var _len = arguments.length,
        args = new Array(_len > 1 ? _len - 1 : 0),
        _key = 1;
      _key < _len;
      _key++
    ) {
      args[_key - 1] = arguments[_key]
    }

    try {
      var resource = model.uri
      return Promise.resolve(
        _catch(
          function () {
            return Promise.resolve(getWorker(resource)).then(function (worker) {
              return Promise.resolve(
                worker.provide.apply(
                  worker,
                  [provider, resource.toString()].concat(
                    args.slice(0, args.length - 1),
                  ),
                ),
              )
            })
          },
          function (e) {
            console.error(e)
            return null
          },
        ),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
var getSignatureHelpProvider = function getSignatureHelpProvider(getWorker) {
  return function (model, position, token, context) {
    try {
      var resource = model.uri
      return Promise.resolve(
        _catch(
          function () {
            return Promise.resolve(getWorker(resource)).then(function (worker) {
              return Promise.resolve(
                worker.provide(
                  "signatureHelp",
                  resource.toString(),
                  position,
                  context,
                ),
              )
            })
          },
          function (e) {
            console.error(e)
            return null
          },
        ),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
var getResolver = function getResolver(getWorker, resolver) {
  return function (model) {
    for (
      var _len2 = arguments.length,
        args = new Array(_len2 > 1 ? _len2 - 1 : 0),
        _key2 = 1;
      _key2 < _len2;
      _key2++
    ) {
      args[_key2 - 1] = arguments[_key2]
    }

    try {
      var resource = model.uri
      return Promise.resolve(
        _catch(
          function () {
            return Promise.resolve(getWorker(resource)).then(function (worker) {
              return Promise.resolve(
                worker.resolve.apply(
                  worker,
                  [resolver, resource.toString()].concat(
                    args.slice(0, args.length - 1),
                  ),
                ),
              )
            })
          },
          function (e) {
            console.error(e)
            return null
          },
        ),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
var getCompletionItemResolver = function getCompletionItemResolver(getWorker) {
  return function (item, token) {
    try {
      return Promise.resolve(
        _catch(
          function () {
            return Promise.resolve(getWorker()).then(function (worker) {
              return Promise.resolve(
                worker.resolve("completionItem", item, token),
              )
            })
          },
          function (e) {
            console.error(e)
            return null
          },
        ),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }
}
var DiagnosticsProvider = /*#__PURE__*/ (function () {
  var _proto = DiagnosticsProvider.prototype

  _proto.isActiveModel = function isActiveModel(model) {
    if (this._editor) {
      var currentModel = this._editor.getModel()

      if (
        currentModel &&
        currentModel.uri.toString() === model.uri.toString()
      ) {
        return true
      }
    }

    return false
  }

  function DiagnosticsProvider(client, monaco) {
    var _this = this

    this.client = client
    this._disposables = []
    this._listener = Object.create(null)
    this._editor = void 0
    this._client = void 0
    this.monaco = void 0
    this._client = client
    this.monaco = monaco

    this._disposables.push(
      monaco.editor.onDidCreateEditor(function (editor) {
        _this._editor = editor
      }),
    )

    var onModelAdd = function onModelAdd(model) {
      var modeId = model.getModeId()

      if (modeId !== client.config.languageId) {
        return
      } // log(
      //   'model added',
      //   model.uri.toString(),
      //   client.config.languageId,
      //   model.getModeId()
      // );

      var handle // log(handle, this._listener, this._client, model);

      _this._listener[model.uri.toString()] = model.onDidChangeContent(
        function () {
          clearTimeout(handle) // @ts-ignore

          handle = setTimeout(function () {
            // if (this.isActiveModel(model)) {
            _this._doValidate(model.uri, modeId) // }
          }, 500)
        },
      ) // if (this.isActiveModel(model)) {

      _this._doValidate(model.uri, modeId) // }
    }

    var onModelRemoved = function onModelRemoved(model) {
      var _client$config$langua

      // log(
      //   'model removed',
      //   model.uri.toString(),
      //   client.config.languageId
      // );
      monaco.editor.setModelMarkers(
        model,
        (_client$config$langua = client.config.languageId) !== null &&
          _client$config$langua !== void 0
          ? _client$config$langua
          : "",
        [],
      )
      var uriStr = model.uri.toString()
      var listener = _this._listener[uriStr]

      if (listener) {
        listener.dispose()
        delete _this._listener[uriStr]
      }
    }

    this._disposables.push(monaco.editor.onDidCreateModel(onModelAdd))

    this._disposables.push(
      monaco.editor.onWillDisposeModel(function (model) {
        // log(
        //   'model disposed',
        //   model.uri.toString(),
        //   client.config.languageId
        // );
        onModelRemoved(model)
      }),
    )

    this._disposables.push(
      monaco.editor.onDidChangeModelLanguage(function (event) {
        // log(
        //   'model changed language',
        //   event.model.uri.toString(),
        //   client.config.languageId
        // );
        onModelRemoved(event.model)
        onModelAdd(event.model)
      }),
    )

    this._disposables.push(
      client.onConfigDidChange(function (_) {
        monaco.editor.getModels().forEach(function (model) {
          if (model.getModeId() === client.config.languageId) {
            onModelRemoved(model)
            onModelAdd(model)
          }
        })
      }),
    )

    this._disposables.push({
      dispose: function dispose() {
        for (var key in _this._listener) {
          _this._listener[key].dispose()
        }
      },
    }) // monaco.editor.getModels().forEach(onModelAdd);
  }

  _proto.dispose = function dispose() {
    this._disposables.forEach(function (d) {
      return d && d.dispose()
    })

    this._disposables = []
  }

  _proto._doValidate = function _doValidate(resource, languageId) {
    try {
      var _this3 = this

      return Promise.resolve(
        _catch(
          function () {
            return Promise.resolve(
              _this3.client.getSyncedWorker(resource),
            ).then(function (worker) {
              return Promise.resolve(
                worker.doValidation(resource.toString()),
              ).then(function (diagnostics) {
                _this3.monaco.editor.setModelMarkers(
                  _this3.monaco.editor.getModel(resource),
                  languageId,
                  diagnostics,
                )
              })
            })
          },
          function (e) {
            console.error(e)
            return null
          },
        ),
      )
    } catch (e) {
      return Promise.reject(e)
    }
  }

  return DiagnosticsProvider
})()
var setupWorkerProviders = function setupWorkerProviders(
  languageId,
  providers,
  client,
  monaco,
) {
  if (providers === void 0) {
    providers = defaultProviderConfig
  }

  var disposables = []

  if (!providers) {
    return []
  }

  var getWorker = function getWorker() {
    try {
      return Promise.resolve(client.getSyncedWorker.apply(client, arguments))
    } catch (e) {
      return Promise.reject(e)
    }
  }

  providers =
    typeof providers === "boolean" && providers
      ? defaultProviderConfig
      : providers

  if (providers.diagnostics) {
    disposables.push(new DiagnosticsProvider(client, monaco))
  }

  if (providers.reference) {
    disposables.push(
      monaco.languages.registerReferenceProvider(languageId, {
        provideReferences: getProvider(getWorker, "references"),
      }),
    )
  }

  if (providers.rename) {
    disposables.push(
      monaco.languages.registerRenameProvider(languageId, {
        provideRenameEdits: getProvider(getWorker, "renameEdits"),
        resolveRenameLocation: getResolver(getWorker, "renameLocation"),
      }),
    )
  }

  if (providers.signatureHelp) {
    disposables.push(
      monaco.languages.registerSignatureHelpProvider(languageId, {
        provideSignatureHelp: getSignatureHelpProvider(getWorker),
      }),
    )
  }

  if (providers.hover) {
    disposables.push(
      monaco.languages.registerHoverProvider(languageId, {
        provideHover: getProvider(getWorker, "hover"),
      }),
    )
  }

  if (providers.documentSymbol) {
    disposables.push(
      monaco.languages.registerDocumentSymbolProvider(languageId, {
        provideDocumentSymbols: getProvider(getWorker, "documentSymbols"),
      }),
    )
  }

  if (providers.documentHighlight) {
    disposables.push(
      monaco.languages.registerDocumentHighlightProvider(languageId, {
        provideDocumentHighlights: getProvider(getWorker, "documentHighlights"),
      }),
    )
  }

  if (providers.definition) {
    disposables.push(
      monaco.languages.registerDefinitionProvider(languageId, {
        provideDefinition: getProvider(getWorker, "definition"),
      }),
    )
  }

  if (providers.implementation) {
    disposables.push(
      monaco.languages.registerImplementationProvider(languageId, {
        provideImplementation: getProvider(getWorker, "implementation"),
      }),
    )
  }

  if (providers.typeDefinition) {
    disposables.push(
      monaco.languages.registerTypeDefinitionProvider(languageId, {
        provideTypeDefinition: getProvider(getWorker, "typeDefinition"),
      }),
    )
  }

  if (providers.codeLens) {
    disposables.push(
      monaco.languages.registerCodeLensProvider(languageId, {
        provideCodeLenses: getProvider(getWorker, "codeLenses"),
        resolveCodeLens: getResolver(getWorker, "codeLens"),
      }),
    )
  }

  if (providers.codeAction) {
    disposables.push(
      monaco.languages.registerCodeActionProvider(languageId, {
        provideCodeActions: getProvider(getWorker, "codeActions"),
      }),
    )
  }

  if (providers.documentFormattingEdit) {
    disposables.push(
      monaco.languages.registerDocumentFormattingEditProvider(languageId, {
        provideDocumentFormattingEdits: getProvider(
          getWorker,
          "documentFormattingEdits",
        ),
      }),
    )
  }

  if (providers.documentRangeFormattingEdit) {
    disposables.push(
      monaco.languages.registerDocumentRangeFormattingEditProvider(languageId, {
        provideDocumentRangeFormattingEdits: getProvider(
          getWorker,
          "documentRangeFormattingEdits",
        ),
      }),
    )
  } // if (providers.onTypeFormattingEdit) {
  //   disposables.push(
  //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  //       provideOnTypeFormattingEdits: getProvider(
  //         getWorker,
  //         'onTypeFormattingEdits'
  //       ),
  //     })
  //   );
  // }

  if (providers.link) {
    disposables.push(
      monaco.languages.registerLinkProvider(languageId, {
        provideLinks: getProvider(getWorker, "links"),
      }),
    )
  }

  if (providers.completionItem) {
    disposables.push(
      monaco.languages.registerCompletionItemProvider(languageId, {
        triggerCharacters: providers.completionTriggerCharacters || [],
        provideCompletionItems: getProvider(getWorker, "completionItems"),
        resolveCompletionItem: getCompletionItemResolver(getWorker), // resolveCompletionItem: getResolver(getWorker, 'completionItem'),
      }),
    )
  }

  if (providers.color) {
    disposables.push(
      monaco.languages.registerColorProvider(languageId, {
        provideDocumentColors: getProvider(getWorker, "documentColors"),
        provideColorPresentations: getProvider(getWorker, "colorPresentations"),
      }),
    )
  }

  if (providers.foldingRange) {
    disposables.push(
      monaco.languages.registerFoldingRangeProvider(languageId, {
        provideFoldingRanges: getProvider(getWorker, "foldingRanges"),
      }),
    )
  }

  if (providers.declaration) {
    disposables.push(
      monaco.languages.registerDeclarationProvider(languageId, {
        provideDeclaration: getProvider(getWorker, "declaration"),
      }),
    )
  }

  if (providers.selectionRange) {
    disposables.push(
      monaco.languages.registerSelectionRangeProvider(languageId, {
        provideSelectionRanges: getProvider(getWorker, "selectionRanges"),
      }),
    )
  }

  return disposables // if (providers.onTypeFormattingEdit) {
  //     monaco.languages.registerOnTypeFormattingEditProvider(languageId, {
  // provideOnTypeFormattingEdits: getProvider(getWorker, 'onTypeFormattingEdits')
  // });
  // }
}

var WorkerConfig = /*#__PURE__*/ (function () {
  function WorkerConfig(config, monaco) {
    this._monaco = void 0
    this._onDidChange = void 0
    this._config = void 0
    this._config = config
    this._monaco = monaco
    this._onDidChange = new this._monaco.Emitter()
  } // @ts-ignore

  var _proto = WorkerConfig.prototype

  _proto.dispose = function dispose() {
    this._onDidChange.dispose()
  }

  _proto.setConfig = function setConfig(config) {
    this._config = Object.assign({}, this._config, config)

    this._onDidChange.fire(this._config)
  }

  _proto.setOptions = function setOptions(options) {
    this._config.options = Object.assign({}, this._config.options, options)

    this._onDidChange.fire(this._config)
  }

  _createClass(WorkerConfig, [
    {
      key: "onDidChange",
      get: function get() {
        return this._onDidChange.event
      },
    },
    {
      key: "config",
      get: function get() {
        return this._config
      },
    },
    {
      key: "languageId",
      get: function get() {
        return this._config.languageId
      },
    },
    {
      key: "label",
      get: function get() {
        return this._config.label
      },
    },
    {
      key: "providers",
      get: function get() {
        return this._config.providers
      },
    },
    {
      key: "options",
      get: function get() {
        return this._config.options
      },
    },
  ])

  return WorkerConfig
})()
var STOP_WHEN_IDLE_FOR = 10 * 60 * 1000 // 2min

var WorkerClient = /*#__PURE__*/ (function () {
  function WorkerClient(_ref, monaco) {
    var _this2 = this

    var languageId = _ref.languageId,
      _ref$label = _ref.label,
      label = _ref$label === void 0 ? languageId : _ref$label,
      src = _ref.src,
      options = _ref.options,
      _ref$providers = _ref.providers,
      providers =
        _ref$providers === void 0 ? defaultProviderConfig : _ref$providers,
      _ref$timeoutDelay = _ref.timeoutDelay,
      timeoutDelay =
        _ref$timeoutDelay === void 0 ? STOP_WHEN_IDLE_FOR : _ref$timeoutDelay
    this._config = void 0
    this._idleCheckInterval = void 0
    this._lastUsedTime = void 0
    this._worker = void 0
    this._client = void 0
    this._providerDisposables = void 0
    this._disposables = void 0
    this._monaco = void 0
    this._config = new WorkerConfig(
      {
        languageId: languageId,
        label: label,
        src: src,
        options: options,
        providers: providers,
        timeoutDelay: timeoutDelay,
      },
      monaco,
    )
    this._monaco = monaco
    this._idleCheckInterval = window.setInterval(function () {
      return _this2._checkIfIdle()
    }, 30 * 1000)
    this._lastUsedTime = 0
    this._worker = null
    this._client = null

    var stopWorkerConfigListener = this._config.onDidChange(function () {
      return _this2._stopWorker()
    })

    var registerProviderListener = this._config.onDidChange(function () {
      return _this2._registerProviders()
    })

    this._providerDisposables = []
    this._disposables = [
      stopWorkerConfigListener,
      registerProviderListener,
      this._config,
    ]

    this._registerProviders()
  }

  var _proto2 = WorkerClient.prototype

  _proto2._stopWorker = function _stopWorker() {
    if (this._worker) {
      this._worker.dispose()

      this._worker = null
    }

    this._client = null
  }

  _proto2.dispose = function dispose() {
    clearInterval(this._idleCheckInterval)
    disposeAll(this._disposables)

    this._stopWorker()
  }

  _proto2._registerProviders = function _registerProviders() {
    if (this.config.languageId) {
      disposeAll(this._providerDisposables)
      this._providerDisposables = setupWorkerProviders(
        this.config.languageId,
        this.config.providers,
        this,
        this._monaco,
      )

      this._disposables.push(asDisposable(this._providerDisposables))
    }
  }

  _proto2._checkIfIdle = function _checkIfIdle() {
    if (!this._worker) {
      return
    }

    var timePassedSinceLastUsed = Date.now() - this._lastUsedTime

    if (timePassedSinceLastUsed > this.timeoutDelay) {
      this._stopWorker()
    }
  }

  _proto2._getClient = function _getClient() {
    this._lastUsedTime = Date.now()

    if (!this._client) {
      this._worker = this._monaco.editor.createWebWorker(
        // new Proxy(
        //   {},
        //   {
        //     get: function (target, prop, receiver) {
        //       log(prop);
        //       if (prop === 'getModel') {
        //         return _this._monaco.editor.getModel;
        //       }
        //       if (prop === 'getModels') {
        //         return _this._monaco.editor.getModels;
        //       }
        //       throw new Error('Invalid operation on getModel');
        //     },
        //   }
        // ),
        // @ts-ignore
        {
          moduleId: this.config.label,
          // this._monaco.worker.environment.workerLoader,
          label: this.config.label,
          createData: Object.assign({}, this.config.options),
        },
      )
      this._client = this._worker.getProxy()
    }

    return this._client
  }

  _proto2.getSyncedWorker = function getSyncedWorker() {
    for (
      var _len = arguments.length, resources = new Array(_len), _key = 0;
      _key < _len;
      _key++
    ) {
      resources[_key] = arguments[_key]
    }

    try {
      var _this4 = this

      return Promise.resolve(_this4._getClient()).then(function (client) {
        var _this4$_worker

        return Promise.resolve(
          (_this4$_worker = _this4._worker) === null ||
            _this4$_worker === void 0
            ? void 0
            : _this4$_worker.withSyncedResources(resources),
        ).then(function () {
          return client
        })
      })
    } catch (e) {
      return Promise.reject(e)
    }
  }

  _createClass(WorkerClient, [
    {
      key: "src",
      get: function get() {
        return this._config.config.src
      },
    },
    {
      key: "timeoutDelay",
      get: function get() {
        return this._config.config.timeoutDelay
      },
    },
    {
      key: "config",
      get: function get() {
        return this._config
      },
    },
    {
      key: "onConfigDidChange",
      get: function get() {
        return this._config.onDidChange
      },
    },
  ])

  return WorkerClient
})() // @ts-ignore

var workers = createPlugin(
  {
    name: "core.workers",
    dependencies: ["core.editors", "core.loader"],
  },
  function (monaco) {
    var _monaco$languages$typ2,
      _monaco$languages$typ3,
      _monaco$languages$typ5,
      _monaco$languages$typ6

    log("[monaco] base worker path:", monaco.loader.workersPath)
    var javascriptClient = {
      getSyncedWorker: function () {
        for (
          var _len = arguments.length, resources = new Array(_len), _key = 0;
          _key < _len;
          _key++
        ) {
          resources[_key] = arguments[_key]
        }

        try {
          var _monaco$languages$typ

          return Promise.resolve(
            (_monaco$languages$typ = monaco.languages.typescript) === null ||
              _monaco$languages$typ === void 0
              ? void 0
              : _monaco$languages$typ.getJavaScriptWorker(),
          ).then(function (getWorker) {
            return Promise.resolve(getWorker.apply(void 0, resources))
          })
        } catch (e) {
          return Promise.reject(e)
        }
      },
      src: monaco.loader.workersPath + "ts.monaco.worker.js",
      // @ts-ignore
      config:
        (_monaco$languages$typ2 =
          (_monaco$languages$typ3 = monaco.languages.typescript) === null ||
          _monaco$languages$typ3 === void 0
            ? void 0
            : _monaco$languages$typ3.javascriptDefaults) !== null &&
        _monaco$languages$typ2 !== void 0
          ? _monaco$languages$typ2
          : {},
    }
    var typescriptClient = {
      getSyncedWorker: function () {
        for (
          var _len2 = arguments.length, resources = new Array(_len2), _key2 = 0;
          _key2 < _len2;
          _key2++
        ) {
          resources[_key2] = arguments[_key2]
        }

        try {
          var _monaco$languages$typ4

          return Promise.resolve(
            (_monaco$languages$typ4 = monaco.languages.typescript) === null ||
              _monaco$languages$typ4 === void 0
              ? void 0
              : _monaco$languages$typ4.getTypeScriptWorker(),
          ).then(function (getWorker) {
            return Promise.resolve(getWorker.apply(void 0, resources))
          })
        } catch (e) {
          return Promise.reject(e)
        }
      },
      src: monaco.loader.workersPath + "ts.monaco.worker.js",
      // @ts-ignore
      config:
        (_monaco$languages$typ5 =
          (_monaco$languages$typ6 = monaco.languages.typescript) === null ||
          _monaco$languages$typ6 === void 0
            ? void 0
            : _monaco$languages$typ6.typescriptDefaults) !== null &&
        _monaco$languages$typ5 !== void 0
          ? _monaco$languages$typ5
          : {},
    }

    var defaultClients = function defaultClients(basePath) {
      return {
        typescript: Object.assign({}, typescriptClient, {
          src: basePath + "ts.monaco.worker.js",
        }),
        javascript: Object.assign({}, javascriptClient, {
          src: basePath + "ts.monaco.worker.js",
        }),
        editorWorkerService: {
          src: basePath + "editor.monaco.worker.js",
        },
        html: {
          src: basePath + "html.monaco.worker.js",
        },
        css: {
          src: basePath + "css.monaco.worker.js",
        },
        json: {
          src: basePath + "json.monaco.worker.js",
        },
      }
    }

    var MonacoWorkerApi = /*#__PURE__*/ (function () {
      function MonacoWorkerApi() {
        var _this = this

        this.workerClients = defaultClients
        this.environment = void 0
        this._workers = {}
        this.workerClients = Object.assign(
          {},
          this.workerClients,
          defaultClients(endingSlash(monaco.loader.workersPath)),
        )
        this.setEnvironment({
          getWorker: function getWorker(label) {
            var workerSrc = _this.workerClients[label].src
            log("[monaco] loading worker: " + label)

            if (typeof workerSrc === "string") {
              var workerBlobURL = createBlobURL(
                'importScripts("' + workerSrc + '")',
              )
              return new Worker(workerBlobURL, {
                name: label,
              })
            } else {
              return workerSrc()
            }
          },
        })
      }

      var _proto = MonacoWorkerApi.prototype

      _proto._registerWorker = function _registerWorker(_ref) {
        var _config$label

        var onRegister = _ref.onRegister,
          config = _objectWithoutPropertiesLoose(_ref, ["onRegister"])
        log("[monaco] registering worker: " + config.label, config)
        var client = new WorkerClient(config, monaco)
        this.workerClients[
          (_config$label = config.label) !== null && _config$label !== void 0
            ? _config$label
            : ""
        ] = client

        if (onRegister) {
          onRegister(client, monaco)
        }

        return client
      }

      _proto.register = function register(config) {
        // if (config.languageId) {
        //   return monaco.languages.onLanguage(config.languageId, () => {
        //     return this._registerWorker(config);
        //   });
        // } else {
        return this._registerWorker(config) // }
      }

      _proto.getClient = function getClient(label) {
        if (!this.workerClients[label]) {
          throw new Error("Worker " + label + " not registered!")
        }

        return this.workerClients[label]
      }

      _proto.getWorker = function getWorker(label) {
        try {
          var _this3$getClient

          var _this3 = this

          for (
            var _len3 = arguments.length,
              uri = new Array(_len3 > 1 ? _len3 - 1 : 0),
              _key3 = 1;
            _key3 < _len3;
            _key3++
          ) {
            uri[_key3 - 1] = arguments[_key3]
          }

          if (uri.length === 0) {
            var _monaco$editor$getFoc, _monaco$editor$getFoc2

            var editorUri =
              (_monaco$editor$getFoc = monaco.editor.getFocusedEditor()) ===
                null || _monaco$editor$getFoc === void 0
                ? void 0
                : (_monaco$editor$getFoc2 = _monaco$editor$getFoc.getModel()) ===
                    null || _monaco$editor$getFoc2 === void 0
                ? void 0
                : _monaco$editor$getFoc2.uri
            editorUri && uri.push(editorUri)
          }

          return Promise.resolve(
            (_this3$getClient = _this3.getClient(label)).getSyncedWorker.apply(
              _this3$getClient,
              uri,
            ),
          )
        } catch (e) {
          return Promise.reject(e)
        }
      }

      _proto.setConfig = function setConfig(label, config) {
        this.getClient(label).config.setConfig(config)
      }

      _proto.updateOptions = function updateOptions(label, options) {
        this.getClient(label).config.setOptions(options)
      }

      _proto.setEnvironment = function setEnvironment(_ref2) {
        var _ref2$getWorkerUrl = _ref2.getWorkerUrl,
          getWorkerUrl =
            _ref2$getWorkerUrl === void 0 ? noop : _ref2$getWorkerUrl,
          _ref2$getWorker = _ref2.getWorker,
          getWorker = _ref2$getWorker === void 0 ? noop : _ref2$getWorker,
          _ref2$baseUrl = _ref2.baseUrl,
          baseUrl = _ref2$baseUrl === void 0 ? undefined : _ref2$baseUrl

        if (baseUrl || getWorker || getWorkerUrl) {
          var getWorkerPath = function getWorkerPath(_moduleId, label) {
            var url =
              getWorkerUrl === null || getWorkerUrl === void 0
                ? void 0
                : getWorkerUrl(label)
            if (url) return url
            return undefined
          } // @ts-ignore

          window.MonacoEnvironment = {
            // baseUrl: baseUrl,
            getWorker: (function (_getWorker3) {
              function getWorker(_x, _x2) {
                return _getWorker3.apply(this, arguments)
              }

              getWorker.toString = function () {
                return _getWorker3.toString()
              }

              return getWorker
            })(function (_moduleId, label) {
              var worker =
                getWorker === null || getWorker === void 0
                  ? void 0
                  : getWorker(label)

              if (worker) {
                return worker
              }

              var url = getWorkerPath(_moduleId, label)

              if (url) {
                return new Worker(url, {
                  name: label,
                })
              }

              return null
            }),
          }
        }

        this.environment = {
          baseUrl: baseUrl,
          getWorker: getWorker,
          getWorkerUrl: getWorkerUrl,
        }
      }

      return MonacoWorkerApi
    })()

    Object.assign(monaco, {
      worker: new MonacoWorkerApi(),
    })
  },
)

function createBlobURL(workerSrc) {
  var workerSrcBlob, workerBlobURL
  workerSrcBlob = new Blob([workerSrc], {
    type: "text/javascript",
  })
  workerBlobURL = window.URL.createObjectURL(workerSrcBlob)
  return workerBlobURL
}

var merge = function merge(target, source) {
  Object.keys(source).forEach(function (key) {
    if (source[key] instanceof Object)
      target[key] && Object.assign(source[key], merge(target[key], source[key]))
  })
  return Object.assign({}, target, source)
}

function cdnPath(root, pkg, version, path) {
  return "" + endingSlash(root) + pkg + "@" + version + path
}

function loadMonaco(options) {
  var _options$monacoVersio = options.monacoVersion,
    monacoVersion =
      _options$monacoVersio === void 0 ? "0.21.2" : _options$monacoVersio,
    _options$monacoCorePk = options.monacoCorePkg,
    monacoCorePkg =
      _options$monacoCorePk === void 0
        ? "monaco-editor-core"
        : _options$monacoCorePk,
    _options$cdn = options.cdn,
    cdn =
      _options$cdn === void 0 ? "https://cdn.jsdelivr.net/npm" : _options$cdn,
    _options$monacoPath = options.monacoPath,
    monacoPath =
      _options$monacoPath === void 0
        ? endingSlash(cdnPath(cdn, monacoCorePkg, monacoVersion, "/"))
        : _options$monacoPath,
    _options$workersPath = options.workersPath,
    workersPath =
      _options$workersPath === void 0
        ? endingSlash(cdnPath(cdn, "use-monaco", version, "/dist/workers/"))
        : _options$workersPath,
    _options$languagesPat = options.languagesPath,
    languagesPath =
      _options$languagesPat === void 0
        ? endingSlash(cdnPath(cdn, "use-monaco", version, "/dist/languages/"))
        : _options$languagesPat,
    _options$plugins = options.plugins,
    plugins = _options$plugins === void 0 ? [] : _options$plugins,
    _options$languages = options.languages,
    languages = _options$languages === void 0 ? [] : _options$languages
  var loaderPlugin = createPlugin(
    {
      name: "core.loader",
    },
    function (monaco) {
      monaco.loader = {
        monacoCorePkg: monacoCorePkg,
        monacoVersion: monacoVersion,
        cdn: cdn,
        monacoPath: endingSlash(monacoPath),
        workersPath: endingSlash(workersPath),
        languagesPath: endingSlash(languagesPath),
        plugins: plugins,
        languages: languages,
      }
    },
  )
  log("[monaco] loading monaco from", monacoPath, "...")
  var cancelable = monacoLoader.init({
    paths: {
      vs: endingSlash(monacoPath) + "min/vs",
    },
  })
  var disposable
  var promise = cancelable
    .then(function (monaco) {
      try {
        var _monaco$plugin

        log("[monaco] loaded monaco")
        monaco = withPlugins(monaco)
        return Promise.resolve(
          (_monaco$plugin = monaco.plugin).install.apply(
            _monaco$plugin,
            [
              loaderPlugin,
              languagesPlugin,
              themes,
              editors,
              shortcuts,
              workers,
            ].concat(plugins, languages),
          ),
        ).then(function (_monaco$plugin$instal) {
          disposable = _monaco$plugin$instal
          return monaco
        })
      } catch (e) {
        return Promise.reject(e)
      }
    })
    ["catch"](function (error) {
      return console.error(
        "An error occurred during initialization of Monaco:",
        error,
      )
    })

  promise.cancel = function () {
    var _cancelable$cancel, _disposable, _disposable$dispose
    ;(_cancelable$cancel = cancelable.cancel) === null ||
    _cancelable$cancel === void 0
      ? void 0
      : _cancelable$cancel.call(cancelable)
    ;(_disposable = disposable) === null || _disposable === void 0
      ? void 0
      : (_disposable$dispose = _disposable.dispose) === null ||
        _disposable$dispose === void 0
      ? void 0
      : _disposable$dispose.call(_disposable)
  }

  return promise
}

var makeCancelable = function makeCancelable(promise) {
  var hasCanceled_ = false
  var wrappedPromise = new Promise(function (resolve, reject) {
    promise.then(function (val) {
      return hasCanceled_
        ? reject("operation is manually canceled")
        : resolve(val)
    })
    promise["catch"](function (error) {
      return reject(error)
    })
  })
  var cancellablePromise = Object.assign(wrappedPromise, {
    cancel: function cancel() {
      return (hasCanceled_ = true)
    },
  })
  return cancellablePromise
}

var MonacoLoader = /*#__PURE__*/ (function () {
  function MonacoLoader() {
    var _this = this

    this.config = void 0
    this.resolve = void 0
    this.reject = void 0

    this.handleMainScriptLoad = function () {
      document.removeEventListener("monaco_init", _this.handleMainScriptLoad)

      _this.resolve(window.monaco)
    }

    this.isInitialized = false
    this.wrapperPromise = new Promise(function (res, rej) {
      _this.resolve = res
      _this.reject = rej
    })
    this.config = {}
  }

  var _proto = MonacoLoader.prototype

  _proto.injectScripts = function injectScripts(script) {
    document.body.appendChild(script)
  }

  _proto.createScript = function createScript(src) {
    var script = document.createElement("script")
    return src && (script.src = src), script
  }

  _proto.createMonacoLoaderScript = function createMonacoLoaderScript(
    mainScript,
  ) {
    var _this2 = this

    var loaderScript = this.createScript(
      noEndingSlash(this.config.paths.vs) + "/loader.js",
    )

    loaderScript.onload = function () {
      return _this2.injectScripts(mainScript)
    }

    loaderScript.onerror = this.reject
    return loaderScript
  }

  _proto.createMainScript = function createMainScript() {
    var mainScript = this.createScript()
    mainScript.innerHTML =
      "\n      require.config(" +
      JSON.stringify(this.config) +
      ");\n      require(['vs/editor/editor.main'], function() {\n        document.dispatchEvent(new Event('monaco_init'));\n      });\n    "
    mainScript.onerror = this.reject
    return mainScript
  }

  _proto.init = function init(config) {
    if (!this.isInitialized) {
      //@ts-ignore
      if (window.monaco && window.monaco.editor) {
        //@ts-ignore
        return new Promise(function (res, rej) {
          return res(window.monaco)
        })
      }

      this.config = merge(this.config, config)
      document.addEventListener("monaco_init", this.handleMainScriptLoad)
      var mainScript = this.createMainScript()
      var loaderScript = this.createMonacoLoaderScript(mainScript)
      this.injectScripts(loaderScript)
    }

    this.isInitialized = true
    return makeCancelable(this.wrapperPromise)
  }

  return MonacoLoader
})()
var monacoLoader = new MonacoLoader()

var knonwLanguageServices = ["typescript", "css", "html", "json"]
var languageServiceAliases = {
  javascript: "typescript",
}
var knownBasicLanguages = [
  "abap",
  "apex",
  "azcli",
  "bat",
  "cameligo",
  "clojure",
  "coffee",
  "cpp",
  "csharp",
  "csp",
  "css",
  "dart",
  "dockerfile",
  "fsharp",
  "go",
  "graphql",
  "handlebars",
  "hcl",
  "html",
  "ini",
  "java",
  "javascript",
  "julia",
  "kotlin",
  "less",
  "lexon",
  "lua",
  "markdown",
  "mips",
  "msdax",
  "mysql",
  "objective-c",
  "pascal",
  "pascaligo",
  "perl",
  "pgsql",
  "php",
  "postiats",
  "powerquery",
  "powershell",
  "pug",
  "python",
  "r",
  "razor",
  "redis",
  "redshift",
  "restructuredtext",
  "ruby",
  "rust",
  "sb",
  "scala",
  "scheme",
  "scss",
  "shell",
  "solidity",
  "sophia",
  "sql",
  "st",
  "swift",
  "systemverilog",
  "tcl",
  "twig",
  "typescript",
  "vb",
  "xml",
  "yaml",
]
var basicLanguages = [].concat(knownBasicLanguages, ["json"])

var basicLanguagePlugins = Object.fromEntries(
  basicLanguages.map(function (lang) {
    return [
      lang,
      createPlugin(
        {
          name: "language." + lang,
        },
        function (monaco) {
          try {
            var _temp6 = function _temp6() {
              function _temp3() {
                var _temp = (function () {
                  if (languageServiceAliases[lang]) {
                    return Promise.resolve(
                      monaco.plugin.install(
                        createRemotePlugin({
                          name:
                            "language." +
                            languageServiceAliases[lang] +
                            ".service",
                          dependencies: [],
                          url:
                            monaco.loader.languagesPath +
                            (languageServiceAliases[lang] + ".service.js"),
                        }),
                      ),
                    ).then(function () {})
                  }
                })()

                if (_temp && _temp.then) return _temp.then(function () {})
              }

              var _temp2 = (function () {
                if (knonwLanguageServices.includes(lang)) {
                  return Promise.resolve(
                    monaco.plugin.install(
                      createRemotePlugin({
                        name: "language." + lang + ".service",
                        dependencies: [],
                        url:
                          monaco.loader.languagesPath + (lang + ".service.js"),
                      }),
                    ),
                  ).then(function () {})
                }
              })()

              return _temp2 && _temp2.then
                ? _temp2.then(_temp3)
                : _temp3(_temp2)
            }

            var _temp7 = (function () {
              if (knownBasicLanguages.includes(lang)) {
                return Promise.resolve(
                  monaco.plugin.install(
                    createRemotePlugin({
                      name: "language." + lang + ".basic",
                      dependencies: [],
                      url: monaco.loader.languagesPath + (lang + ".basic.js"),
                    }),
                  ),
                ).then(function () {})
              }
            })()

            return Promise.resolve(
              _temp7 && _temp7.then ? _temp7.then(_temp6) : _temp6(_temp7),
            )
          } catch (e) {
            return Promise.reject(e)
          }
        },
      ),
    ]
  }),
)

function checkDeps(deps) {
  if (!deps || !deps.length) {
    throw new Error(
      "useDeepCompareEffect should not be used with no dependencies. Use React.useEffect instead.",
    )
  }

  if (deps.every(isPrimitive)) {
    throw new Error(
      "useDeepCompareEffect should not be used with dependencies that are all primitive values. Use React.useEffect instead.",
    )
  }
}

function isPrimitive(val) {
  return val == null || /^[sbn]/.test(typeof val)
}

function useDeepCompareMemoize(value) {
  var ref = React.useRef()
  var signalRef = React.useRef(0)

  if (!dequal.dequal(value, ref.current)) {
    ref.current = value
    signalRef.current += 1
  }

  return [signalRef.current]
}

function useDeepCompareEffect(callback, dependencies, skipDeep) {
  if (skipDeep === void 0) {
    skipDeep = []
  }

  {
    checkDeps(dependencies)
  } // eslint-disable-next-line react-hooks/exhaustive-deps

  return React.useEffect(
    callback,
    [].concat(useDeepCompareMemoize(dependencies), skipDeep),
  )
}

var knownParsers = {
  javascript: "babel",
  typescript: "babel-ts",
  markdown: "markdown",
  graphql: "graphql",
  json: "json",
  mdx: "mdx",
  html: "html",
  angular: "angular",
  vue: "vue",
}
var knownPlugins = {
  babel: ["parser-babel"],
  "babel-ts": ["parser-babel"],
  markdown: ["parser-markdown"],
  graphql: ["parser-graphql"],
  mdx: ["parser-markdown"],
  html: ["parser-html"],
  angular: ["parser-html"],
  vue: ["parser-html"],
  json: ["parser-babel"],
  css: [""],
}
var prettier = function (
  // languages: (
  //   | keyof typeof knownParsers
  //   | { [key: string]: keyof typeof knownPlugins }
  // )[] = Object.keys(knownParsers),
  prettierOptions,
  _temp,
) {
  if (prettierOptions === void 0) {
    prettierOptions = {}
  }

  var _ref = _temp === void 0 ? {} : _temp,
    workerSrc = _ref.workerSrc

  return createPlugin(
    {
      name: "prettier",
      dependencies: ["core.workers"],
    },
    function (monaco) {
      var workerPath =
        workerSrc !== null && workerSrc !== void 0
          ? workerSrc
          : monaco.loader.workersPath + "prettier.monaco.worker.js"
      monaco.plugin.prettier = {
        enable: function enable(languageId, _ref2) {
          if (_ref2 === void 0) {
            _ref2 = prettierOptions
          }

          var _ref3 = _ref2,
            _ref3$parser = _ref3.parser,
            parser =
              _ref3$parser === void 0 ? knownParsers[languageId] : _ref3$parser,
            _ref3$plugins = _ref3.plugins,
            plugins =
              _ref3$plugins === void 0 ? knownPlugins[parser] : _ref3$plugins,
            options = _objectWithoutPropertiesLoose(_ref3, [
              "parser",
              "plugins",
            ])

          return monaco.worker.register({
            languageId: languageId,
            label: "prettier",
            src: workerPath,
            providers: {
              documentFormattingEdit: true,
            },
            options: Object.assign(
              {
                workerSrc: workerPath,
                parser: parser,
                plugins: plugins,
              },
              options,
            ),
          })
        },
      }
      var oldRegister = monaco.languages.register

      monaco.languages.register = function (def) {
        oldRegister(def)

        if (knownParsers[def.id]) {
          monaco.plugin.prettier.enable(def.id, prettierOptions)
        }
      }
    },
  )
}

var graphql = function (config) {
  return createPlugin(
    {
      name: "language.graphql.service",
      dependencies: ["core.workers", "language.graphql"],
    },
    function (monaco) {
      return monaco.worker.register({
        label: "graphql",
        languageId: "graphql",
        options: {
          languageConfig: {
            schemaConfig: config,
          },
        },
        src: monaco.loader.workersPath + "graphql.monaco.worker.js",
        providers: {
          hover: true,
          // will conflict with prettier plugin, do disable this if you are using that
          documentFormattingEdit: !monaco.plugin.isInstalled("prettier"),
          completionItem: true,
          diagnostics: true,
        },
      })
    },
  )
}

var typings = function (compilerOptions) {
  if (compilerOptions === void 0) {
    compilerOptions = {}
  }

  return createPlugin(
    {
      name: "typescript.typings",
      dependencies: ["core.workers", "language.typescript"],
    },
    function (monaco) {
      var extraLibs = new Map()

      if (!monaco.languages.typescript) {
        console.warn(
          "Couldn't install typescript.typings since the typescript worker is not registered",
        )
        return
      }

      var disposable = monaco.worker.register({
        label: "typings",
        src: monaco.loader.workersPath + "typings.monaco.worker.js",
        options: {},
        providers: false,
      })
      monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true)
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)
      var defaultCompilerOptions = Object.assign(
        {
          allowJs: true,
          allowSyntheticDefaultImports: true,
          alwaysStrict: true,
          noLib: false,
          esModuleInterop: true,
          forceConsistentCasingInFileNames: true,
          // isolatedModules: true,
          jsx: monaco.languages.typescript.JsxEmit.React,
          module: monaco.languages.typescript.ModuleKind.ESNext,
          moduleResolution:
            monaco.languages.typescript.ModuleResolutionKind.NodeJs,
          noEmit: true,
          lib: ["dom", "dom.iterable", "esnext"],
          resolveJsonModule: true,
          strict: false,
          target: monaco.languages.typescript.ScriptTarget.ESNext,
        },
        compilerOptions,
      )
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions(
        defaultCompilerOptions,
      )
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions(
        defaultCompilerOptions,
      )
      var _imports = ["// stub\n      import * as useMonaco from 'use-monaco'"]
      var _globalExports = []

      var resetGlobal = function resetGlobal() {
        var code =
          _imports.join("\n") +
          "\n\n\n          declare global {\n            " +
          _globalExports.join("\n") +
          "\n          }"
        log("[typings] setting global.d.ts", {
          code: code,
        })
        var extraLib = extraLibs.get("global.d.ts")
        extraLib && extraLib.dispose() // const currentLib = api.languages.typescript.javascriptDefaults.getExtraLibs();
        // log(currentLib);

        var lib1 = monaco.languages.typescript.typescriptDefaults.addExtraLib(
          code,
          "file:///global.d.ts",
        )
        var lib2 = monaco.languages.typescript.javascriptDefaults.addExtraLib(
          code,
          "file:///global.d.ts",
        )
        extraLibs.set("global.d.ts", {
          dispose: function dispose() {
            lib1.dispose()
            lib2.dispose()
          },
        })
      }

      Object.assign(monaco.languages.typescript, {
        loadTypes: function (name, version) {
          try {
            return Promise.resolve(monaco.worker.getWorker("typings")).then(
              function (worker) {
                return Promise.resolve(worker.fetchTypings(name, version)).then(
                  function (_ref) {
                    var typings = _ref.typings
                    Object.keys(typings).forEach(function (path) {
                      var extraLib = extraLibs.get(path)
                      extraLib && extraLib.dispose()
                      var extraLib1 = monaco.languages.typescript.typescriptDefaults.addExtraLib(
                        typings[path],
                        "file:///" + path,
                      )
                      var extraLib2 = monaco.languages.typescript.javascriptDefaults.addExtraLib(
                        typings[path],
                        "file:///" + path,
                      )
                      extraLibs.set(path, {
                        dispose: function dispose() {
                          extraLib1.dispose()
                          extraLib2.dispose()
                        },
                      })
                    })
                    return typings
                  },
                )
              },
            )
          } catch (e) {
            return Promise.reject(e)
          }
        },
        // exposeGlobalFromPackage: (
        //   pkg: string,
        //   imported: string,
        //   exported: string
        // ) => {
        //   const pkgName = pkg
        //     .replace('-', '')
        //     .replace('@', '')
        //     .replace('/', '');
        //   log(
        //     `[typings] exposing global: ${imported} from ${pkg} as ${exported}`
        //   );
        //    if (!_imports.find(i => i === `import * as ${pkgName} from "${pkg}";`)) {
        //       _imports.push(`import * as ${pkgName} from "${pkg}";`);
        //    };
        //   _globalExports.push(
        //     `export const ${exported}: typeof ${pkgName}.${imported}`
        //   );
        //   resetGlobal();
        // },
        exposeGlobal: function exposeGlobal(imports, exportStmts) {
          _imports = [].concat(_imports, [imports])
          _globalExports = [].concat(_globalExports, [exportStmts])
          resetGlobal()
        }, // addGlobalFromPackage: addGlobal,
      })
      resetGlobal()
      return disposable
    },
  )
}

/* eslint-disable */

/**
 * Version of 'object' from 'dot-object' that doesn't mutate the existing variable.
 * It converts eg.
 *
 * ```js
 * { 'activityBar.background': '#ddd' }
 * to
 * { activityBar: {background: '#ddd' } }
 */

function object(obj) {
  return dot.object(JSON.parse(JSON.stringify(obj)))
}

// TAILWIND CSS COLORS
var bg = {
  50: "#f8fafc",
  100: "#f1f5f9",
  200: "#e2e8f0",
  300: "#cbd5e1",
  400: "#94a3b8",
  500: "#64748b",
  600: "#475569",
  700: "#334155",
  800: "#1e293b",
  900: "#0f172a",
}
var colors = {
  black: "#000",
  white: "#fff",
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
  },
  lightBlue: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
  },
  warmGray: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
  },
  trueGray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
  gray: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
  },
  coolGray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
  },
  blueGray: bg,
}

/*
  we use dot to convert objects to vscode dot notation

  the object style is better authoring experience, it helps
  organizing the file better, let's us lint the file and find
  duplicates / clashingstyles.
*/

var colors$1 = {
  contrastBorder: colors.blueGray[600],
  contrastActiveBorder: null,
  errorForeground: colors.red[500],
  focusBorder: colors.blueGray[600],
  foreground: colors.blueGray[200],
  activityBar: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
  },
  activityBarBadge: {
    background: colors.blueGray[500],
  },
  button: {
    background: colors.blue[600],
    foreground: colors.white,
    border: colors.blue[600],
  },
  dropdown: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
    foreground: colors.white,
  },
  editor: {
    background: colors.blueGray[700],
    foreground: colors.blueGray[300],
    hoverHighlightBackground: colors.blueGray[500],
    inactiveSelectionBackground: colors.blueGray[500],
    lineHighlightBackground: colors.blueGray[600],
    lineHighlightBorder: colors.blueGray[600],
    rangeHighlightBackground: colors.blueGray[600],
    selectionBackground: colors.blue[500] + "33",
    // 20% opacity
    selectionHighlightBackground: colors.blueGray[600],
    wordHighlightStrongBackground: colors.blueGray[600],
    wordHighlightBackground: colors.blueGray[600],
  },
  editorBracketMatch: {
    background: colors.blueGray[600],
  },
  editorCodeLens: {
    foreground: colors.blueGray[600],
  },
  editorCursor: {
    background: colors.blueGray[700],
    foreground: colors.white,
  },
  editorError: {
    border: colors.blueGray[600],
    foreground: colors.red[500],
  },
  editorGroup: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
    dropBackground: colors.blue[500] + "1a",
  },
  editorGroupHeader: {
    noTabsBackground: null,
    tabsBackground: colors.blueGray[700],
    tabsBorder: colors.blueGray[600],
  },
  editorGutter: {
    background: colors.blueGray[700],
    deletedBackground: colors.red[500],
    modifiedBackground: colors.blueGray[700],
  },
  editorHoverWidget: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
  },
  editorIndentGuide: {
    background: colors.blueGray[700],
  },
  editorLink: {
    activeForeground: colors.blueGray[300],
  },
  editorLineNumber: {
    foreground: colors.blueGray[600],
    activeForeground: colors.blueGray[400],
  },
  editorRuler: {
    foreground: colors.white,
  },
  editorMarkerNavigation: {
    background: colors.blueGray[700],
  },
  editorMarkerNavigationWarning: {
    background: colors.blueGray[600],
  },
  editorMarkerNavigationError: {
    background: colors.blueGray[700],
  },
  editorOverviewRuler: {
    border: colors.blueGray[600],
    commonContentForeground: colors.blueGray[600],
    currentContentForeground: colors.red[500],
    incomingContentForeground: colors.green,
  },
  editorSuggestWidget: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
    foreground: colors.blueGray[300],
    selectedBackground: colors.blueGray[600],
  },
  editorWarning: {
    border: colors.blueGray[600],
    foreground: colors.red[300],
  },
  editorWhitespace: {
    foreground: colors.blueGray[500],
  },
  editorWidget: {
    background: colors.blueGray[700],
    border: colors.blueGray[600],
  },
  extensionButton: {
    prominentBackground: colors.blueGray[600],
    prominentForeground: colors.white,
    prominentHoverBackground: colors.blueGray[600],
  },
  input: {
    background: colors.blueGray[600],
    foreground: colors.white,
    border: colors.blueGray[900],
    placeholderForeground: colors.blueGray[300],
  },
  inputOption: {
    activeBorder: colors.blueGray[500],
  },
  inputValidation: {
    infoForeground: null,
    infoBackground: null,
    infoBorder: colors.purple,
    warningForeground: null,
    warningBackground: null,
    warningBorder: colors.yellow,
    errorForeground: null,
    errorBackground: null,
    errorBorder: colors.red[500],
  },
  list: {
    dropBackground: colors.blueGray[700],
    highlightForeground: colors.blue[300],
    hoverBackground: colors.blueGray[600],
    focusBackground: colors.blueGray[600],
    activeSelectionBackground: colors.blueGray[600],
    activeSelectionForeground: colors.white,
    inactiveSelectionBackground: colors.blueGray[600],
    inactiveSelectionForeground: colors.white,
    warningForeground: colors.yellow,
    errorForeground: colors.red[500],
    hoverForeground: null,
    focusForeground: null,
  },
  menu: {
    background: colors.blueGray[700],
    selectionBackground: colors.blueGray[600],
  },
  peekView: {
    border: colors.blueGray[500],
  },
  peekViewEditor: {
    background: colors.blueGray[600],
    matchHighlightBackground: colors.blue[500] + "33", // 20% opacity
  },
  peekViewEditorGutter: {
    background: null,
  },
  peekViewResult: {
    background: colors.blueGray[600],
    fileForeground: colors.white,
    lineForeground: colors.white,
    matchHighlightBackground: colors.blue[500] + "33",
    // 20% opacity,
    selectionBackground: colors.blueGray[600],
    selectionForeground: colors.white,
  },
  peekViewTitle: {
    background: colors.blueGray[600],
  },
  peekViewTitleDescription: {
    foreground: colors.blue[700],
  },
  peekViewTitleLabel: {
    foreground: colors.white,
  },
  scrollbarSlider: {
    activeBackground: colors.white,
    border: colors.blueGray[600],
    background: null,
    hoverBackground: null,
  },
  selection: {
    background: colors.blue[500] + "40", // 25% opacity
  },
  separator: {
    background: colors.blueGray[900],
    foreground: colors.white,
  },
  sideBar: {
    background: colors.blueGray[700],
    hoverBackground: colors.blueGray[600],
    border: colors.blueGray[600],
    foreground: colors.blueGray[200],
  },
  sideBarSectionHeader: {
    background: colors.blueGray[700],
    foreground: colors.white,
    border: colors.blueGray[600],
  },
  sideBarTitle: {
    foreground: colors.white,
  },
  statusBar: {
    background: colors.blueGray[600],
    foreground: colors.white,
    debuggingBackground: colors.red[500],
    debuggingForeground: colors.blueGray[600],
    noFolderBackground: colors.blueGray[600],
    noFolderForeground: colors.white,
    border: colors.blueGray[600],
  },
  statusBarItem: {
    activeBackground: null,
    hoverBackground: null,
    prominentBackground: colors.red[500],
    prominentHoverBackground: colors.yellow,
    remoteForeground: colors.blueGray[100],
    remoteBackground: colors.purple,
  },
  tab: {
    activeBackground: colors.blueGray[700],
    activeForeground: colors.white,
    border: colors.blueGray[600],
    activeBorder: colors.blue[300],
    unfocusedActiveBorder: null,
    inactiveBackground: colors.blueGray[700],
    inactiveForeground: colors.blueGray[400],
    unfocusedActiveForeground: colors.white,
    unfocusedInactiveForeground: colors.blueGray[400],
  },
  terminal: {
    background: colors.blueGray[700],
    foreground: colors.white,
    ansiBrightBlack: colors.blue[700],
    ansiBrightRed: colors.red[500],
    ansiBrightGreen: colors.green,
    ansiBrightYellow: colors.yellow,
    ansiBlack: colors.blueGray[600],
    ansiRed: colors.red[500],
    ansiGreen: colors.green,
    ansiYellow: colors.yellow,
    ansiBlue: colors.blue[700],
    ansiMagenta: colors.purple,
    ansiCyan: colors.blue[300],
    ansiWhite: colors.white,
  },
  titleBar: {
    background: colors.blueGray[700],
    activeBackground: colors.blueGray[700],
    activeForeground: colors.white,
    border: colors.blueGray[600],
    inactiveBackground: colors.blueGray[700],
    inactiveForeground: colors.blueGray[300],
  },
}
var theme = {
  name: "CodeSandbox Black",
  type: "dark",
  // convert to vscode style flat dot notation
  colors: dot__default["default"].dot(colors$1),
  tokenColors: [
    {
      name: "Comment",
      scope: ["comment"],
      settings: {
        foreground: "#5C6370",
        fontStyle: "italic",
      },
    },
    {
      name: "Comment Markup Link",
      scope: ["comment markup.link"],
      settings: {
        foreground: "#5C6370",
      },
    },
    {
      name: "Entity Name Type",
      scope: ["entity.name.type"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Entity Other Inherited Class",
      scope: ["entity.other.inherited-class"],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "Keyword",
      scope: ["keyword"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Keyword Control",
      scope: ["keyword.control"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Keyword Operator",
      scope: ["keyword.operator"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Keyword Other Special Method",
      scope: ["keyword.other.special-method"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Keyword Other Unit",
      scope: ["keyword.other.unit"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Storage",
      scope: ["storage"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Storage Type Annotation,storage Type Primitive",
      scope: ["storage.type.annotation", "storage.type.primitive"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Storage Modifier Package,storage Modifier Import",
      scope: ["storage.modifier.package", "storage.modifier.import"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Constant",
      scope: ["constant"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Constant Variable",
      scope: ["constant.variable"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Constant Character Escape",
      scope: ["constant.character.escape"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Constant Numeric",
      scope: ["constant.numeric"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Constant Other Color",
      scope: ["constant.other.color"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Constant Other Symbol",
      scope: ["constant.other.symbol"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Variable",
      scope: ["variable"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Variable Interpolation",
      scope: ["variable.interpolation"],
      settings: {
        foreground: "#BE5046",
      },
    },
    {
      name: "Variable Parameter",
      scope: ["variable.parameter"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "String",
      scope: ["string"],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "String Regexp",
      scope: ["string.regexp"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "String Regexp Source Ruby Embedded",
      scope: ["string.regexp source.ruby.embedded"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "String Other Link",
      scope: ["string.other.link"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Punctuation Definition Comment",
      scope: ["punctuation.definition.comment"],
      settings: {
        foreground: "#5C6370",
      },
    },
    {
      name:
        "Punctuation Definition Method Parameters,punctuation Definition Function Parameters,punctuation Definition Parameters,punctuation Definition Separator,punctuation Definition Seperator,punctuation Definition Array",
      scope: [
        "punctuation.definition.method-parameters",
        "punctuation.definition.function-parameters",
        "punctuation.definition.parameters",
        "punctuation.definition.separator",
        "punctuation.definition.seperator",
        "punctuation.definition.array",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Punctuation Definition Heading,punctuation Definition Identity",
      scope: [
        "punctuation.definition.heading",
        "punctuation.definition.identity",
      ],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Punctuation Definition Bold",
      scope: ["punctuation.definition.bold"],
      settings: {
        foreground: "#E5C07B",
        fontStyle: "bold",
      },
    },
    {
      name: "Punctuation Definition Italic",
      scope: ["punctuation.definition.italic"],
      settings: {
        foreground: "#C678DD",
        fontStyle: "italic",
      },
    },
    {
      name: "Punctuation Section Embedded",
      scope: ["punctuation.section.embedded"],
      settings: {
        foreground: "#BE5046",
      },
    },
    {
      name:
        "Punctuation Section Method,punctuation Section Class,punctuation Section Inner Class",
      scope: [
        "punctuation.section.method",
        "punctuation.section.class",
        "punctuation.section.inner-class",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Support Class",
      scope: ["support.class"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Support Type",
      scope: ["support.type"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Support Function",
      scope: ["support.function"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Support Function Any Method",
      scope: ["support.function.any-method"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Entity Name Function",
      scope: ["entity.name.function"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Entity Name Class,entity Name Type Class",
      scope: ["entity.name.class", "entity.name.type.class"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Entity Name Section",
      scope: ["entity.name.section"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Entity Name Tag",
      scope: ["entity.name.tag"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Entity Other Attribute Name",
      scope: ["entity.other.attribute-name"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Entity Other Attribute Name Id",
      scope: ["entity.other.attribute-name.id"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Meta Class",
      scope: ["meta.class"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Meta Class Body",
      scope: ["meta.class.body"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Meta Method Call,meta Method",
      scope: ["meta.method-call", "meta.method"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Meta Definition Variable",
      scope: ["meta.definition.variable"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Meta Link",
      scope: ["meta.link"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Meta Require",
      scope: ["meta.require"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Meta Selector",
      scope: ["meta.selector"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Meta Separator",
      scope: ["meta.separator"],
      settings: {
        background: "#373B41",
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Meta Tag",
      scope: ["meta.tag"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Underline",
      scope: ["underline"],
      settings: {
        "text-decoration": "underline",
      },
    },
    {
      name: "None",
      scope: ["none"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Invalid Deprecated",
      scope: ["invalid.deprecated"],
      settings: {
        foreground: "#523D14",
        background: "#E0C285",
      },
    },
    {
      name: "Invalid Illegal",
      scope: ["invalid.illegal"],
      settings: {
        foreground: "white",
        background: "#E05252",
      },
    },
    {
      name: "Markup Bold",
      scope: ["markup.bold"],
      settings: {
        foreground: "#D19A66",
        fontStyle: "bold",
      },
    },
    {
      name: "Markup Changed",
      scope: ["markup.changed"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Markup Deleted",
      scope: ["markup.deleted"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Markup Italic",
      scope: ["markup.italic"],
      settings: {
        foreground: "#C678DD",
        fontStyle: "italic",
      },
    },
    {
      name: "Markup Heading",
      scope: ["markup.heading"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Markup Heading Punctuation Definition Heading",
      scope: ["markup.heading punctuation.definition.heading"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Markup Link",
      scope: ["markup.link"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Markup Inserted",
      scope: ["markup.inserted"],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "Markup Quote",
      scope: ["markup.quote"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Markup Raw",
      scope: ["markup.raw"],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "Source C Keyword Operator",
      scope: ["source.c keyword.operator"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Cpp Keyword Operator",
      scope: ["source.cpp keyword.operator"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Cs Keyword Operator",
      scope: ["source.cs keyword.operator"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Css Property Name,source Css Property Value",
      scope: ["source.css property-name", "source.css property-value"],
      settings: {
        foreground: "#828997",
      },
    },
    {
      name:
        "Source Css Property Name Support,source Css Property Value Support",
      scope: [
        "source.css property-name.support",
        "source.css property-value.support",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Source Gfm Markup",
      scope: ["source.gfm markup"],
      settings: {
        "-webkit-font-smoothing": "auto",
      },
    },
    {
      name: "Source Gfm Link Entity",
      scope: ["source.gfm link entity"],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "Source Go Storage Type String",
      scope: ["source.go storage.type.string"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Ini Keyword Other Definition Ini",
      scope: ["source.ini keyword.other.definition.ini"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Source Java Storage Modifier Import",
      scope: ["source.java storage.modifier.import"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Source Java Storage Type",
      scope: ["source.java storage.type"],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "Source Java Keyword Operator Instanceof",
      scope: ["source.java keyword.operator.instanceof"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Java Properties Meta Key Pair",
      scope: ["source.java-properties meta.key-pair"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "Source Java Properties Meta Key Pair > Punctuation",
      scope: ["source.java-properties meta.key-pair > punctuation"],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "Source Js Keyword Operator",
      scope: ["source.js keyword.operator"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name:
        "Source Js Keyword Operator Delete,source Js Keyword Operator In,source Js Keyword Operator Of,source Js Keyword Operator Instanceof,source Js Keyword Operator New,source Js Keyword Operator Typeof,source Js Keyword Operator Void",
      scope: [
        "source.js keyword.operator.delete",
        "source.js keyword.operator.in",
        "source.js keyword.operator.of",
        "source.js keyword.operator.instanceof",
        "source.js keyword.operator.new",
        "source.js keyword.operator.typeof",
        "source.js keyword.operator.void",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Json Meta Structure Dictionary Json > String Quoted Json",
      scope: [
        "source.json meta.structure.dictionary.json > string.quoted.json",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name:
        "Source Json Meta Structure Dictionary Json > String Quoted Json > Punctuation String",
      scope: [
        "source.json meta.structure.dictionary.json > string.quoted.json > punctuation.string",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name:
        "Source Json Meta Structure Dictionary Json > Value Json > String Quoted Json,source Json Meta Structure Array Json > Value Json > String Quoted Json,source Json Meta Structure Dictionary Json > Value Json > String Quoted Json > Punctuation,source Json Meta Structure Array Json > Value Json > String Quoted Json > Punctuation",
      scope: [
        "source.json meta.structure.dictionary.json > value.json > string.quoted.json",
        "source.json meta.structure.array.json > value.json > string.quoted.json",
        "source.json meta.structure.dictionary.json > value.json > string.quoted.json > punctuation",
        "source.json meta.structure.array.json > value.json > string.quoted.json > punctuation",
      ],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name:
        "Source Json Meta Structure Dictionary Json > Constant Language Json,source Json Meta Structure Array Json > Constant Language Json",
      scope: [
        "source.json meta.structure.dictionary.json > constant.language.json",
        "source.json meta.structure.array.json > constant.language.json",
      ],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "Source Ruby Constant Other Symbol > Punctuation",
      scope: ["source.ruby constant.other.symbol > punctuation"],
      settings: {
        foreground: "inherit",
      },
    },
    {
      name: "Source Python Keyword Operator Logical Python",
      scope: ["source.python keyword.operator.logical.python"],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "Source Python Variable Parameter",
      scope: ["source.python variable.parameter"],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "Meta Attribute Rust",
      scope: ["meta.attribute.rust"],
      settings: {
        foreground: "#BCC199",
      },
    },
    {
      name: "Storage Modifier Lifetime Rust,entity Name Lifetime Rust",
      scope: ["storage.modifier.lifetime.rust", "entity.name.lifetime.rust"],
      settings: {
        foreground: "#33E8EC",
      },
    },
    {
      name: "Keyword Unsafe Rust",
      scope: ["keyword.unsafe.rust"],
      settings: {
        foreground: "#CC6B73",
      },
    },
    {
      name: "customrule",
      scope: "customrule",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Support Type Property Name",
      scope: "support.type.property-name",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Punctuation for Quoted String",
      scope: "string.quoted.double punctuation",
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Support Constant",
      scope: "support.constant",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSON Property Name",
      scope: "support.type.property-name.json",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSON Punctuation for Property Name",
      scope: "support.type.property-name.json punctuation",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation for key-value",
      scope: [
        "punctuation.separator.key-value.ts",
        "punctuation.separator.key-value.js",
        "punctuation.separator.key-value.tsx",
      ],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Embedded Operator",
      scope: [
        "source.js.embedded.html keyword.operator",
        "source.ts.embedded.html keyword.operator",
      ],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Variable Other Readwrite",
      scope: [
        "variable.other.readwrite.js",
        "variable.other.readwrite.ts",
        "variable.other.readwrite.tsx",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Support Variable Dom",
      scope: ["support.variable.dom.js", "support.variable.dom.ts"],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Support Variable Property Dom",
      scope: [
        "support.variable.property.dom.js",
        "support.variable.property.dom.ts",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Interpolation String Punctuation",
      scope: [
        "meta.template.expression.js punctuation.definition",
        "meta.template.expression.ts punctuation.definition",
      ],
      settings: {
        foreground: "#BE5046",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation Type Parameters",
      scope: [
        "source.ts punctuation.definition.typeparameters",
        "source.js punctuation.definition.typeparameters",
        "source.tsx punctuation.definition.typeparameters",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Definition Block",
      scope: [
        "source.ts punctuation.definition.block",
        "source.js punctuation.definition.block",
        "source.tsx punctuation.definition.block",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation Separator Comma",
      scope: [
        "source.ts punctuation.separator.comma",
        "source.js punctuation.separator.comma",
        "source.tsx punctuation.separator.comma",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Variable Property",
      scope: [
        "support.variable.property.js",
        "support.variable.property.ts",
        "support.variable.property.tsx",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Default Keyword",
      scope: [
        "keyword.control.default.js",
        "keyword.control.default.ts",
        "keyword.control.default.tsx",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Instanceof Keyword",
      scope: [
        "keyword.operator.expression.instanceof.js",
        "keyword.operator.expression.instanceof.ts",
        "keyword.operator.expression.instanceof.tsx",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Of Keyword",
      scope: [
        "keyword.operator.expression.of.js",
        "keyword.operator.expression.of.ts",
        "keyword.operator.expression.of.tsx",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Braces/Brackets",
      scope: [
        "meta.brace.round.js",
        "meta.array-binding-pattern-variable.js",
        "meta.brace.square.js",
        "meta.brace.round.ts",
        "meta.array-binding-pattern-variable.ts",
        "meta.brace.square.ts",
        "meta.brace.round.tsx",
        "meta.array-binding-pattern-variable.tsx",
        "meta.brace.square.tsx",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation Accessor",
      scope: [
        "source.js punctuation.accessor",
        "source.ts punctuation.accessor",
        "source.tsx punctuation.accessor",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation Terminator Statement",
      scope: [
        "punctuation.terminator.statement.js",
        "punctuation.terminator.statement.ts",
        "punctuation.terminator.statement.tsx",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Array variables",
      scope: [
        "meta.array-binding-pattern-variable.js variable.other.readwrite.js",
        "meta.array-binding-pattern-variable.ts variable.other.readwrite.ts",
        "meta.array-binding-pattern-variable.tsx variable.other.readwrite.tsx",
      ],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Support Variables",
      scope: [
        "source.js support.variable",
        "source.ts support.variable",
        "source.tsx support.variable",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Support Variables",
      scope: [
        "variable.other.constant.property.js",
        "variable.other.constant.property.ts",
        "variable.other.constant.property.tsx",
      ],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Keyword New",
      scope: [
        "keyword.operator.new.ts",
        "keyword.operator.new.j",
        "keyword.operator.new.tsx",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] TS Keyword Operator",
      scope: ["source.ts keyword.operator", "source.tsx keyword.operator"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Punctuation Parameter Separator",
      scope: [
        "punctuation.separator.parameter.js",
        "punctuation.separator.parameter.ts",
        "punctuation.separator.parameter.tsx ",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Import",
      scope: [
        "constant.language.import-export-all.js",
        "constant.language.import-export-all.ts",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSX/TSX Import",
      scope: [
        "constant.language.import-export-all.jsx",
        "constant.language.import-export-all.tsx",
      ],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Keyword Control As",
      scope: [
        "keyword.control.as.js",
        "keyword.control.as.ts",
        "keyword.control.as.jsx",
        "keyword.control.as.tsx",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Variable Alias",
      scope: [
        "variable.other.readwrite.alias.js",
        "variable.other.readwrite.alias.ts",
        "variable.other.readwrite.alias.jsx",
        "variable.other.readwrite.alias.tsx",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Constants",
      scope: [
        "variable.other.constant.js",
        "variable.other.constant.ts",
        "variable.other.constant.jsx",
        "variable.other.constant.tsx",
      ],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Export Variable",
      scope: [
        "meta.export.default.js variable.other.readwrite.js",
        "meta.export.default.ts variable.other.readwrite.ts",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Template Strings Punctuation Accessor",
      scope: [
        "source.js meta.template.expression.js punctuation.accessor",
        "source.ts meta.template.expression.ts punctuation.accessor",
        "source.tsx meta.template.expression.tsx punctuation.accessor",
      ],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Import equals",
      scope: [
        "source.js meta.import-equals.external.js keyword.operator",
        "source.jsx meta.import-equals.external.jsx keyword.operator",
        "source.ts meta.import-equals.external.ts keyword.operator",
        "source.tsx meta.import-equals.external.tsx keyword.operator",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Type Module",
      scope:
        "entity.name.type.module.js,entity.name.type.module.ts,entity.name.type.module.jsx,entity.name.type.module.tsx",
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Meta Class",
      scope: "meta.class.js,meta.class.ts,meta.class.jsx,meta.class.tsx",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Property Definition Variable",
      scope: [
        "meta.definition.property.js variable",
        "meta.definition.property.ts variable",
        "meta.definition.property.jsx variable",
        "meta.definition.property.tsx variable",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Meta Type Parameters Type",
      scope: [
        "meta.type.parameters.js support.type",
        "meta.type.parameters.jsx support.type",
        "meta.type.parameters.ts support.type",
        "meta.type.parameters.tsx support.type",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Meta Tag Keyword Operator",
      scope: [
        "source.js meta.tag.js keyword.operator",
        "source.jsx meta.tag.jsx keyword.operator",
        "source.ts meta.tag.ts keyword.operator",
        "source.tsx meta.tag.tsx keyword.operator",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Meta Tag Punctuation",
      scope: [
        "meta.tag.js punctuation.section.embedded",
        "meta.tag.jsx punctuation.section.embedded",
        "meta.tag.ts punctuation.section.embedded",
        "meta.tag.tsx punctuation.section.embedded",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Meta Array Literal Variable",
      scope: [
        "meta.array.literal.js variable",
        "meta.array.literal.jsx variable",
        "meta.array.literal.ts variable",
        "meta.array.literal.tsx variable",
      ],
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Module Exports",
      scope: [
        "support.type.object.module.js",
        "support.type.object.module.jsx",
        "support.type.object.module.ts",
        "support.type.object.module.tsx",
      ],
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JSON Constants",
      scope: ["constant.language.json"],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Object Constants",
      scope: [
        "variable.other.constant.object.js",
        "variable.other.constant.object.jsx",
        "variable.other.constant.object.ts",
        "variable.other.constant.object.tsx",
      ],
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Properties Keyword",
      scope: [
        "storage.type.property.js",
        "storage.type.property.jsx",
        "storage.type.property.ts",
        "storage.type.property.tsx",
      ],
      settings: {
        foreground: "#56B6C2",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Single Quote Inside Templated String",
      scope: [
        "meta.template.expression.js string.quoted punctuation.definition",
        "meta.template.expression.jsx string.quoted punctuation.definition",
        "meta.template.expression.ts string.quoted punctuation.definition",
        "meta.template.expression.tsx string.quoted punctuation.definition",
      ],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS Backtick inside Templated String",
      scope: [
        "meta.template.expression.js string.template punctuation.definition.string.template",
        "meta.template.expression.jsx string.template punctuation.definition.string.template",
        "meta.template.expression.ts string.template punctuation.definition.string.template",
        "meta.template.expression.tsx string.template punctuation.definition.string.template",
      ],
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] JS/TS In Keyword for Loops",
      scope: [
        "keyword.operator.expression.in.js",
        "keyword.operator.expression.in.jsx",
        "keyword.operator.expression.in.ts",
        "keyword.operator.expression.in.tsx",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Constants Other",
      scope: "source.python constant.other",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Constants",
      scope: "source.python constant",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Placeholder Character",
      scope: "constant.character.format.placeholder.other.python storage",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Magic",
      scope: "support.variable.magic.python",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Meta Function Parameters",
      scope: "meta.function.parameters.python",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Function Separator Annotation",
      scope: "punctuation.separator.annotation.python",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Python Function Separator Punctuation",
      scope: "punctuation.separator.parameters.python",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Fields",
      scope: "entity.name.variable.field.cs",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Keyword Operators",
      scope: "source.cs keyword.operator",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Variables",
      scope: "variable.other.readwrite.cs",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Variables Other",
      scope: "variable.other.object.cs",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Property Other",
      scope: "variable.other.object.property.cs",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Property",
      scope: "entity.name.variable.property.cs",
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] CSharp Storage Type",
      scope: "storage.type.cs",
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Rust Unsafe Keyword",
      scope: "keyword.other.unsafe.rust",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Raw Block",
      scope: "markup.raw.block.markdown",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Shell Variables Punctuation Definition",
      scope: "punctuation.definition.variable.shell",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Css Support Constant Value",
      scope: "support.constant.property-value.css",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Css Punctuation Definition Constant",
      scope: "punctuation.definition.constant.css",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Sass Punctuation for key-value",
      scope: "punctuation.separator.key-value.scss",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Sass Punctuation for constants",
      scope: "punctuation.definition.constant.scss",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Sass Punctuation for key-value",
      scope: "meta.property-list.scss punctuation.separator.key-value.scss",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Java Storage Type Primitive Array",
      scope: "storage.type.primitive.array.java",
      settings: {
        foreground: "#E5C07B",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown headings",
      scope: "entity.name.section.markdown",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown heading Punctuation Definition",
      scope: "punctuation.definition.heading.markdown",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown heading setext",
      scope: "markup.heading.setext",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Bold",
      scope: "punctuation.definition.bold.markdown",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Inline Raw",
      scope: "markup.inline.raw.markdown",
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown List Punctuation Definition",
      scope: "beginning.punctuation.definition.list.markdown",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Quote",
      scope: "markup.quote.markdown",
      settings: {
        foreground: "#5C6370",
        fontStyle: "italic",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition String",
      scope: [
        "punctuation.definition.string.begin.markdown",
        "punctuation.definition.string.end.markdown",
        "punctuation.definition.metadata.markdown",
      ],
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Punctuation Definition Link",
      scope: "punctuation.definition.metadata.markdown",
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Underline Link/Image",
      scope: [
        "markup.underline.link.markdown",
        "markup.underline.link.image.markdown",
      ],
      settings: {
        foreground: "#C678DD",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Markdown Link Title/Description",
      scope: [
        "string.other.link.title.markdown",
        "string.other.link.description.markdown",
      ],
      settings: {
        foreground: "#61AFEF",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Ruby Punctuation Separator Variable",
      scope: "punctuation.separator.variable.ruby",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Ruby Other Constant Variable",
      scope: "variable.other.constant.ruby",
      settings: {
        foreground: "#D19A66",
      },
    },
    {
      name: "[VSCODE-CUSTOM] Ruby Keyword Operator Other",
      scope: "keyword.operator.other.ruby",
      settings: {
        foreground: "#98C379",
      },
    },
    {
      name: "[VSCODE-CUSTOM] PHP Punctuation Variable Definition",
      scope: "punctuation.definition.variable.php",
      settings: {
        foreground: "#E06C75",
      },
    },
    {
      name: "[VSCODE-CUSTOM] PHP Meta Class",
      scope: "meta.class.php",
      settings: {
        foreground: "#ABB2BF",
      },
    },
    {
      scope: "token.info-token",
      settings: {
        foreground: "#6796e6",
      },
    },
    {
      scope: "token.warn-token",
      settings: {
        foreground: "#cd9731",
      },
    },
    {
      scope: "token.error-token",
      settings: {
        foreground: "#f44747",
      },
    },
    {
      scope: "token.debug-token",
      settings: {
        foreground: "#b267e6",
      },
    },
  ],
}

var name = "CodeSandbox Light"
var type = "light"
var colors$2 = {
  "activityBarBadge.background": "#007acc",
  "editor.background": "#ffffff",
  "editor.foreground": "#040404",
  "editor.inactiveSelectionBackground": "#e5ebf1",
  "editor.selectionHighlightBackground": "#add6ff4d",
  "editorIndentGuide.activeBackground": "#939393",
  "editorIndentGuide.background": "#d3d3d3",
  "editorSuggestWidget.background": "#f3f3f3",
  "input.placeholderForeground": "#adadad",
  "list.hoverBackground": "#e8e8e8",
  "activityBar.background": "#2c2c2c",
  "activityBar.dropBackground": "#ffffff1f",
  "activityBar.foreground": "#ffffff",
  "activityBarBadge.foreground": "#ffffff",
  "badge.background": "#bebebe",
  "badge.foreground": "#ffffff",
  "button.background": "#007acc",
  "button.foreground": "#ffffff",
  "button.hoverBackground": "#0062a3",
  "debugExceptionWidget.background": "#f1dfde",
  "debugExceptionWidget.border": "#a31515",
  "debugToolBar.background": "#f3f3f3",
  descriptionForeground: "#6c6c6cb3",
  "diffEditor.insertedTextBackground": "#9bb95533",
  "diffEditor.removedTextBackground": "#ff000033",
  "dropdown.background": "#ffffff",
  "dropdown.border": "#cecece",
  "editor.findMatchBackground": "#a8ac94",
  "editor.findMatchHighlightBackground": "#ea5c0055",
  "editor.findRangeHighlightBackground": "#b4b4b44d",
  "editor.hoverHighlightBackground": "#add6ff26",
  "editor.lineHighlightBackground": "#E6E6E6",
  "editor.lineHighlightBorder": "#E6E6E6",
  "editor.selectionBackground": "#E6E6E6",
  "editor.rangeHighlightBackground": "#fdff0033",
  "editor.wordHighlightBackground": "#57575740",
  "editor.wordHighlightStrongBackground": "#0e639c40",
  "editorActiveLineNumber.foreground": "#0b216f",
  "editorBracketMatch.background": "#0064001a",
  "editorBracketMatch.border": "#b9b9b9",
  "editorCodeLens.foreground": "#999999",
  "editorCursor.foreground": "#040404",
  "editorError.foreground": "#d60a0a",
  "editorGroup.border": "#e7e7e7",
  "editorGroup.dropBackground": "#3399ff2e",
  "editorGroupHeader.noTabsBackground": "#ffffff",
  "editorGroupHeader.tabsBackground": "#ffffff",
  "editorGutter.addedBackground": "#81b88b",
  "editorGutter.background": "#ffffff",
  "editorGutter.deletedBackground": "#ca4b51",
  "editorGutter.modifiedBackground": "#66afe0",
  "editorHint.foreground": "#6c6c6c",
  "editorHoverWidget.background": "#efeff2",
  "editorHoverWidget.border": "#c8c8c8",
  "editorInfo.foreground": "#008000",
  "editorLineNumber.activeForeground": "#757575",
  "editorLineNumber.foreground": "#e6e6e6",
  "editorLink.activeForeground": "#0971f1",
  "editorMarkerNavigation.background": "#ffffff",
  "editorMarkerNavigationError.background": "#d60a0a",
  "editorMarkerNavigationInfo.background": "#008000",
  "editorMarkerNavigationWarning.background": "#117711",
  "editorOverviewRuler.addedForeground": "#007acc99",
  "editorOverviewRuler.border": "#7f7f7f4d",
  "editorOverviewRuler.bracketMatchForeground": "#a0a0a0",
  "editorOverviewRuler.commonContentForeground": "#60606066",
  "editorOverviewRuler.currentContentForeground": "#40c8ae80",
  "editorOverviewRuler.deletedForeground": "#007acc99",
  "editorOverviewRuler.errorForeground": "#ff1212b3",
  "editorOverviewRuler.findMatchForeground": "#f6b94db3",
  "editorOverviewRuler.incomingContentForeground": "#40a6ff80",
  "editorOverviewRuler.infoForeground": "#121288b3",
  "editorOverviewRuler.modifiedForeground": "#007acc99",
  "editorOverviewRuler.rangeHighlightForeground": "#007acc99",
  "editorOverviewRuler.selectionHighlightForeground": "#a0a0a0cc",
  "editorOverviewRuler.warningForeground": "#128812b3",
  "editorOverviewRuler.wordHighlightForeground": "#a0a0a0cc",
  "editorOverviewRuler.wordHighlightStrongForeground": "#c0a0c0cc",
  "editorPane.background": "#ffffff",
  "editorRuler.foreground": "#d3d3d3",
  "editorSuggestWidget.border": "#c8c8c8",
  "editorSuggestWidget.foreground": "#040404",
  "editorSuggestWidget.highlightForeground": "#007acc",
  "editorSuggestWidget.selectedBackground": "#dcebfc",
  "editorUnnecessaryCode.opacity": "#04040477",
  "editorWarning.foreground": "#117711",
  "editorWhitespace.foreground": "#33333333",
  "editorWidget.background": "#efeff2",
  "editorWidget.border": "#c8c8c8",
  errorForeground: "#a1260d",
  "extensionButton.prominentBackground": "#327e36",
  "extensionButton.prominentForeground": "#ffffff",
  "extensionButton.prominentHoverBackground": "#28632b",
  focusBorder: "#007acc66",
  foreground: "#6c6c6c",
  "gitDecoration.addedResourceForeground": "#587c0c",
  "gitDecoration.conflictingResourceForeground": "#6c6cc4",
  "gitDecoration.deletedResourceForeground": "#ad0707",
  "gitDecoration.ignoredResourceForeground": "#8e8e90",
  "gitDecoration.modifiedResourceForeground": "#a76e12",
  "gitDecoration.submoduleResourceForeground": "#1258a7",
  "gitDecoration.untrackedResourceForeground": "#019001",
  "input.background": "#E6E6E6",
  "input.foreground": "#6c6c6c",
  "inputOption.activeBorder": "#007acc",
  "inputValidation.errorBackground": "#f2dede",
  "inputValidation.errorBorder": "#be1100",
  "inputValidation.infoBackground": "#d6ecf2",
  "inputValidation.infoBorder": "#007acc",
  "inputValidation.warningBackground": "#f6f5d2",
  "inputValidation.warningBorder": "#b89500",
  "list.activeSelectionBackground": "#3399ff",
  "list.activeSelectionForeground": "#ffffff",
  "list.dropBackground": "#dcebfc",
  "list.errorForeground": "#d60a0a",
  "list.focusBackground": "#dcebfc",
  "list.highlightForeground": "#007acc",
  "list.inactiveFocusBackground": "#d8dae6",
  "list.inactiveSelectionBackground": "#cccedb",
  "list.invalidItemForeground": "#b89500",
  "list.warningForeground": "#117711",
  "merge.commonContentBackground": "#60606029",
  "merge.commonHeaderBackground": "#60606066",
  "merge.currentContentBackground": "#40c8ae33",
  "merge.currentHeaderBackground": "#40c8ae80",
  "merge.incomingContentBackground": "#40a6ff33",
  "merge.incomingHeaderBackground": "#40a6ff80",
  "notificationCenterHeader.background": "#e2e2e7",
  "notificationLink.foreground": "#4080d0",
  "notifications.background": "#efeff2",
  "notifications.border": "#e2e2e7",
  "panel.background": "#ffffff",
  "panel.border": "#80808059",
  "panel.dropBackground": "#3399ff2e",
  "panelTitle.activeBorder": "#80808059",
  "panelTitle.activeForeground": "#424242",
  "panelTitle.inactiveForeground": "#424242bf",
  "peekView.border": "#007acc",
  "peekViewEditor.background": "#f2f8fc",
  "peekViewEditor.matchHighlightBackground": "#f5d802de",
  "peekViewEditorGutter.background": "#f2f8fc",
  "peekViewResult.background": "#f3f3f3",
  "peekViewResult.fileForeground": "#1e1e1e",
  "peekViewResult.lineForeground": "#646465",
  "peekViewResult.matchHighlightBackground": "#ea5c004d",
  "peekViewResult.selectionBackground": "#3399ff33",
  "peekViewResult.selectionForeground": "#6c6c6c",
  "peekViewTitle.background": "#ffffff",
  "peekViewTitleDescription.foreground": "#6c6c6cb3",
  "peekViewTitleLabel.foreground": "#333333",
  "pickerGroup.border": "#cccedb",
  "pickerGroup.foreground": "#007acc99",
  "progressBar.background": "#0e70c0",
  "scrollbar.shadow": "#dddddd",
  "scrollbarSlider.activeBackground": "#04040499",
  "scrollbarSlider.background": "#64646466",
  "scrollbarSlider.hoverBackground": "#646464b3",
  "settings.modifiedItemForeground": "#019001",
  "separator.background": "#dddddd",
  "separator.foreground": "#757575",
  "sideBar.background": "#ffffff",
  "sideBar.dropBackground": "#e6e6e6",
  "sideBar.foreground": "#151515",
  "sideBar.border": "#e6e6e6",
  "sideBarSectionHeader.background": "#80808033",
  "sideBarTitle.foreground": "#6f6f6f",
  "statusBar.background": "#ffffff",
  "statusBar.debuggingBackground": "#cc6633",
  "statusBar.debuggingForeground": "#ffffff",
  "statusBar.foreground": "#ffffff",
  "statusBar.noFolderBackground": "#68217a",
  "statusBar.noFolderForeground": "#ffffff",
  "statusBarItem.activeBackground": "#ffffff2e",
  "statusBarItem.hoverBackground": "#ffffff1f",
  "statusBarItem.prominentBackground": "#388a34",
  "statusBarItem.prominentHoverBackground": "#369432",
  "tab.activeBackground": "#ffffff",
  "tab.activeForeground": "#333333",
  "tab.hoverForeground": "#040404",
  "tab.border": "#e6e6e6",
  "tab.activeBorder": "#6CC7F6",
  "tab.inactiveBackground": "#ffffff",
  "tab.inactiveForeground": "#999999",
  "tab.unfocusedActiveForeground": "#333333b3",
  "tab.unfocusedInactiveForeground": "#33333340",
  "terminal.ansiBlack": "#040404",
  "terminal.ansiBlue": "#0451a5",
  "terminal.ansiBrightBlack": "#666666",
  "terminal.ansiBrightBlue": "#0451a5",
  "terminal.ansiBrightCyan": "#0598bc",
  "terminal.ansiBrightGreen": "#14ce14",
  "terminal.ansiBrightMagenta": "#bc05bc",
  "terminal.ansiBrightRed": "#cd3131",
  "terminal.ansiBrightWhite": "#a5a5a5",
  "terminal.ansiBrightYellow": "#b5ba00",
  "terminal.ansiCyan": "#0598bc",
  "terminal.ansiGreen": "#00bc00",
  "terminal.ansiMagenta": "#bc05bc",
  "terminal.ansiRed": "#cd3131",
  "terminal.ansiWhite": "#555555",
  "terminal.ansiYellow": "#949800",
  "terminal.foreground": "#333333",
  "terminal.selectionBackground": "#04040440",
  "textBlockQuote.background": "#7f7f7f1a",
  "textBlockQuote.border": "#007acc80",
  "textCodeBlock.background": "#dcdcdc66",
  "textLink.activeForeground": "#4080d0",
  "textLink.foreground": "#4080d0",
  "textPreformat.foreground": "#a31515",
  "textSeparator.foreground": "#0404042e",
  "titleBar.activeBackground": "#dddddd",
  "titleBar.activeForeground": "#333333",
  "titleBar.inactiveBackground": "#dddddd99",
  "titleBar.inactiveForeground": "#33333399",
  "widget.shadow": "#a8a8a8",
}
var tokenColors = [
  {
    scope: ["meta.embedded", "source.groovy.embedded"],
    settings: {
      foreground: "#000971f1",
    },
  },
  {
    scope: "emphasis",
    settings: {
      fontStyle: "italic",
    },
  },
  {
    scope: "strong",
    settings: {
      fontStyle: "bold",
    },
  },
  {
    scope: "meta.diff.header",
    settings: {
      foreground: "#000080",
    },
  },
  {
    scope: "comment",
    settings: {
      foreground: "#008000",
    },
  },
  {
    scope: "constant.language",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: ["constant.numeric"],
    settings: {
      foreground: "#09885a",
    },
  },
  {
    scope: "constant.regexp",
    settings: {
      foreground: "#811f3f",
    },
  },
  {
    name: "css tags in selectors, xml tags",
    scope: "entity.name.tag",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "entity.name.selector",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "entity.other.attribute-name",
    settings: {
      foreground: "#ff0000",
    },
  },
  {
    scope: [
      "entity.other.attribute-name.class.css",
      "entity.other.attribute-name.class.mixin.css",
      "entity.other.attribute-name.id.css",
      "entity.other.attribute-name.parent-selector.css",
      "entity.other.attribute-name.pseudo-class.css",
      "entity.other.attribute-name.pseudo-element.css",
      "source.css.less entity.other.attribute-name.id",
      "entity.other.attribute-name.attribute.scss",
      "entity.other.attribute-name.scss",
    ],
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "invalid",
    settings: {
      foreground: "#cd3131",
    },
  },
  {
    scope: "markup.underline",
    settings: {
      fontStyle: "underline",
    },
  },
  {
    scope: "markup.bold",
    settings: {
      fontStyle: "bold",
      foreground: "#000080",
    },
  },
  {
    scope: "markup.heading",
    settings: {
      fontStyle: "bold",
      foreground: "#E1270E",
    },
  },
  {
    scope: "markup.italic",
    settings: {
      fontStyle: "italic",
    },
  },
  {
    scope: "markup.inserted",
    settings: {
      foreground: "#09885a",
    },
  },
  {
    scope: "markup.deleted",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "markup.changed",
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: [
      "beginning.punctuation.definition.quote.markdown",
      "beginning.punctuation.definition.list.markdown",
    ],
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: "markup.inline.raw",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "meta.selector",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    name: "brackets of XML/HTML tags",
    scope: "punctuation.definition.tag",
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "meta.preprocessor",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "meta.preprocessor.string",
    settings: {
      foreground: "#bf5af2",
    },
  },
  {
    scope: "meta.preprocessor.numeric",
    settings: {
      foreground: "#09885a",
    },
  },
  {
    scope: "meta.structure.dictionary.key.python",
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: "storage",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "storage.type",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "storage.modifier",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "string",
    settings: {
      foreground: "#bf5af2",
    },
  },
  {
    scope: [
      "string.comment.buffered.block.pug",
      "string.quoted.pug",
      "string.interpolated.pug",
      "string.unquoted.plain.in.yaml",
      "string.unquoted.plain.out.yaml",
      "string.unquoted.block.yaml",
      "string.quoted.single.yaml",
      "string.quoted.double.xml",
      "string.quoted.single.xml",
      "string.unquoted.cdata.xml",
      "string.quoted.double.html",
      "string.quoted.single.html",
      "string.unquoted.html",
      "string.quoted.single.handlebars",
      "string.quoted.double.handlebars",
    ],
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "string.regexp",
    settings: {
      foreground: "#811f3f",
    },
  },
  {
    name: "String interpolation",
    scope: [
      "punctuation.definition.template-expression.begin",
      "punctuation.definition.template-expression.end",
      "punctuation.section.embedded",
    ],
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    name: "Reset JavaScript string interpolation expression",
    scope: ["meta.template.expression"],
    settings: {
      foreground: "#040404",
    },
  },
  {
    scope: [
      "support.constant.property-value",
      "support.constant.font-name",
      "support.constant.media-type",
      "support.constant.media",
      "constant.other.color.rgb-value",
      "constant.other.rgb-value",
      "support.constant.color",
    ],
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: [
      "support.type.vendored.property-name",
      "support.type.property-name",
      "variable.css",
      "variable.scss",
      "variable.other.less",
      "source.coffee.embedded",
    ],
    settings: {
      foreground: "#ff0000",
    },
  },
  {
    scope: ["support.type.property-name.json"],
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: "keyword",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "keyword.control",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "keyword.operator",
    settings: {
      foreground: "#040404",
    },
  },
  {
    scope: [
      "keyword.operator.new",
      "keyword.operator.expression",
      "keyword.operator.cast",
      "keyword.operator.sizeof",
      "keyword.operator.instanceof",
      "keyword.operator.logical.python",
    ],
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "keyword.other.unit",
    settings: {
      foreground: "#09885a",
    },
  },
  {
    scope: [
      "punctuation.section.embedded.begin.php",
      "punctuation.section.embedded.end.php",
    ],
    settings: {
      foreground: "#E1270E",
    },
  },
  {
    scope: "support.function.git-rebase",
    settings: {
      foreground: "#0451a5",
    },
  },
  {
    scope: "constant.sha.git-rebase",
    settings: {
      foreground: "#09885a",
    },
  },
  {
    name: "coloring of the Java import and package identifiers",
    scope: [
      "storage.modifier.import.java",
      "variable.language.wildcard.java",
      "storage.modifier.package.java",
    ],
    settings: {
      foreground: "#040404",
    },
  },
  {
    name: "this.self",
    scope: "variable.language",
    settings: {
      foreground: "#0971f1",
    },
  },
  {
    scope: "token.info-token",
    settings: {
      foreground: "#316bcd",
    },
  },
  {
    scope: "token.warn-token",
    settings: {
      foreground: "#cd9731",
    },
  },
  {
    scope: "token.error-token",
    settings: {
      foreground: "#cd3131",
    },
  },
  {
    scope: "token.debug-token",
    settings: {
      foreground: "#800080",
    },
  },
]
var codesandboxLight = {
  name: name,
  type: type,
  colors: colors$2,
  tokenColors: tokenColors,
}

/**
 *
 * switch color for light theme
 * secondary button color
 * collapsible icon
 *
 */

var polyfillTheme = function polyfillTheme(vsCodeTheme) {
  /**
   *
   * In order of importance, this is the value we use:
   * 1. Value from theme
   * 2. or inferred value from theme
   * 3. or value from codesandbox black/light
   *
   * The steps required to get there are -
   * 1. Take vscode theme
   * 2. Fill missing values based on existing values or codesandbox dark/light
   * 3. Infer values that are not defined by vscode theme
   *
   */
  var uiColors = {
    // initialise objects to avoid null checks later
    editor: {},
    button: {},
    input: {},
    inputOption: {},
    list: {},
    sideBar: {},
    activityBar: {},
    titleBar: {},
    quickInput: {},
    editorHoverWidget: {},
    menuList: {},
    dialog: {},
    tab: {},
  }
  var type = vsCodeTheme.type || guessType(vsCodeTheme) //  Step 1: Initialise with vscode theme

  var vsCodeColors = object(vsCodeTheme.colors || {})
  uiColors = deepmerge__default["default"](uiColors, vsCodeColors) // Step 2: Fill missing values from existing values or codesandbox dark/light

  var codesandboxColors = ["dark", "lc"].includes(type)
    ? object(theme.colors)
    : object(codesandboxLight.colors) // 2.1 First, lets fill in core values that are used to infer other values

  uiColors.foreground = uiColors.foreground || codesandboxColors.foreground
  uiColors.errorForeground =
    uiColors.errorForeground || codesandboxColors.errorForeground
  uiColors.sideBar = {
    background:
      uiColors.sideBar.background ||
      uiColors.editor.background ||
      codesandboxColors.sideBar.background,
    foreground:
      uiColors.sideBar.foreground ||
      uiColors.editor.foreground ||
      codesandboxColors.sideBar.foreground,
    border:
      uiColors.sideBar.border ||
      uiColors.editor.lineHighlightBackground ||
      codesandboxColors.sideBar.border,
  }
  uiColors.input = {
    background: uiColors.input.background || uiColors.sideBar.border,
    foreground: uiColors.input.foreground || uiColors.sideBar.foreground,
    border: uiColors.input.border || uiColors.sideBar.border,
    placeholderForeground:
      uiColors.input.placeholderForeground ||
      codesandboxColors.input.placeholderForeground,
  }
  uiColors.quickInput = {
    background: uiColors.quickInput.background || uiColors.sideBar.background,
    foreground: uiColors.quickInput.foreground || uiColors.sideBar.foreground,
  }
  uiColors.editorHoverWidget = {
    background:
      uiColors.editorHoverWidget.background || uiColors.sideBar.background,
    foreground:
      uiColors.editorHoverWidget.foreground || uiColors.sideBar.foreground,
    border: uiColors.editorHoverWidget.border || uiColors.sideBar.border,
  }
  uiColors.inputOption.activeBorder =
    uiColors.inputOption.activeBorder || uiColors.input.placeholderForeground
  uiColors.button = {
    background:
      uiColors.button.background || codesandboxColors.button.background,
    foreground:
      uiColors.button.foreground || codesandboxColors.button.foreground,
  } // Step 3. Infer values that are not defined by vscode theme
  // Step 3.1
  // As all VSCode themes are built for a code editor,
  // the design decisions made in them might not work well
  // for an interface like ours which has other ui elements as well.
  // To make sure the UI looks great, we change some of these design decisions
  // made by the theme author

  var decreaseContrast = type === "dark" ? lighten : darken
  var mutedForeground = withContrast(
    uiColors.input.placeholderForeground,
    uiColors.sideBar.background,
    type,
  )

  if (uiColors.sideBar.border === uiColors.sideBar.background) {
    uiColors.sideBar.border = decreaseContrast(
      uiColors.sideBar.background,
      0.25,
    )
  }

  if (uiColors.sideBar.hoverBackground === uiColors.sideBar.background) {
    uiColors.sideBar.hoverBackground = decreaseContrast(
      uiColors.sideBar.background,
      0.25,
    )
  }

  if (uiColors.list.hoverBackground === uiColors.sideBar.background) {
    if (
      uiColors.list.inactiveSelectionBackground &&
      uiColors.list.hoverBackground !==
        uiColors.list.inactiveSelectionBackground
    ) {
      uiColors.list.hoverBackground = uiColors.list.inactiveSelectionBackground
    } else {
      // if that didnt work, its math time
      uiColors.list.hoverBackground = decreaseContrast(
        uiColors.sideBar.background,
        0.25,
      )
    }
  }

  uiColors.list.foreground = uiColors.list.foreground || mutedForeground
  uiColors.list.hoverForeground =
    uiColors.list.hoverForeground || uiColors.sideBar.foreground
  uiColors.list.hoverBackground =
    uiColors.list.hoverBackground || uiColors.sideBar.hoverBackground
  uiColors.titleBar.activeBackground =
    uiColors.titleBar.activeBackground || uiColors.sideBar.background
  uiColors.titleBar.activeForeground =
    uiColors.titleBar.activeForeground || uiColors.sideBar.foreground
  uiColors.titleBar.border = uiColors.titleBar.border || uiColors.sideBar.border // Step 3.2
  // On the same theme of design decisions for interfaces,
  // we add a bunch of extra elements and interaction.
  // To make these elements look natural with the theme,
  // we infer them from the theme
  // const main = Color(uiColors.editor.background).hsl();
  // const shade = shades(uiColors.editor.background);
  // log(uiColors.editor.background);
  // const inverse = (num) =>
  //   main.isLight()
  //     ? darken(uiColors.editor.background, num)
  //     : lighten(uiColors.editor.background, num);

  var addedColors = {
    // shades: shade,
    mutedForeground: mutedForeground,
    // browser: {
    //   borderWidth: '0px',
    //   padding: '4px',
    //   background: main.lightness() > 20 ? shade[900] : shade[700],
    // },
    // panel: {
    //   background: uiColors.editor.background,
    // },
    // panelHeader: {
    //   inactiveForeground: inverse(3),
    //   inactiveBackground: inverse(-0.25),
    //   hoveredBackground: inverse(2),
    //   hoveredForeground: inverse(-1.5),
    //   activeBackground: inverse(2),
    //   activeForeground: inverse(-1.5),
    // },
    activityBar: {
      selectedForeground: uiColors.sideBar.foreground,
      inactiveForeground: mutedForeground,
      hoverBackground: uiColors.sideBar.border,
    },
    avatar: {
      border: uiColors.sideBar.border,
    },
    sideBar: {
      hoverBackground: uiColors.sideBar.border,
    },
    button: {
      // hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.button.background}`,
    },
    secondaryButton: {
      background: uiColors.input.background,
      foreground: uiColors.input.foreground, // hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${uiColors.sideBar.border}`,
    },
    dangerButton: {
      background: colors.red[300],
      foreground: "#FFFFFF", // hoverBackground: `linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), ${designLanguage.colors.red[300]}`,
    },
    icon: {
      foreground: uiColors.foreground,
    },
    // switch: {
    //   backgroundOff: uiColors.input.background,
    //   backgroundOn: uiColors.button.background,
    //   toggle: designLanguage.colors.white,
    // },
    dialog: {
      background: uiColors.quickInput.background,
      foreground: uiColors.quickInput.foreground,
      border: uiColors.sideBar.border,
    },
    menuList: {
      background: uiColors.sideBar.background,
      // foreground: uiColors.mutedForeground,
      border: uiColors.sideBar.border,
      hoverBackground: uiColors.sideBar.border,
      hoverForeground: colors.white,
    },
  }
  uiColors = deepmerge__default["default"](uiColors, addedColors) // if (uiColors.switch.backgroundOff === uiColors.sideBar.background) {
  //   uiColors.switch.backgroundOff = uiColors.sideBar.border;
  // }
  // if (uiColors.switch.toggle === uiColors.switch.backgroundOff) {
  //   // default is white, we make it a little darker
  //   uiColors.switch.toggle = designLanguage.colors.gray[200];
  // }
  // // ensure enough contrast from inactive state

  uiColors.activityBar.selectedForeground = withContrast(
    uiColors.activityBar.selectedForeground,
    uiColors.activityBar.inactiveForeground,
    type,
    "icon",
  )
  var colors$1 = {}
  Object.keys(uiColors).forEach(function (c) {
    if (typeof uiColors[c] === "object") {
      Object.keys(uiColors[c]).forEach(function (d) {
        colors$1[c + "." + d] = uiColors[c][d]
      })
    } else {
      colors$1["" + c] = uiColors[c]
    }
  })
  return colors$1
}

var guessType = function guessType(theme) {
  if (theme.name && theme.name.toLowerCase().includes("light")) return "light"
  return Color__default["default"](theme.colors["editor.background"]).isLight()
    ? "light"
    : "dark"
}

var lighten = function lighten(color, value) {
  return Color__default["default"](color).lighten(value).hex()
}

var darken = function darken(color, value) {
  return Color__default["default"](color).darken(value).hex()
}

var withContrast = function withContrast(
  color,
  background,
  type,
  contrastType,
) {
  if (contrastType === void 0) {
    contrastType = "text"
  }

  var contrastRatio = {
    text: 4.5,
    icon: 1.6,
  }
  var contrast = contrastRatio[contrastType]
  if (
    Color__default["default"](color).contrast(
      Color__default["default"](background),
    ) > contrast
  )
    return color // can't fix that

  if (color === "#FFFFFF" || color === "#000000") return color // recursively increase contrast

  var increaseContrast = type === "dark" ? lighten : darken
  return withContrast(
    increaseContrast(color, 0.1),
    background,
    type,
    contrastType,
  )
}

function validateColor(color) {
  var c = Color__default["default"](color)
  return c.hex()
}

function convertTheme(theme) {
  var _theme$colors, _ref2, _colors$editorForegr

  var colors = Object.fromEntries(
    Object.entries(
      (_theme$colors = theme.colors) !== null && _theme$colors !== void 0
        ? _theme$colors
        : {},
    )
      .map(function (_ref) {
        var k = _ref[0],
          v = _ref[1]

        try {
          if (k.split(".").length === 2) return [k, validateColor(v)]
          else {
            return null
          }
        } catch (e) {
          return null
        }
      })
      .filter(Boolean),
  )
  var monacoThemeRule = [
    {
      token: "unmatched",
      foreground:
        (_ref2 =
          (_colors$editorForegr = colors["editor.foreground"]) !== null &&
          _colors$editorForegr !== void 0
            ? _colors$editorForegr
            : colors["foreground"]) !== null && _ref2 !== void 0
          ? _ref2
          : "#bbbbbb",
    },
  ]
  var returnTheme = {
    inherit: false,
    base: "vs-dark",
    colors: colors,
    rules: monacoThemeRule,
    encodedTokensColors: [],
  }
  theme.tokenColors.map(function (color) {
    if (typeof color.scope == "string") {
      var split = color.scope.split(/[, ]/g)

      if (split.length > 1) {
        color.scope = split
        evalAsArray()
        return
      }

      monacoThemeRule.push(
        Object.assign(
          {},
          Object.fromEntries(
            Object.entries(color.settings).map(function (_ref3) {
              var k = _ref3[0],
                v = _ref3[1]
              return [
                k,
                ["foreground", "background"].includes(k) ? validateColor(v) : v,
              ]
            }),
          ),
          {
            // token: color.scope.replace(/\s/g, '')
            token: color.scope,
          },
        ),
      )
      return
    }

    if (!color.scope) {
      return
    }

    evalAsArray()

    function evalAsArray() {
      color.scope.map(function (scope) {
        monacoThemeRule.push(
          Object.assign(
            {},
            Object.fromEntries(
              Object.entries(color.settings).map(function (_ref4) {
                var k = _ref4[0],
                  v = _ref4[1]
                return [
                  k,
                  ["foreground", "background"].includes(k)
                    ? validateColor(v)
                    : v,
                ]
              }),
            ),
            {
              token: scope,
            },
          ),
        )
      })
    }
  })
  return returnTheme
}

var vscodeThemes = function (_temp) {
  var _ref = _temp === void 0 ? {} : _temp,
    _ref$transformTheme = _ref.transformTheme,
    transformTheme =
      _ref$transformTheme === void 0
        ? function (t) {
            return t
          }
        : _ref$transformTheme

  return createPlugin(
    {
      name: "vscode.themes",
      dependencies: ["core.themes"],
    },
    function (monaco) {
      var oldDefineTheme = monaco.editor.defineTheme

      monaco.editor.defineTheme = function (themeName, theme) {
        if (
          "$schema" in theme &&
          theme["$schema"] === "vscode://schemas/color-theme"
        ) {
          var converted = convertTheme(theme)
          var polyfilledColors = polyfillTheme(converted)
          oldDefineTheme(
            themeName,
            transformTheme === null || transformTheme === void 0
              ? void 0
              : transformTheme(
                  Object.assign({}, converted, {
                    colors: polyfilledColors,
                  }),
                ),
          )
        } else {
          oldDefineTheme(themeName, theme)
        }
      }
    },
  )
} //

// as described in issue: https://github.com/NeekSandhu/monaco-textmate/issues/5
var textMateToMonacoToken = function textMateToMonacoToken(editor, scopes) {
  var scopeName = "" // get the scope name. Example: cpp , java, haskell

  for (var i = scopes[0].length - 1; i >= 0; i -= 1) {
    var _char = scopes[0][i]

    if (_char === ".") {
      break
    }

    scopeName = _char + scopeName
  } // iterate through all scopes from last to first

  for (var _i = scopes.length - 1; _i >= 0; _i -= 1) {
    var scope = scopes[_i]
    /**
     * Try all possible tokens from high specific token to low specific token
     *
     * Example:
     * 0 meta.function.definition.parameters.cpp
     * 1 meta.function.definition.parameters
     *
     * 2 meta.function.definition.cpp
     * 3 meta.function.definition
     *
     * 4 meta.function.cpp
     * 5 meta.function
     *
     * 6 meta.cpp
     * 7 meta
     */

    for (var _i2 = scope.length - 1; _i2 >= 0; _i2 -= 1) {
      var _char2 = scope[_i2]

      if (_char2 === ".") {
        var token = scope.slice(0, _i2)

        if (
          editor["_themeService"]
            .getColorTheme()
            ._tokenTheme._match(token + "." + scopeName)._foreground > 1
        ) {
          return token
        }
      }
    }

    for (var _i3 = scope.length - 1; _i3 >= 0; _i3 -= 1) {
      var _char3 = scope[_i3]

      if (_char3 === ".") {
        var _token = scope.slice(0, _i3)

        if (
          editor["_themeService"].getColorTheme()._tokenTheme._match(_token)
            ._foreground > 1
        ) {
          return _token
        }
      }
    }
  }

  return "unmatched"
}

var TokenizerState = /*#__PURE__*/ (function () {
  function TokenizerState(_ruleStack) {
    this._ruleStack = _ruleStack
  }

  var _proto = TokenizerState.prototype

  _proto.clone = function clone() {
    return new TokenizerState(this._ruleStack)
  }

  _proto.equals = function equals(other) {
    if (
      !other ||
      !(other instanceof TokenizerState) ||
      other !== this ||
      other._ruleStack !== this._ruleStack
    ) {
      return false
    }

    return true
  }

  _createClass(TokenizerState, [
    {
      key: "ruleStack",
      get: function get() {
        return this._ruleStack
      },
    },
  ])

  return TokenizerState
})()

var knonwSyntaxes = {
  "source.graphql": {
    format: "url",
    responseFormat: "json",
    scopeName: "source.graphql",
    url:
      "https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/kumar-harsh.graphql-for-vscode-1.13.0/syntaxes/graphql.json",
  },
  "source.json.comments": {
    format: "url",
    scopeName: "source.json.comments",
    responseFormat: "json",
    url:
      "https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/json/syntaxes/JSONC.tmLanguage.json",
  },
  "source.tsx": {
    format: "url",
    scopeName: "source.tsx",
    responseFormat: "plist",
    url:
      "https://raw.githubusercontent.com/microsoft/TypeScript-TmLanguage/master/TypeScriptReact.tmLanguage",
  },
  "source.css": {
    format: "url",
    scopeName: "source.css",
    responseFormat: "json",
    url:
      "https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/css/syntaxes/css.tmLanguage.json",
  },
  "text.html.basic": {
    format: "url",
    scopeName: "text.html.basic",
    responseFormat: "json",
    url:
      "https://raw.githubusercontent.com/codesandbox/codesandbox-client/master/standalone-packages/vscode-extensions/out/extensions/html/syntaxes/html.tmLanguage.json",
  },
}
var knonwScopes = {
  graphql: "source.graphql",
  json: "source.json.comments",
  typescript: "source.tsx",
  javascript: "source.tsx",
  css: "source.css",
  html: "text.html.basic",
}
var textmate = function () {
  return createPlugin(
    {
      name: "textmate",
      dependencies: ["core.editors"],
    },
    function (monaco) {
      try {
        return Promise.resolve(
          onigasm.loadWASM("https://www.unpkg.com/onigasm/lib/onigasm.wasm"),
        ).then(function () {
          var registerSyntax = function registerSyntax(
            language,
            scopeName,
            syntax,
          ) {
            try {
              if (scopeName === undefined) scopeName = knonwScopes[language]
              if (syntax === undefined) syntax = knonwSyntaxes[scopeName]
              syntax = syntax.format ? syntax : knonwSyntaxes[scopeName]
              syntaxes[scopeName] = syntax
              grammars[language] = scopeName
              return Promise.resolve(registry.loadGrammar(scopeName)).then(
                function (grammar) {
                  monaco.languages.setTokensProvider(language, {
                    getInitialState: function getInitialState() {
                      return new TokenizerState(monacoTextmate.INITIAL)
                    },
                    tokenize: function tokenize(line, state) {
                      var oldStack = state.ruleStack

                      try {
                        var res = grammar.tokenizeLine(line, state.ruleStack)
                        var editor = monaco.editor.getFocusedEditor()
                        var tokens = {
                          endState: new TokenizerState(res.ruleStack),
                          tokens: res.tokens.map(function (token) {
                            return Object.assign({}, token, {
                              // TODO: At the moment, monaco-editor doesn't seem to accept array of scopes
                              scopes: editor
                                ? textMateToMonacoToken(editor, token.scopes)
                                : token.scopes.join(" "),
                            })
                          }),
                        }
                        return tokens
                      } catch (e) {
                        return {
                          endState: new TokenizerState(oldStack),
                          tokens: [],
                        }
                      }
                    },
                  })
                },
              )
            } catch (e) {
              return Promise.reject(e)
            }
          }

          var syntaxes = Object.assign({}, knonwSyntaxes) // map of monaco "language id's" to TextMate scopeNames

          var grammars = {}
          var registry = new monacoTextmate.Registry({
            getGrammarDefinition: function (scopeName) {
              try {
                var repo = syntaxes[scopeName]

                if (!repo) {
                  return Promise.resolve({
                    format: "json",
                    content: "{}",
                  })
                }

                if (repo.format === "url") {
                  var _repo$responseFormat2 = repo.responseFormat
                  return Promise.resolve(fetch(repo.url)).then(function (
                    _fetch,
                  ) {
                    return Promise.resolve(_fetch.text()).then(function (
                      _await$fetch$text,
                    ) {
                      return {
                        format: _repo$responseFormat2,
                        content: _await$fetch$text,
                      }
                    })
                  })
                } else {
                  return Promise.resolve(repo)
                }
              } catch (e) {
                return Promise.reject(e)
              }
            },
          })

          monaco.languages.registerSyntax = function (language, syntax) {
            return registerSyntax(
              language,
              syntax === null || syntax === void 0 ? void 0 : syntax.scopeName,
              syntax,
            )
          }

          var oldRegister = monaco.languages.register

          monaco.languages.register = function (def) {
            if (knonwScopes[def.id] && def.loader) {
              delete def.loader
            }

            oldRegister(def)

            if (def.id === "json") {
              var _monaco$languages$jso, _monaco$languages$jso2
              ;(_monaco$languages$jso = monaco.languages.json) === null ||
              _monaco$languages$jso === void 0
                ? void 0
                : (_monaco$languages$jso2 =
                    _monaco$languages$jso.jsonDefaults) === null ||
                  _monaco$languages$jso2 === void 0
                ? void 0
                : _monaco$languages$jso2.setModeConfiguration({
                    tokens: false,
                  })
            }

            if (knonwScopes[def.id]) {
              monaco.languages.registerSyntax(def.id)
            }
          }
        })
      } catch (e) {
        return Promise.reject(e)
      }
    },
  )
}

var pluginMap = {
  prettier: prettier,
  graphql: graphql,
  typings: typings,
  "vscode-themes": vscodeThemes,
  textmate: textmate,
}

var index = {
  __proto__: null,
  pluginMap: pluginMap,
  prettier: prettier,
  graphql: graphql,
  typings: typings,
  vscodeThemes: vscodeThemes,
  textmate: textmate,
}

var _createContext = createHookContext.createContext(
    function (config) {
      return useMonaco(config)
    },
    undefined,
    "Monaco",
  ),
  MonacoProvider = _createContext[0],
  MonacoContext = _createContext[3]
function useMonacoContext() {
  var context = React__default["default"].useContext(MonacoContext)
  return context
}
var useMonaco = function useMonaco(_ref) {
  if (_ref === void 0) {
    _ref = {}
  }

  var _ref2 = _ref,
    _ref2$plugins = _ref2.plugins,
    plugins = _ref2$plugins === void 0 ? [] : _ref2$plugins,
    _ref2$languages = _ref2.languages,
    languages =
      _ref2$languages === void 0
        ? ["javascript", "typescript", "html", "css", "json"]
        : _ref2$languages,
    _ref2$defaultEditorOp = _ref2.defaultEditorOptions,
    defaultEditorOptions =
      _ref2$defaultEditorOp === void 0
        ? {
            automaticLayout: true,
            minimap: {
              enabled: false,
            },
          }
        : _ref2$defaultEditorOp,
    onLoad = _ref2.onLoad,
    theme = _ref2.theme,
    themes = _ref2.themes,
    onThemeChange = _ref2.onThemeChange,
    loaderOptions = _objectWithoutPropertiesLoose(_ref2, [
      "plugins",
      "languages",
      "defaultEditorOptions",
      "onLoad",
      "theme",
      "themes",
      "onThemeChange",
    ])

  // Loading (unset once we have initialized monaco)
  var rFirstMount = React__default["default"].useRef(true)

  var _React$useState = React__default["default"].useState(true),
    isLoading = _React$useState[0],
    setIsLoading = _React$useState[1] // Set monaco context to state

  var contextMonaco = useMonacoContext() // Monaco instance (use the one in context if we have it)

  var _React$useState2 = React__default["default"].useState(
      (
        contextMonaco === null || contextMonaco === void 0
          ? void 0
          : contextMonaco.monaco
      )
        ? contextMonaco.monaco
        : typeof window !== "undefined"
        ? window.monaco
        : null,
    ),
    monaco = _React$useState2[0],
    setMonaco = _React$useState2[1] // A ref to hold our disposables (don't run these until the hook unmounts!)

  var disposablesRef = React__default["default"].useRef([]) //
  // Load and/or initialize monaco

  React__default["default"].useEffect(
    function () {
      var _pluginDisposable, _onLoadDisposable, _cancelable

      // If we need to get monaco into state...
      var initializeMonaco = function initializeMonaco() {
        try {
          var _temp5 = function _temp5() {
            var _monaco$plugin

            // Load plugins
            return Promise.resolve(
              (_monaco$plugin = _monaco.plugin).install
                .apply(_monaco$plugin, getPlugins(plugins, languages))
                .then(function (d) {
                  return (pluginDisposable = asDisposable(d))
                }),
            ).then(function () {
              function _temp2() {
                // Save monaco to window and state.
                window.monaco = _monaco
                setMonaco(_monaco)
                setIsLoading(false)
              }

              // Setup themes
              if (!!themes) {
                _monaco.editor.defineThemes(themes)
              } // Set the current theme

              if (!!theme) {
                var themeToSet = typeof theme === "function" ? theme() : theme

                if (typeof themeToSet === "string" || !("then" in themeToSet)) {
                  _monaco.editor.setTheme(themeToSet)
                } else {
                  themeToSet.then(_monaco.editor.setTheme)
                }
              } // Perform any onLoad tasks.

              var _temp = (function () {
                if (onLoad) {
                  return Promise.resolve(onLoad(_monaco)).then(function (
                    disposables,
                  ) {
                    if (disposables) {
                      onLoadDisposable = asDisposable(
                        Array.isArray(disposables)
                          ? disposables
                          : [disposables],
                      )
                    }
                  })
                }
              })()

              return _temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp)
            })
          }

          var _monaco = window.monaco // Load monaco if necessary.

          var _temp6 = (function () {
            if (_monaco === undefined) {
              cancelable = loadMonaco(
                loaderOptions !== null && loaderOptions !== void 0
                  ? loaderOptions
                  : {},
              )
              return Promise.resolve(cancelable).then(function (_cancelable2) {
                _monaco = _cancelable2
              })
            }
          })()

          return Promise.resolve(
            _temp6 && _temp6.then ? _temp6.then(_temp5) : _temp5(_temp6),
          )
        } catch (e) {
          return Promise.reject(e)
        }
      }

      var cancelable
      var pluginDisposable
      var onLoadDisposable // This effect should only run in the browser

      if (typeof window === "undefined") return // If we have monaco already....

      if (monaco && isLoading) {
        if (!window.monaco) window.monaco = monaco
        setIsLoading(false)
        return
      }

      initializeMonaco()["catch"](function (error) {
        return console.error(
          "An error occurred during initialization of Monaco:",
          error,
        )
      })
      disposablesRef.current = [
        (_pluginDisposable = pluginDisposable) === null ||
        _pluginDisposable === void 0
          ? void 0
          : _pluginDisposable.dispose,
        (_onLoadDisposable = onLoadDisposable) === null ||
        _onLoadDisposable === void 0
          ? void 0
          : _onLoadDisposable.dispose,
        (_cancelable = cancelable) === null || _cancelable === void 0
          ? void 0
          : _cancelable.cancel,
      ]
    },
    [monaco, languages, plugins],
  ) //
  // Setup onThemeChange event handler

  React__default["default"].useEffect(
    function () {
      if (!monaco) return
      if (!onThemeChange) return
      if (rFirstMount.current) return
      var disposable = monaco.editor.onDidChangeTheme(function (theme) {
        onThemeChange(theme, monaco)
      })
      return function () {
        var _disposable$dispose

        disposable === null || disposable === void 0
          ? void 0
          : (_disposable$dispose = disposable.dispose) === null ||
            _disposable$dispose === void 0
          ? void 0
          : _disposable$dispose.call(disposable)
      }
    },
    [monaco, onThemeChange, theme],
  ) //
  // Setup theme and themes

  React__default["default"].useEffect(
    function () {
      if (!monaco) return
      if (rFirstMount.current) return // Setup themes

      if (!!themes) {
        monaco.editor.defineThemes(themes)
      } // Set the current theme

      if (!!theme) {
        var themeToSet = typeof theme === "function" ? theme() : theme

        if (typeof themeToSet === "string" || !("then" in themeToSet)) {
          monaco.editor.setTheme(themeToSet)
        } else {
          themeToSet.then(monaco.editor.setTheme)
        }
      }
    },
    [monaco, theme, themes],
  ) //
  // A hook to run changes when monaco changes. (Maybe not needed?)

  var useMonacoEffect = React__default["default"].useCallback(
    function (cb, deps) {
      if (deps === void 0) {
        deps = []
      }

      return React__default["default"].useEffect(function () {
        return monaco && cb(monaco)
      }, [monaco].concat(deps))
    },
    [monaco],
  ) // Cleanup disposables on unmount.

  React__default["default"].useEffect(function () {
    rFirstMount.current = false
    return function () {
      return disposablesRef.current.forEach(function (fn) {
        return fn && fn()
      })
    }
  }, [])
  return {
    monaco: monaco,
    useMonacoEffect: useMonacoEffect,
    defaultEditorOptions: defaultEditorOptions,
    isLoading: isLoading,
  }
} // Helpers

function getPlugins(plugins, languages) {
  return [].concat(
    plugins
      .map(function (plug) {
        return typeof plug === "string" ||
          (Array.isArray(plug) && plug.length === 2)
          ? pluginMap[Array.isArray(plug) ? plug[0] : plug]
            ? pluginMap[Array.isArray(plug) ? plug[0] : plug](
                Array.isArray(plug) ? plug[1] : {},
              )
            : undefined
          : plug
      })
      .filter(Boolean),
    languages
      .map(function (plug) {
        return typeof plug === "string"
          ? basicLanguagePlugins[plug]
            ? basicLanguagePlugins[plug]
            : undefined
          : plug
      })
      .filter(Boolean),
  )
}

var useEditor = function useEditor(_ref) {
  var _ref$options = _ref.options,
    options = _ref$options === void 0 ? {} : _ref$options,
    _ref$onEditorDidMount = _ref.onEditorDidMount,
    onEditorDidMount =
      _ref$onEditorDidMount === void 0 ? noop : _ref$onEditorDidMount,
    model = _ref.model,
    customMonaco = _ref.monaco,
    overrideServices = _ref.overrideServices,
    _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? noop : _ref$onChange
  // const [container, setContainer] = React.useRef<HTMLDivElement>();
  var monacoContext = useMonacoContext()
  var contextMonaco =
    monacoContext === null || monacoContext === void 0
      ? void 0
      : monacoContext.monaco
  var monaco = customMonaco || contextMonaco
  var defaultEditorOptions = React__default["default"].useRef(
    monacoContext === null || monacoContext === void 0
      ? void 0
      : monacoContext.defaultEditorOptions,
  )
  defaultEditorOptions.current =
    monacoContext === null || monacoContext === void 0
      ? void 0
      : monacoContext.defaultEditorOptions

  var _React$useState = React__default["default"].useState(),
    container = _React$useState[0],
    setContainer = _React$useState[1]

  var _useStateWithEffects = useStateWithEffects(),
    editor = _useStateWithEffects[0],
    setEditor = _useStateWithEffects[1],
    useEditorEffect = _useStateWithEffects[2]

  var editorRef = React__default["default"].useRef(editor)
  editorRef.current = editor
  var elWatcher = useElementWatcher(function (el) {
    if (el !== container) {
      setContainer(el)
    }
  })
  var subscriptionRef = React__default["default"].useRef(null)
  React__default["default"].useEffect(
    function () {
      if (!monaco || !container) {
        return
      }

      if (container.getElementsByClassName("monaco-editor").length === 0) {
        var _defaultEditorOptions

        log("[monaco] creating editor", {
          options: options,
          container: container,
        })

        while (container.firstChild) {
          container.removeChild(container.firstChild)
        }

        var monacoEditor = monaco.editor.create(
          container,
          Object.assign(
            {},
            (_defaultEditorOptions = defaultEditorOptions.current) !== null &&
              _defaultEditorOptions !== void 0
              ? _defaultEditorOptions
              : {},
            options,
          ),
          typeof overrideServices === "function"
            ? overrideServices(monaco)
            : overrideServices,
        )
        var didMount = onEditorDidMount(monacoEditor, monaco)
        var userDisposables

        if (didMount && Array.isArray(didMount)) {
          userDisposables = asDisposable(didMount)
        }

        setEditor(monacoEditor)
        return function () {
          if (userDisposables) {
            userDisposables.dispose()
          }
        }
      }
    },
    [monaco, container, setEditor],
  )
  React__default["default"].useEffect(function () {
    return function () {
      if (editor) {
        var _editor$dispose

        editor === null || editor === void 0
          ? void 0
          : (_editor$dispose = editor.dispose) === null ||
            _editor$dispose === void 0
          ? void 0
          : _editor$dispose.call(editor)
      }
    }
  }, [])
  useEditorEffect(
    function (editor) {
      if (model) {
        editor.setModel(model)
      }
    },
    [model],
  )
  useEditorEffect(
    function (editor) {
      subscriptionRef.current = editor.onDidChangeModelContent(function (
        event,
      ) {
        if (editor) {
          onChange(
            editor === null || editor === void 0 ? void 0 : editor.getValue(),
            editor,
            event,
            monaco,
          )
        }
      })
      return function () {
        if (subscriptionRef.current) {
          subscriptionRef.current.dispose()
        }
      }
    },
    [onChange],
  )
  useDeepCompareEffect(
    function () {
      if (editor) {
        editor.updateOptions(options)
      }
    },
    [options],
    [editor],
  )
  return {
    containerRef: elWatcher,
    useEditorEffect: useEditorEffect,
    editor: editor,
  }
}

function useElementWatcher(watcher) {
  var lastRef = React__default["default"].useRef(null)
  var elRef = React__default["default"].useRef(function (el) {
    var _lastRef$current
    ;(_lastRef$current = lastRef.current) === null ||
    _lastRef$current === void 0
      ? void 0
      : _lastRef$current.call(lastRef)
    lastRef.current = el ? watcher(el) : null
  })
  return elRef.current
}

function useStateWithEffects() {
  var _React$useState2 = React__default["default"].useState(),
    state = _React$useState2[0],
    setState = _React$useState2[1]

  var useStateEffect = function useStateEffect(effect, deps) {
    React__default["default"].useEffect(function () {
      if (state) {
        return effect(state)
      }
    }, [state].concat(deps))
  }

  return [state, setState, useStateEffect]
}

function findMonacoModel(monaco, path) {
  return monaco === null || monaco === void 0
    ? void 0
    : monaco.editor.getModel(monaco.Uri.file(fixPath(path)))
}

function initializeMonacoModel(monaco, modelPath, value, language) {
  modelPath = fixPath(modelPath)
  var model = findMonacoModel(monaco, modelPath)

  if (model) {
    // If a model exists, we need to update it's value
    // This is needed because the content for the file might have been modified externally
    // Use `pushEditOperations` instead of `setValue` or `applyEdits` to preserve undo stack
    if (value) {
      model.pushEditOperations(
        [],
        [
          {
            range: model.getFullModelRange(),
            text: value,
          },
        ],
        function () {
          return null
        },
      )
    }
  } else {
    var _model

    log("[monaco] creating model:", modelPath, {
      value: value,
      language: language,
    })
    model =
      monaco === null || monaco === void 0
        ? void 0
        : monaco.editor.createModel(
            value || "",
            language,
            monaco === null || monaco === void 0
              ? void 0
              : monaco.Uri.file(modelPath),
          )
    ;(_model = model) === null || _model === void 0
      ? void 0
      : _model.updateOptions({
          tabSize: 2,
          insertSpaces: true,
        })
  }

  return model
}

var useTextModel = function useTextModel(_ref) {
  var _useMonacoContext,
    _path,
    _ref2,
    _monaco$languages$get,
    _monaco$languages$get2

  var customMonaco = _ref.monaco,
    contents = _ref.contents,
    language = _ref.language,
    _ref$modelOptions = _ref.modelOptions,
    modelOptions = _ref$modelOptions === void 0 ? {} : _ref$modelOptions,
    _ref$onChange = _ref.onChange,
    onChange = _ref$onChange === void 0 ? noop : _ref$onChange,
    _ref$defaultContents = _ref.defaultContents,
    defaultContents =
      _ref$defaultContents === void 0 ? "" : _ref$defaultContents,
    path = _ref.path
  var contextMonaco =
    (_useMonacoContext = useMonacoContext()) === null ||
    _useMonacoContext === void 0
      ? void 0
      : _useMonacoContext.monaco
  var monaco = customMonaco || contextMonaco
  path =
    (_path = path) !== null && _path !== void 0
      ? _path
      : "model" +
        ((_ref2 =
          monaco === null || monaco === void 0
            ? void 0
            : (_monaco$languages$get = monaco.languages
                .getLanguages()
                .find(function (l) {
                  return l.id === language
                })) === null || _monaco$languages$get === void 0
            ? void 0
            : (_monaco$languages$get2 = _monaco$languages$get.extensions) ===
                null || _monaco$languages$get2 === void 0
            ? void 0
            : _monaco$languages$get2[0]) !== null && _ref2 !== void 0
          ? _ref2
          : ".js")
  var modelPath = fixPath(path)

  var _React$useState = React__default["default"].useState(),
    model = _React$useState[0],
    setModel = _React$useState[1]

  var resolvedContents = contents != null ? contents : defaultContents
  var resolvedContentsRef = React__default["default"].useRef(resolvedContents)
  resolvedContentsRef.current = resolvedContents
  React__default["default"].useEffect(
    function () {
      if (monaco) {
        var _model2 = initializeMonacoModel(
          monaco,
          modelPath,
          resolvedContentsRef.current,
        )

        if (_model2) {
          setModel(_model2)
        }
      }
    },
    [monaco, modelPath],
  )
  React__default["default"].useEffect(
    function () {
      if (model) {
        var disposable = model.onDidChangeContent(function (event) {
          onChange(model.getValue(), event, model)
        })
        return function () {
          var _disposable$dispose

          disposable === null || disposable === void 0
            ? void 0
            : (_disposable$dispose = disposable.dispose) === null ||
              _disposable$dispose === void 0
            ? void 0
            : _disposable$dispose.call(disposable)
        }
      }
    },
    [model, onChange],
  )
  React__default["default"].useEffect(
    function () {
      if (!monaco || !language) {
        return
      }

      if (model) {
        log("[monaco] setting language for " + model.uri.path + ": " + language)
        monaco.editor.setModelLanguage(model, language)
      }
    },
    [monaco, model, language],
  )
  React__default["default"].useEffect(
    function () {
      var value = resolvedContents

      if (model && value && value !== model.getValue()) {
        model.pushEditOperations(
          [],
          [
            {
              range: model.getFullModelRange(),
              text: value,
            },
          ],
          function () {
            return null
          },
        )
      }
    },
    [model, resolvedContents],
  )
  useDeepCompareEffect(
    function () {
      if (model) {
        model.updateOptions(modelOptions)
      }
    },
    [modelOptions],
    [model],
  )
  return model
}

var useMonacoEditor = function useMonacoEditor(_ref) {
  var _loaderOptions$langua, _loaderOptions$langua2

  if (_ref === void 0) {
    _ref = {}
  }

  var _ref2 = _ref,
    modelOptions = _ref2.modelOptions,
    path = _ref2.path,
    defaultContents = _ref2.defaultContents,
    contents = _ref2.contents,
    language = _ref2.language,
    onEditorDidMount = _ref2.onEditorDidMount,
    options = _ref2.options,
    overrideServices = _ref2.overrideServices,
    onChange = _ref2.onChange,
    loaderOptions = _objectWithoutPropertiesLoose(_ref2, [
      "modelOptions",
      "path",
      "defaultContents",
      "contents",
      "language",
      "onEditorDidMount",
      "options",
      "overrideServices",
      "onChange",
    ])

  var _useMonaco = useMonaco(
      Object.assign({}, loaderOptions, {
        languages: ((_loaderOptions$langua =
          loaderOptions === null || loaderOptions === void 0
            ? void 0
            : loaderOptions.languages) !== null &&
        _loaderOptions$langua !== void 0
          ? _loaderOptions$langua
          : []
        ).includes(language)
          ? loaderOptions === null || loaderOptions === void 0
            ? void 0
            : loaderOptions.languages
          : [].concat(
              (_loaderOptions$langua2 =
                loaderOptions === null || loaderOptions === void 0
                  ? void 0
                  : loaderOptions.languages) !== null &&
                _loaderOptions$langua2 !== void 0
                ? _loaderOptions$langua2
                : [],
              [language],
            ),
      }),
    ),
    monaco = _useMonaco.monaco,
    isLoading = _useMonaco.isLoading

  var model = useTextModel({
    path: path,
    contents: contents,
    defaultContents: defaultContents,
    language: language,
    modelOptions: modelOptions,
    monaco: monaco,
  })

  var _useEditor = useEditor({
      model: model,
      monaco: monaco,
      onEditorDidMount: onEditorDidMount,
      onChange: onChange,
      overrideServices: overrideServices,
      options: options,
    }),
    containerRef = _useEditor.containerRef,
    editor = _useEditor.editor

  return {
    monaco: monaco,
    isLoading: isLoading,
    model: model,
    containerRef: containerRef,
    editor: editor,
  }
}

function withMonaco(config, Component) {
  return function (_ref) {
    var props = _extends({}, _ref)

    return /*#__PURE__*/ React__default["default"].createElement(
      MonacoProvider,
      config,
      /*#__PURE__*/ React__default["default"].createElement(Component, props),
    )
  }
}

var prefix = "use-monaco:"
function useLocalStorage(key, initialValue) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  var _useState = React.useState(function () {
      try {
        // Get from local storage by key
        var item =
          typeof window !== "undefined"
            ? window.localStorage.getItem(prefix + key) || initialValue
            : initialValue // Parse stored json or if none return initialValue

        return JSON.parse(item)
      } catch (error) {
        // If error also return initialValue
        return initialValue
      }
    }),
    storedValue = _useState[0],
    setStoredValue = _useState[1] // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to sessionStorage.

  var setValue = function setValue(value) {
    try {
      // Allow value to be a function so we have same API as useState
      var valueToStore = value instanceof Function ? value(storedValue) : value // Save state

      setStoredValue(valueToStore) // Save to local storage

      if (typeof window !== "undefined")
        window.localStorage.setItem(prefix + key, JSON.stringify(valueToStore))
    } catch (error) {
      // A more advanced implementation would handle the error case
      log(error)
    }
  }

  return [storedValue, setValue]
}

Object.keys(useDebounce).forEach(function (k) {
  if (k !== "default")
    Object.defineProperty(exports, k, {
      enumerable: true,
      get: function () {
        return useDebounce[k]
      },
    })
})
exports.MonacoLoader = MonacoLoader
exports.MonacoProvider = MonacoProvider
exports.asDisposable = asDisposable
exports.basicLanguagePlugins = basicLanguagePlugins
exports.basicLanguages = basicLanguages
exports.compose = compose
exports.createPlugin = createPlugin
exports.createRemotePlugin = createRemotePlugin
exports.disposeAll = disposeAll
exports.endingSlash = endingSlash
exports.fixPath = fixPath
exports.knonwLanguageServices = knonwLanguageServices
exports.knownBasicLanguages = knownBasicLanguages
exports.languageServiceAliases = languageServiceAliases
exports.loadMonaco = loadMonaco
exports.monacoLoader = monacoLoader
exports.noEndingSlash = noEndingSlash
exports.noop = noop
exports.parseJSONWithComments = parseJSONWithComments
exports.plugins = index
exports.processDimensions = processDimensions
exports.processSize = processSize
exports.useEditor = useEditor
exports.useLocalStorage = useLocalStorage
exports.useMonaco = useMonaco
exports.useMonacoContext = useMonacoContext
exports.useMonacoEditor = useMonacoEditor
exports.useTextModel = useTextModel
exports.version = version
exports.withMonaco = withMonaco
//# sourceMappingURL=use-monaco.js.map
