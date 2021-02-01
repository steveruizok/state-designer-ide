"use strict"
function _optionalChain(ops) {
  let lastAccessLHS = undefined
  let value = ops[0]
  let i = 1
  while (i < ops.length) {
    const op = ops[i]
    const fn = ops[i + 1]
    i += 2
    if ((op === "optionalAccess" || op === "optionalCall") && value == null) {
      return undefined
    }
    if (op === "access" || op === "optionalAccess") {
      lastAccessLHS = value
      value = fn(value)
    } else if (op === "call" || op === "optionalCall") {
      value = fn((...args) => value.call(lastAccessLHS, ...args))
      lastAccessLHS = undefined
    }
  }
  return value
}
var __create = Object.create
var __defProp = Object.defineProperty
var __getProtoOf = Object.getPrototypeOf
var __hasOwnProp = Object.prototype.hasOwnProperty
var __getOwnPropNames = Object.getOwnPropertyNames
var __getOwnPropDesc = Object.getOwnPropertyDescriptor
var __markAsModule = (target) =>
  __defProp(target, "__esModule", { value: true })
var __commonJS = (callback, module) => () => {
  if (!module) {
    module = { exports: {} }
    callback(module.exports, module)
  }
  return module.exports
}
var __export = (target, all) => {
  __markAsModule(target)
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true })
}
var __exportStar = (target, module, desc) => {
  __markAsModule(target)
  if ((module && typeof module === "object") || typeof module === "function") {
    for (let key of __getOwnPropNames(module))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {
          get: () => module[key],
          enumerable:
            !(desc = __getOwnPropDesc(module, key)) || desc.enumerable,
        })
  }
  return target
}
var __toModule = (module) => {
  if (module && module.__esModule) return module
  return __exportStar(
    __defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", {
      value: module,
      enumerable: true,
    }),
    module,
  )
}

// node_modules/is-plain-obj/index.js
var require_is_plain_obj = __commonJS((exports, module) => {
  "use strict"
  var toString = Object.prototype.toString
  module.exports = function (x) {
    var prototype
    return (
      toString.call(x) === "[object Object]" &&
      ((prototype = Object.getPrototypeOf(x)),
      prototype === null || prototype === Object.getPrototypeOf({}))
    )
  }
})

// node_modules/arrify/index.js
var require_arrify = __commonJS((exports, module) => {
  "use strict"
  module.exports = function (val) {
    if (val === null || val === void 0) {
      return []
    }
    return Array.isArray(val) ? val : [val]
  }
})

// node_modules/kind-of/index.js
var require_kind_of = __commonJS((exports, module) => {
  var toString = Object.prototype.toString
  module.exports = function kindOf(val) {
    if (val === void 0) return "undefined"
    if (val === null) return "null"
    var type = typeof val
    if (type === "boolean") return "boolean"
    if (type === "string") return "string"
    if (type === "number") return "number"
    if (type === "symbol") return "symbol"
    if (type === "function") {
      return isGeneratorFn(val) ? "generatorfunction" : "function"
    }
    if (isArray(val)) return "array"
    if (isBuffer(val)) return "buffer"
    if (isArguments(val)) return "arguments"
    if (isDate(val)) return "date"
    if (isError(val)) return "error"
    if (isRegexp(val)) return "regexp"
    switch (ctorName(val)) {
      case "Symbol":
        return "symbol"
      case "Promise":
        return "promise"
      case "WeakMap":
        return "weakmap"
      case "WeakSet":
        return "weakset"
      case "Map":
        return "map"
      case "Set":
        return "set"
      case "Int8Array":
        return "int8array"
      case "Uint8Array":
        return "uint8array"
      case "Uint8ClampedArray":
        return "uint8clampedarray"
      case "Int16Array":
        return "int16array"
      case "Uint16Array":
        return "uint16array"
      case "Int32Array":
        return "int32array"
      case "Uint32Array":
        return "uint32array"
      case "Float32Array":
        return "float32array"
      case "Float64Array":
        return "float64array"
    }
    if (isGeneratorObj(val)) {
      return "generator"
    }
    type = toString.call(val)
    switch (type) {
      case "[object Object]":
        return "object"
      case "[object Map Iterator]":
        return "mapiterator"
      case "[object Set Iterator]":
        return "setiterator"
      case "[object String Iterator]":
        return "stringiterator"
      case "[object Array Iterator]":
        return "arrayiterator"
    }
    return type.slice(8, -1).toLowerCase().replace(/\s/g, "")
  }
  function ctorName(val) {
    return typeof val.constructor === "function" ? val.constructor.name : null
  }
  function isArray(val) {
    if (Array.isArray) return Array.isArray(val)
    return val instanceof Array
  }
  function isError(val) {
    return (
      val instanceof Error ||
      (typeof val.message === "string" &&
        val.constructor &&
        typeof val.constructor.stackTraceLimit === "number")
    )
  }
  function isDate(val) {
    if (val instanceof Date) return true
    return (
      typeof val.toDateString === "function" &&
      typeof val.getDate === "function" &&
      typeof val.setDate === "function"
    )
  }
  function isRegexp(val) {
    if (val instanceof RegExp) return true
    return (
      typeof val.flags === "string" &&
      typeof val.ignoreCase === "boolean" &&
      typeof val.multiline === "boolean" &&
      typeof val.global === "boolean"
    )
  }
  function isGeneratorFn(name, val) {
    return ctorName(name) === "GeneratorFunction"
  }
  function isGeneratorObj(val) {
    return (
      typeof val.throw === "function" &&
      typeof val.return === "function" &&
      typeof val.next === "function"
    )
  }
  function isArguments(val) {
    try {
      if (typeof val.length === "number" && typeof val.callee === "function") {
        return true
      }
    } catch (err) {
      if (err.message.indexOf("callee") !== -1) {
        return true
      }
    }
    return false
  }
  function isBuffer(val) {
    if (val.constructor && typeof val.constructor.isBuffer === "function") {
      return val.constructor.isBuffer(val)
    }
    return false
  }
})

// node_modules/minimist-options/index.js
var require_minimist_options = __commonJS((exports, module) => {
  "use strict"
  var isPlainObject = require_is_plain_obj()
  var arrify = require_arrify()
  var kindOf = require_kind_of()
  var push = (obj, prop, value) => {
    if (!obj[prop]) {
      obj[prop] = []
    }
    obj[prop].push(value)
  }
  var insert = (obj, prop, key, value) => {
    if (!obj[prop]) {
      obj[prop] = {}
    }
    obj[prop][key] = value
  }
  var prettyPrint = (output) => {
    return Array.isArray(output)
      ? `[${output.map(prettyPrint).join(", ")}]`
      : kindOf(output) === "string"
      ? JSON.stringify(output)
      : output
  }
  var resolveType = (value) => {
    if (Array.isArray(value) && value.length > 0) {
      const [element] = value
      return `${kindOf(element)}-array`
    }
    return kindOf(value)
  }
  var normalizeExpectedType = (type, defaultValue) => {
    const inferredType = type === "array" ? "string-array" : type
    if (
      arrayTypes.includes(inferredType) &&
      Array.isArray(defaultValue) &&
      defaultValue.length === 0
    ) {
      return "array"
    }
    return inferredType
  }
  var passthroughOptions = ["stopEarly", "unknown", "--"]
  var primitiveTypes = ["string", "boolean", "number"]
  var arrayTypes = primitiveTypes.map((t) => `${t}-array`)
  var availableTypes = [...primitiveTypes, "array", ...arrayTypes]
  var buildOptions = (options) => {
    options = options || {}
    const result = {}
    passthroughOptions.forEach((key) => {
      if (options[key]) {
        result[key] = options[key]
      }
    })
    Object.keys(options).forEach((key) => {
      let value = options[key]
      if (key === "arguments") {
        key = "_"
      }
      if (typeof value === "string") {
        value = { type: value }
      }
      if (isPlainObject(value)) {
        const props = value
        const { type } = props
        if (type) {
          if (!availableTypes.includes(type)) {
            throw new TypeError(
              `Expected type of "${key}" to be one of ${prettyPrint(
                availableTypes,
              )}, got ${prettyPrint(type)}`,
            )
          }
          if (arrayTypes.includes(type)) {
            const [elementType] = type.split("-")
            push(result, "array", { key, [elementType]: true })
          } else {
            push(result, type, key)
          }
        }
        if ({}.hasOwnProperty.call(props, "default")) {
          const { default: defaultValue } = props
          const defaultType = resolveType(defaultValue)
          const expectedType = normalizeExpectedType(type, defaultValue)
          if (expectedType && expectedType !== defaultType) {
            throw new TypeError(
              `Expected "${key}" default value to be of type "${expectedType}", got ${prettyPrint(
                defaultType,
              )}`,
            )
          }
          insert(result, "default", key, defaultValue)
        }
        arrify(props.alias).forEach((alias) => {
          insert(result, "alias", alias, key)
        })
      }
    })
    return result
  }
  module.exports = buildOptions
  module.exports.default = buildOptions
})

// node_modules/yargs-parser/build/index.cjs
var require_build = __commonJS((exports, module) => {
  "use strict"
  var util = require("util")
  var fs = require("fs")
  var path = require("path")
  function camelCase(str) {
    str = str.toLocaleLowerCase()
    if (str.indexOf("-") === -1 && str.indexOf("_") === -1) {
      return str
    } else {
      let camelcase = ""
      let nextChrUpper = false
      const leadingHyphens = str.match(/^-+/)
      for (
        let i = leadingHyphens ? leadingHyphens[0].length : 0;
        i < str.length;
        i++
      ) {
        let chr = str.charAt(i)
        if (nextChrUpper) {
          nextChrUpper = false
          chr = chr.toLocaleUpperCase()
        }
        if (i !== 0 && (chr === "-" || chr === "_")) {
          nextChrUpper = true
          continue
        } else if (chr !== "-" && chr !== "_") {
          camelcase += chr
        }
      }
      return camelcase
    }
  }
  function decamelize(str, joinString) {
    const lowercase = str.toLocaleLowerCase()
    joinString = joinString || "-"
    let notCamelcase = ""
    for (let i = 0; i < str.length; i++) {
      const chrLower = lowercase.charAt(i)
      const chrString = str.charAt(i)
      if (chrLower !== chrString && i > 0) {
        notCamelcase += `${joinString}${lowercase.charAt(i)}`
      } else {
        notCamelcase += chrString
      }
    }
    return notCamelcase
  }
  function looksLikeNumber(x) {
    if (x === null || x === void 0) return false
    if (typeof x === "number") return true
    if (/^0x[0-9a-f]+$/i.test(x)) return true
    if (x.length > 1 && x[0] === "0") return false
    return /^[-]?(?:\d+(?:\.\d*)?|\.\d+)(e[-+]?\d+)?$/.test(x)
  }
  function tokenizeArgString(argString) {
    if (Array.isArray(argString)) {
      return argString.map((e) => (typeof e !== "string" ? e + "" : e))
    }
    argString = argString.trim()
    let i = 0
    let prevC = null
    let c = null
    let opening = null
    const args = []
    for (let ii = 0; ii < argString.length; ii++) {
      prevC = c
      c = argString.charAt(ii)
      if (c === " " && !opening) {
        if (!(prevC === " ")) {
          i++
        }
        continue
      }
      if (c === opening) {
        opening = null
      } else if ((c === "'" || c === '"') && !opening) {
        opening = c
      }
      if (!args[i]) args[i] = ""
      args[i] += c
    }
    return args
  }
  var mixin
  var YargsParser = class {
    constructor(_mixin) {
      mixin = _mixin
    }
    parse(argsInput, options) {
      const opts = Object.assign(
        {
          alias: void 0,
          array: void 0,
          boolean: void 0,
          config: void 0,
          configObjects: void 0,
          configuration: void 0,
          coerce: void 0,
          count: void 0,
          default: void 0,
          envPrefix: void 0,
          narg: void 0,
          normalize: void 0,
          string: void 0,
          number: void 0,
          __: void 0,
          key: void 0,
        },
        options,
      )
      const args = tokenizeArgString(argsInput)
      const aliases = combineAliases(
        Object.assign(Object.create(null), opts.alias),
      )
      const configuration = Object.assign(
        {
          "boolean-negation": true,
          "camel-case-expansion": true,
          "combine-arrays": false,
          "dot-notation": true,
          "duplicate-arguments-array": true,
          "flatten-duplicate-arrays": true,
          "greedy-arrays": true,
          "halt-at-non-option": false,
          "nargs-eats-options": false,
          "negation-prefix": "no-",
          "parse-numbers": true,
          "parse-positional-numbers": true,
          "populate--": false,
          "set-placeholder-key": false,
          "short-option-groups": true,
          "strip-aliased": false,
          "strip-dashed": false,
          "unknown-options-as-args": false,
        },
        opts.configuration,
      )
      const defaults = Object.assign(Object.create(null), opts.default)
      const configObjects = opts.configObjects || []
      const envPrefix = opts.envPrefix
      const notFlagsOption = configuration["populate--"]
      const notFlagsArgv = notFlagsOption ? "--" : "_"
      const newAliases = Object.create(null)
      const defaulted = Object.create(null)
      const __ = opts.__ || mixin.format
      const flags = {
        aliases: Object.create(null),
        arrays: Object.create(null),
        bools: Object.create(null),
        strings: Object.create(null),
        numbers: Object.create(null),
        counts: Object.create(null),
        normalize: Object.create(null),
        configs: Object.create(null),
        nargs: Object.create(null),
        coercions: Object.create(null),
        keys: [],
      }
      const negative = /^-([0-9]+(\.[0-9]+)?|\.[0-9]+)$/
      const negatedBoolean = new RegExp(
        "^--" + configuration["negation-prefix"] + "(.+)",
      )
      ;[]
        .concat(opts.array || [])
        .filter(Boolean)
        .forEach(function (opt) {
          const key = typeof opt === "object" ? opt.key : opt
          const assignment = Object.keys(opt)
            .map(function (key2) {
              const arrayFlagKeys = {
                boolean: "bools",
                string: "strings",
                number: "numbers",
              }
              return arrayFlagKeys[key2]
            })
            .filter(Boolean)
            .pop()
          if (assignment) {
            flags[assignment][key] = true
          }
          flags.arrays[key] = true
          flags.keys.push(key)
        })
      ;[]
        .concat(opts.boolean || [])
        .filter(Boolean)
        .forEach(function (key) {
          flags.bools[key] = true
          flags.keys.push(key)
        })
      ;[]
        .concat(opts.string || [])
        .filter(Boolean)
        .forEach(function (key) {
          flags.strings[key] = true
          flags.keys.push(key)
        })
      ;[]
        .concat(opts.number || [])
        .filter(Boolean)
        .forEach(function (key) {
          flags.numbers[key] = true
          flags.keys.push(key)
        })
      ;[]
        .concat(opts.count || [])
        .filter(Boolean)
        .forEach(function (key) {
          flags.counts[key] = true
          flags.keys.push(key)
        })
      ;[]
        .concat(opts.normalize || [])
        .filter(Boolean)
        .forEach(function (key) {
          flags.normalize[key] = true
          flags.keys.push(key)
        })
      if (typeof opts.narg === "object") {
        Object.entries(opts.narg).forEach(([key, value]) => {
          if (typeof value === "number") {
            flags.nargs[key] = value
            flags.keys.push(key)
          }
        })
      }
      if (typeof opts.coerce === "object") {
        Object.entries(opts.coerce).forEach(([key, value]) => {
          if (typeof value === "function") {
            flags.coercions[key] = value
            flags.keys.push(key)
          }
        })
      }
      if (typeof opts.config !== "undefined") {
        if (Array.isArray(opts.config) || typeof opts.config === "string") {
          ;[]
            .concat(opts.config)
            .filter(Boolean)
            .forEach(function (key) {
              flags.configs[key] = true
            })
        } else if (typeof opts.config === "object") {
          Object.entries(opts.config).forEach(([key, value]) => {
            if (typeof value === "boolean" || typeof value === "function") {
              flags.configs[key] = value
            }
          })
        }
      }
      extendAliases(opts.key, aliases, opts.default, flags.arrays)
      Object.keys(defaults).forEach(function (key) {
        ;(flags.aliases[key] || []).forEach(function (alias) {
          defaults[alias] = defaults[key]
        })
      })
      let error = null
      checkConfiguration()
      let notFlags = []
      const argv = Object.assign(Object.create(null), { _: [] })
      const argvReturn = {}
      for (let i = 0; i < args.length; i++) {
        const arg = args[i]
        let broken
        let key
        let letters
        let m
        let next
        let value
        if (arg !== "--" && isUnknownOptionAsArg(arg)) {
          pushPositional(arg)
        } else if (
          arg.match(/^--.+=/) ||
          (!configuration["short-option-groups"] && arg.match(/^-.+=/))
        ) {
          m = arg.match(/^--?([^=]+)=([\s\S]*)$/)
          if (m !== null && Array.isArray(m) && m.length >= 3) {
            if (checkAllAliases(m[1], flags.arrays)) {
              i = eatArray(i, m[1], args, m[2])
            } else if (checkAllAliases(m[1], flags.nargs) !== false) {
              i = eatNargs(i, m[1], args, m[2])
            } else {
              setArg(m[1], m[2])
            }
          }
        } else if (
          arg.match(negatedBoolean) &&
          configuration["boolean-negation"]
        ) {
          m = arg.match(negatedBoolean)
          if (m !== null && Array.isArray(m) && m.length >= 2) {
            key = m[1]
            setArg(key, checkAllAliases(key, flags.arrays) ? [false] : false)
          }
        } else if (
          arg.match(/^--.+/) ||
          (!configuration["short-option-groups"] && arg.match(/^-[^-]+/))
        ) {
          m = arg.match(/^--?(.+)/)
          if (m !== null && Array.isArray(m) && m.length >= 2) {
            key = m[1]
            if (checkAllAliases(key, flags.arrays)) {
              i = eatArray(i, key, args)
            } else if (checkAllAliases(key, flags.nargs) !== false) {
              i = eatNargs(i, key, args)
            } else {
              next = args[i + 1]
              if (
                next !== void 0 &&
                (!next.match(/^-/) || next.match(negative)) &&
                !checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts)
              ) {
                setArg(key, next)
                i++
              } else if (/^(true|false)$/.test(next)) {
                setArg(key, next)
                i++
              } else {
                setArg(key, defaultValue(key))
              }
            }
          }
        } else if (arg.match(/^-.\..+=/)) {
          m = arg.match(/^-([^=]+)=([\s\S]*)$/)
          if (m !== null && Array.isArray(m) && m.length >= 3) {
            setArg(m[1], m[2])
          }
        } else if (arg.match(/^-.\..+/) && !arg.match(negative)) {
          next = args[i + 1]
          m = arg.match(/^-(.\..+)/)
          if (m !== null && Array.isArray(m) && m.length >= 2) {
            key = m[1]
            if (
              next !== void 0 &&
              !next.match(/^-/) &&
              !checkAllAliases(key, flags.bools) &&
              !checkAllAliases(key, flags.counts)
            ) {
              setArg(key, next)
              i++
            } else {
              setArg(key, defaultValue(key))
            }
          }
        } else if (arg.match(/^-[^-]+/) && !arg.match(negative)) {
          letters = arg.slice(1, -1).split("")
          broken = false
          for (let j = 0; j < letters.length; j++) {
            next = arg.slice(j + 2)
            if (letters[j + 1] && letters[j + 1] === "=") {
              value = arg.slice(j + 3)
              key = letters[j]
              if (checkAllAliases(key, flags.arrays)) {
                i = eatArray(i, key, args, value)
              } else if (checkAllAliases(key, flags.nargs) !== false) {
                i = eatNargs(i, key, args, value)
              } else {
                setArg(key, value)
              }
              broken = true
              break
            }
            if (next === "-") {
              setArg(letters[j], next)
              continue
            }
            if (
              /[A-Za-z]/.test(letters[j]) &&
              /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next) &&
              checkAllAliases(next, flags.bools) === false
            ) {
              setArg(letters[j], next)
              broken = true
              break
            }
            if (letters[j + 1] && letters[j + 1].match(/\W/)) {
              setArg(letters[j], next)
              broken = true
              break
            } else {
              setArg(letters[j], defaultValue(letters[j]))
            }
          }
          key = arg.slice(-1)[0]
          if (!broken && key !== "-") {
            if (checkAllAliases(key, flags.arrays)) {
              i = eatArray(i, key, args)
            } else if (checkAllAliases(key, flags.nargs) !== false) {
              i = eatNargs(i, key, args)
            } else {
              next = args[i + 1]
              if (
                next !== void 0 &&
                (!/^(-|--)[^-]/.test(next) || next.match(negative)) &&
                !checkAllAliases(key, flags.bools) &&
                !checkAllAliases(key, flags.counts)
              ) {
                setArg(key, next)
                i++
              } else if (/^(true|false)$/.test(next)) {
                setArg(key, next)
                i++
              } else {
                setArg(key, defaultValue(key))
              }
            }
          }
        } else if (
          arg.match(/^-[0-9]$/) &&
          arg.match(negative) &&
          checkAllAliases(arg.slice(1), flags.bools)
        ) {
          key = arg.slice(1)
          setArg(key, defaultValue(key))
        } else if (arg === "--") {
          notFlags = args.slice(i + 1)
          break
        } else if (configuration["halt-at-non-option"]) {
          notFlags = args.slice(i)
          break
        } else {
          pushPositional(arg)
        }
      }
      applyEnvVars(argv, true)
      applyEnvVars(argv, false)
      setConfig(argv)
      setConfigObjects()
      applyDefaultsAndAliases(argv, flags.aliases, defaults, true)
      applyCoercions(argv)
      if (configuration["set-placeholder-key"]) setPlaceholderKeys(argv)
      Object.keys(flags.counts).forEach(function (key) {
        if (!hasKey(argv, key.split("."))) setArg(key, 0)
      })
      if (notFlagsOption && notFlags.length) argv[notFlagsArgv] = []
      notFlags.forEach(function (key) {
        argv[notFlagsArgv].push(key)
      })
      if (
        configuration["camel-case-expansion"] &&
        configuration["strip-dashed"]
      ) {
        Object.keys(argv)
          .filter((key) => key !== "--" && key.includes("-"))
          .forEach((key) => {
            delete argv[key]
          })
      }
      if (configuration["strip-aliased"]) {
        ;[]
          .concat(...Object.keys(aliases).map((k) => aliases[k]))
          .forEach((alias) => {
            if (configuration["camel-case-expansion"] && alias.includes("-")) {
              delete argv[
                alias
                  .split(".")
                  .map((prop) => camelCase(prop))
                  .join(".")
              ]
            }
            delete argv[alias]
          })
      }
      function pushPositional(arg) {
        const maybeCoercedNumber = maybeCoerceNumber("_", arg)
        if (
          typeof maybeCoercedNumber === "string" ||
          typeof maybeCoercedNumber === "number"
        ) {
          argv._.push(maybeCoercedNumber)
        }
      }
      function eatNargs(i, key, args2, argAfterEqualSign) {
        let ii
        let toEat = checkAllAliases(key, flags.nargs)
        toEat = typeof toEat !== "number" || isNaN(toEat) ? 1 : toEat
        if (toEat === 0) {
          if (!isUndefined(argAfterEqualSign)) {
            error = Error(__("Argument unexpected for: %s", key))
          }
          setArg(key, defaultValue(key))
          return i
        }
        let available = isUndefined(argAfterEqualSign) ? 0 : 1
        if (configuration["nargs-eats-options"]) {
          if (args2.length - (i + 1) + available < toEat) {
            error = Error(__("Not enough arguments following: %s", key))
          }
          available = toEat
        } else {
          for (ii = i + 1; ii < args2.length; ii++) {
            if (
              !args2[ii].match(/^-[^0-9]/) ||
              args2[ii].match(negative) ||
              isUnknownOptionAsArg(args2[ii])
            )
              available++
            else break
          }
          if (available < toEat)
            error = Error(__("Not enough arguments following: %s", key))
        }
        let consumed = Math.min(available, toEat)
        if (!isUndefined(argAfterEqualSign) && consumed > 0) {
          setArg(key, argAfterEqualSign)
          consumed--
        }
        for (ii = i + 1; ii < consumed + i + 1; ii++) {
          setArg(key, args2[ii])
        }
        return i + consumed
      }
      function eatArray(i, key, args2, argAfterEqualSign) {
        let argsToSet = []
        let next = argAfterEqualSign || args2[i + 1]
        const nargsCount = checkAllAliases(key, flags.nargs)
        if (checkAllAliases(key, flags.bools) && !/^(true|false)$/.test(next)) {
          argsToSet.push(true)
        } else if (
          isUndefined(next) ||
          (isUndefined(argAfterEqualSign) &&
            /^-/.test(next) &&
            !negative.test(next) &&
            !isUnknownOptionAsArg(next))
        ) {
          if (defaults[key] !== void 0) {
            const defVal = defaults[key]
            argsToSet = Array.isArray(defVal) ? defVal : [defVal]
          }
        } else {
          if (!isUndefined(argAfterEqualSign)) {
            argsToSet.push(processValue(key, argAfterEqualSign))
          }
          for (let ii = i + 1; ii < args2.length; ii++) {
            if (
              (!configuration["greedy-arrays"] && argsToSet.length > 0) ||
              (nargsCount &&
                typeof nargsCount === "number" &&
                argsToSet.length >= nargsCount)
            )
              break
            next = args2[ii]
            if (
              /^-/.test(next) &&
              !negative.test(next) &&
              !isUnknownOptionAsArg(next)
            )
              break
            i = ii
            argsToSet.push(processValue(key, next))
          }
        }
        if (
          typeof nargsCount === "number" &&
          ((nargsCount && argsToSet.length < nargsCount) ||
            (isNaN(nargsCount) && argsToSet.length === 0))
        ) {
          error = Error(__("Not enough arguments following: %s", key))
        }
        setArg(key, argsToSet)
        return i
      }
      function setArg(key, val) {
        if (/-/.test(key) && configuration["camel-case-expansion"]) {
          const alias = key
            .split(".")
            .map(function (prop) {
              return camelCase(prop)
            })
            .join(".")
          addNewAlias(key, alias)
        }
        const value = processValue(key, val)
        const splitKey = key.split(".")
        setKey(argv, splitKey, value)
        if (flags.aliases[key]) {
          flags.aliases[key].forEach(function (x) {
            const keyProperties = x.split(".")
            setKey(argv, keyProperties, value)
          })
        }
        if (splitKey.length > 1 && configuration["dot-notation"]) {
          ;(flags.aliases[splitKey[0]] || []).forEach(function (x) {
            let keyProperties = x.split(".")
            const a = [].concat(splitKey)
            a.shift()
            keyProperties = keyProperties.concat(a)
            if (!(flags.aliases[key] || []).includes(keyProperties.join("."))) {
              setKey(argv, keyProperties, value)
            }
          })
        }
        if (
          checkAllAliases(key, flags.normalize) &&
          !checkAllAliases(key, flags.arrays)
        ) {
          const keys = [key].concat(flags.aliases[key] || [])
          keys.forEach(function (key2) {
            Object.defineProperty(argvReturn, key2, {
              enumerable: true,
              get() {
                return val
              },
              set(value2) {
                val =
                  typeof value2 === "string" ? mixin.normalize(value2) : value2
              },
            })
          })
        }
      }
      function addNewAlias(key, alias) {
        if (!(flags.aliases[key] && flags.aliases[key].length)) {
          flags.aliases[key] = [alias]
          newAliases[alias] = true
        }
        if (!(flags.aliases[alias] && flags.aliases[alias].length)) {
          addNewAlias(alias, key)
        }
      }
      function processValue(key, val) {
        if (
          typeof val === "string" &&
          (val[0] === "'" || val[0] === '"') &&
          val[val.length - 1] === val[0]
        ) {
          val = val.substring(1, val.length - 1)
        }
        if (
          checkAllAliases(key, flags.bools) ||
          checkAllAliases(key, flags.counts)
        ) {
          if (typeof val === "string") val = val === "true"
        }
        let value = Array.isArray(val)
          ? val.map(function (v) {
              return maybeCoerceNumber(key, v)
            })
          : maybeCoerceNumber(key, val)
        if (
          checkAllAliases(key, flags.counts) &&
          (isUndefined(value) || typeof value === "boolean")
        ) {
          value = increment()
        }
        if (
          checkAllAliases(key, flags.normalize) &&
          checkAllAliases(key, flags.arrays)
        ) {
          if (Array.isArray(val))
            value = val.map((val2) => {
              return mixin.normalize(val2)
            })
          else value = mixin.normalize(val)
        }
        return value
      }
      function maybeCoerceNumber(key, value) {
        if (!configuration["parse-positional-numbers"] && key === "_")
          return value
        if (
          !checkAllAliases(key, flags.strings) &&
          !checkAllAliases(key, flags.bools) &&
          !Array.isArray(value)
        ) {
          const shouldCoerceNumber =
            looksLikeNumber(value) &&
            configuration["parse-numbers"] &&
            Number.isSafeInteger(Math.floor(parseFloat(`${value}`)))
          if (
            shouldCoerceNumber ||
            (!isUndefined(value) && checkAllAliases(key, flags.numbers))
          ) {
            value = Number(value)
          }
        }
        return value
      }
      function setConfig(argv2) {
        const configLookup = Object.create(null)
        applyDefaultsAndAliases(configLookup, flags.aliases, defaults)
        Object.keys(flags.configs).forEach(function (configKey) {
          const configPath = argv2[configKey] || configLookup[configKey]
          if (configPath) {
            try {
              let config = null
              const resolvedConfigPath = mixin.resolve(mixin.cwd(), configPath)
              const resolveConfig = flags.configs[configKey]
              if (typeof resolveConfig === "function") {
                try {
                  config = resolveConfig(resolvedConfigPath)
                } catch (e) {
                  config = e
                }
                if (config instanceof Error) {
                  error = config
                  return
                }
              } else {
                config = mixin.require(resolvedConfigPath)
              }
              setConfigObject(config)
            } catch (ex) {
              if (ex.name === "PermissionDenied") error = ex
              else if (argv2[configKey])
                error = Error(__("Invalid JSON config file: %s", configPath))
            }
          }
        })
      }
      function setConfigObject(config, prev) {
        Object.keys(config).forEach(function (key) {
          const value = config[key]
          const fullKey = prev ? prev + "." + key : key
          if (
            typeof value === "object" &&
            value !== null &&
            !Array.isArray(value) &&
            configuration["dot-notation"]
          ) {
            setConfigObject(value, fullKey)
          } else {
            if (
              !hasKey(argv, fullKey.split(".")) ||
              (checkAllAliases(fullKey, flags.arrays) &&
                configuration["combine-arrays"])
            ) {
              setArg(fullKey, value)
            }
          }
        })
      }
      function setConfigObjects() {
        if (typeof configObjects !== "undefined") {
          configObjects.forEach(function (configObject) {
            setConfigObject(configObject)
          })
        }
      }
      function applyEnvVars(argv2, configOnly) {
        if (typeof envPrefix === "undefined") return
        const prefix = typeof envPrefix === "string" ? envPrefix : ""
        const env2 = mixin.env()
        Object.keys(env2).forEach(function (envVar) {
          if (prefix === "" || envVar.lastIndexOf(prefix, 0) === 0) {
            const keys = envVar.split("__").map(function (key, i) {
              if (i === 0) {
                key = key.substring(prefix.length)
              }
              return camelCase(key)
            })
            if (
              ((configOnly && flags.configs[keys.join(".")]) || !configOnly) &&
              !hasKey(argv2, keys)
            ) {
              setArg(keys.join("."), env2[envVar])
            }
          }
        })
      }
      function applyCoercions(argv2) {
        let coerce
        const applied = new Set()
        Object.keys(argv2).forEach(function (key) {
          if (!applied.has(key)) {
            coerce = checkAllAliases(key, flags.coercions)
            if (typeof coerce === "function") {
              try {
                const value = maybeCoerceNumber(key, coerce(argv2[key]))
                ;[].concat(flags.aliases[key] || [], key).forEach((ali) => {
                  applied.add(ali)
                  argv2[ali] = value
                })
              } catch (err) {
                error = err
              }
            }
          }
        })
      }
      function setPlaceholderKeys(argv2) {
        flags.keys.forEach((key) => {
          if (~key.indexOf(".")) return
          if (typeof argv2[key] === "undefined") argv2[key] = void 0
        })
        return argv2
      }
      function applyDefaultsAndAliases(
        obj,
        aliases2,
        defaults2,
        canLog = false,
      ) {
        Object.keys(defaults2).forEach(function (key) {
          if (!hasKey(obj, key.split("."))) {
            setKey(obj, key.split("."), defaults2[key])
            if (canLog) defaulted[key] = true
            ;(aliases2[key] || []).forEach(function (x) {
              if (hasKey(obj, x.split("."))) return
              setKey(obj, x.split("."), defaults2[key])
            })
          }
        })
      }
      function hasKey(obj, keys) {
        let o = obj
        if (!configuration["dot-notation"]) keys = [keys.join(".")]
        keys.slice(0, -1).forEach(function (key2) {
          o = o[key2] || {}
        })
        const key = keys[keys.length - 1]
        if (typeof o !== "object") return false
        else return key in o
      }
      function setKey(obj, keys, value) {
        let o = obj
        if (!configuration["dot-notation"]) keys = [keys.join(".")]
        keys.slice(0, -1).forEach(function (key2) {
          key2 = sanitizeKey(key2)
          if (typeof o === "object" && o[key2] === void 0) {
            o[key2] = {}
          }
          if (typeof o[key2] !== "object" || Array.isArray(o[key2])) {
            if (Array.isArray(o[key2])) {
              o[key2].push({})
            } else {
              o[key2] = [o[key2], {}]
            }
            o = o[key2][o[key2].length - 1]
          } else {
            o = o[key2]
          }
        })
        const key = sanitizeKey(keys[keys.length - 1])
        const isTypeArray = checkAllAliases(keys.join("."), flags.arrays)
        const isValueArray = Array.isArray(value)
        let duplicate = configuration["duplicate-arguments-array"]
        if (!duplicate && checkAllAliases(key, flags.nargs)) {
          duplicate = true
          if (
            (!isUndefined(o[key]) && flags.nargs[key] === 1) ||
            (Array.isArray(o[key]) && o[key].length === flags.nargs[key])
          ) {
            o[key] = void 0
          }
        }
        if (value === increment()) {
          o[key] = increment(o[key])
        } else if (Array.isArray(o[key])) {
          if (duplicate && isTypeArray && isValueArray) {
            o[key] = configuration["flatten-duplicate-arrays"]
              ? o[key].concat(value)
              : (Array.isArray(o[key][0]) ? o[key] : [o[key]]).concat([value])
          } else if (
            !duplicate &&
            Boolean(isTypeArray) === Boolean(isValueArray)
          ) {
            o[key] = value
          } else {
            o[key] = o[key].concat([value])
          }
        } else if (o[key] === void 0 && isTypeArray) {
          o[key] = isValueArray ? value : [value]
        } else if (
          duplicate &&
          !(
            o[key] === void 0 ||
            checkAllAliases(key, flags.counts) ||
            checkAllAliases(key, flags.bools)
          )
        ) {
          o[key] = [o[key], value]
        } else {
          o[key] = value
        }
      }
      function extendAliases(...args2) {
        args2.forEach(function (obj) {
          Object.keys(obj || {}).forEach(function (key) {
            if (flags.aliases[key]) return
            flags.aliases[key] = [].concat(aliases[key] || [])
            flags.aliases[key].concat(key).forEach(function (x) {
              if (/-/.test(x) && configuration["camel-case-expansion"]) {
                const c = camelCase(x)
                if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                  flags.aliases[key].push(c)
                  newAliases[c] = true
                }
              }
            })
            flags.aliases[key].concat(key).forEach(function (x) {
              if (
                x.length > 1 &&
                /[A-Z]/.test(x) &&
                configuration["camel-case-expansion"]
              ) {
                const c = decamelize(x, "-")
                if (c !== key && flags.aliases[key].indexOf(c) === -1) {
                  flags.aliases[key].push(c)
                  newAliases[c] = true
                }
              }
            })
            flags.aliases[key].forEach(function (x) {
              flags.aliases[x] = [key].concat(
                flags.aliases[key].filter(function (y) {
                  return x !== y
                }),
              )
            })
          })
        })
      }
      function checkAllAliases(key, flag) {
        const toCheck = [].concat(flags.aliases[key] || [], key)
        const keys = Object.keys(flag)
        const setAlias = toCheck.find((key2) => keys.includes(key2))
        return setAlias ? flag[setAlias] : false
      }
      function hasAnyFlag(key) {
        const flagsKeys = Object.keys(flags)
        const toCheck = [].concat(flagsKeys.map((k) => flags[k]))
        return toCheck.some(function (flag) {
          return Array.isArray(flag) ? flag.includes(key) : flag[key]
        })
      }
      function hasFlagsMatching(arg, ...patterns) {
        const toCheck = [].concat(...patterns)
        return toCheck.some(function (pattern) {
          const match = arg.match(pattern)
          return match && hasAnyFlag(match[1])
        })
      }
      function hasAllShortFlags(arg) {
        if (arg.match(negative) || !arg.match(/^-[^-]+/)) {
          return false
        }
        let hasAllFlags = true
        let next
        const letters = arg.slice(1).split("")
        for (let j = 0; j < letters.length; j++) {
          next = arg.slice(j + 2)
          if (!hasAnyFlag(letters[j])) {
            hasAllFlags = false
            break
          }
          if (
            (letters[j + 1] && letters[j + 1] === "=") ||
            next === "-" ||
            (/[A-Za-z]/.test(letters[j]) &&
              /^-?\d+(\.\d*)?(e-?\d+)?$/.test(next)) ||
            (letters[j + 1] && letters[j + 1].match(/\W/))
          ) {
            break
          }
        }
        return hasAllFlags
      }
      function isUnknownOptionAsArg(arg) {
        return configuration["unknown-options-as-args"] && isUnknownOption(arg)
      }
      function isUnknownOption(arg) {
        if (arg.match(negative)) {
          return false
        }
        if (hasAllShortFlags(arg)) {
          return false
        }
        const flagWithEquals = /^-+([^=]+?)=[\s\S]*$/
        const normalFlag = /^-+([^=]+?)$/
        const flagEndingInHyphen = /^-+([^=]+?)-$/
        const flagEndingInDigits = /^-+([^=]+?\d+)$/
        const flagEndingInNonWordCharacters = /^-+([^=]+?)\W+.*$/
        return !hasFlagsMatching(
          arg,
          flagWithEquals,
          negatedBoolean,
          normalFlag,
          flagEndingInHyphen,
          flagEndingInDigits,
          flagEndingInNonWordCharacters,
        )
      }
      function defaultValue(key) {
        if (
          !checkAllAliases(key, flags.bools) &&
          !checkAllAliases(key, flags.counts) &&
          `${key}` in defaults
        ) {
          return defaults[key]
        } else {
          return defaultForType(guessType(key))
        }
      }
      function defaultForType(type) {
        const def = {
          boolean: true,
          string: "",
          number: void 0,
          array: [],
        }
        return def[type]
      }
      function guessType(key) {
        let type = "boolean"
        if (checkAllAliases(key, flags.strings)) type = "string"
        else if (checkAllAliases(key, flags.numbers)) type = "number"
        else if (checkAllAliases(key, flags.bools)) type = "boolean"
        else if (checkAllAliases(key, flags.arrays)) type = "array"
        return type
      }
      function isUndefined(num) {
        return num === void 0
      }
      function checkConfiguration() {
        Object.keys(flags.counts).find((key) => {
          if (checkAllAliases(key, flags.arrays)) {
            error = Error(
              __(
                "Invalid configuration: %s, opts.count excludes opts.array.",
                key,
              ),
            )
            return true
          } else if (checkAllAliases(key, flags.nargs)) {
            error = Error(
              __(
                "Invalid configuration: %s, opts.count excludes opts.narg.",
                key,
              ),
            )
            return true
          }
          return false
        })
      }
      return {
        aliases: Object.assign({}, flags.aliases),
        argv: Object.assign(argvReturn, argv),
        configuration,
        defaulted: Object.assign({}, defaulted),
        error,
        newAliases: Object.assign({}, newAliases),
      }
    }
  }
  function combineAliases(aliases) {
    const aliasArrays = []
    const combined = Object.create(null)
    let change = true
    Object.keys(aliases).forEach(function (key) {
      aliasArrays.push([].concat(aliases[key], key))
    })
    while (change) {
      change = false
      for (let i = 0; i < aliasArrays.length; i++) {
        for (let ii = i + 1; ii < aliasArrays.length; ii++) {
          const intersect = aliasArrays[i].filter(function (v) {
            return aliasArrays[ii].indexOf(v) !== -1
          })
          if (intersect.length) {
            aliasArrays[i] = aliasArrays[i].concat(aliasArrays[ii])
            aliasArrays.splice(ii, 1)
            change = true
            break
          }
        }
      }
    }
    aliasArrays.forEach(function (aliasArray) {
      aliasArray = aliasArray.filter(function (v, i, self) {
        return self.indexOf(v) === i
      })
      const lastAlias = aliasArray.pop()
      if (lastAlias !== void 0 && typeof lastAlias === "string") {
        combined[lastAlias] = aliasArray
      }
    })
    return combined
  }
  function increment(orig) {
    return orig !== void 0 ? orig + 1 : 1
  }
  function sanitizeKey(key) {
    if (key === "__proto__") return "___proto___"
    return key
  }
  var minNodeVersion =
    process && process.env && process.env.YARGS_MIN_NODE_VERSION
      ? Number(process.env.YARGS_MIN_NODE_VERSION)
      : 10
  if (process && process.version) {
    const major = Number(process.version.match(/v([^.]+)/)[1])
    if (major < minNodeVersion) {
      throw Error(
        `yargs parser supports a minimum Node.js version of ${minNodeVersion}. Read our version support policy: https://github.com/yargs/yargs-parser#supported-nodejs-versions`,
      )
    }
  }
  var env = process ? process.env : {}
  var parser = new YargsParser({
    cwd: process.cwd,
    env: () => {
      return env
    },
    format: util.format,
    normalize: path.normalize,
    resolve: path.resolve,
    require: (path2) => {
      if (true) {
        return require(path2)
      } else if (path2.match(/\.json$/)) {
        return fs.readFileSync(path2, "utf8")
      } else {
        throw Error("only .json config files are supported in ESM")
      }
    },
  })
  var yargsParser = function Parser(args, opts) {
    const result = parser.parse(args.slice(), opts)
    return result.argv
  }
  yargsParser.detailed = function (args, opts) {
    return parser.parse(args.slice(), opts)
  }
  yargsParser.camelCase = camelCase
  yargsParser.decamelize = decamelize
  yargsParser.looksLikeNumber = looksLikeNumber
  module.exports = yargsParser
})

// node_modules/camelcase-keys/node_modules/map-obj/index.js
var require_map_obj = __commonJS((exports, module) => {
  "use strict"
  var isObject = (value) => typeof value === "object" && value !== null
  var isObjectCustom = (value) =>
    isObject(value) &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date)
  var mapObject = (object, mapper, options, isSeen = new WeakMap()) => {
    options = {
      deep: false,
      target: {},
      ...options,
    }
    if (isSeen.has(object)) {
      return isSeen.get(object)
    }
    isSeen.set(object, options.target)
    const { target } = options
    delete options.target
    const mapArray = (array) =>
      array.map((element) =>
        isObjectCustom(element)
          ? mapObject(element, mapper, options, isSeen)
          : element,
      )
    if (Array.isArray(object)) {
      return mapArray(object)
    }
    for (const [key, value] of Object.entries(object)) {
      let [newKey, newValue] = mapper(key, value, object)
      if (options.deep && isObjectCustom(newValue)) {
        newValue = Array.isArray(newValue)
          ? mapArray(newValue)
          : mapObject(newValue, mapper, options, isSeen)
      }
      target[newKey] = newValue
    }
    return target
  }
  module.exports = (object, mapper, options) => {
    if (!isObject(object)) {
      throw new TypeError(
        `Expected an object, got \`${object}\` (${typeof object})`,
      )
    }
    return mapObject(object, mapper, options)
  }
})

// node_modules/camelcase/index.js
var require_camelcase = __commonJS((exports, module) => {
  "use strict"
  var preserveCamelCase = (string) => {
    let isLastCharLower = false
    let isLastCharUpper = false
    let isLastLastCharUpper = false
    for (let i = 0; i < string.length; i++) {
      const character = string[i]
      if (
        isLastCharLower &&
        /[a-zA-Z]/.test(character) &&
        character.toUpperCase() === character
      ) {
        string = string.slice(0, i) + "-" + string.slice(i)
        isLastCharLower = false
        isLastLastCharUpper = isLastCharUpper
        isLastCharUpper = true
        i++
      } else if (
        isLastCharUpper &&
        isLastLastCharUpper &&
        /[a-zA-Z]/.test(character) &&
        character.toLowerCase() === character
      ) {
        string = string.slice(0, i - 1) + "-" + string.slice(i - 1)
        isLastLastCharUpper = isLastCharUpper
        isLastCharUpper = false
        isLastCharLower = true
      } else {
        isLastCharLower =
          character.toLowerCase() === character &&
          character.toUpperCase() !== character
        isLastLastCharUpper = isLastCharUpper
        isLastCharUpper =
          character.toUpperCase() === character &&
          character.toLowerCase() !== character
      }
    }
    return string
  }
  var camelCase = (input, options) => {
    if (!(typeof input === "string" || Array.isArray(input))) {
      throw new TypeError("Expected the input to be `string | string[]`")
    }
    options = Object.assign(
      {
        pascalCase: false,
      },
      options,
    )
    const postProcess = (x) =>
      options.pascalCase ? x.charAt(0).toUpperCase() + x.slice(1) : x
    if (Array.isArray(input)) {
      input = input
        .map((x) => x.trim())
        .filter((x) => x.length)
        .join("-")
    } else {
      input = input.trim()
    }
    if (input.length === 0) {
      return ""
    }
    if (input.length === 1) {
      return options.pascalCase ? input.toUpperCase() : input.toLowerCase()
    }
    const hasUpperCase = input !== input.toLowerCase()
    if (hasUpperCase) {
      input = preserveCamelCase(input)
    }
    input = input
      .replace(/^[_.\- ]+/, "")
      .toLowerCase()
      .replace(/[_.\- ]+(\w|$)/g, (_, p1) => p1.toUpperCase())
      .replace(/\d+(\w|$)/g, (m) => m.toUpperCase())
    return postProcess(input)
  }
  module.exports = camelCase
  module.exports.default = camelCase
})

// node_modules/quick-lru/index.js
var require_quick_lru = __commonJS((exports, module) => {
  "use strict"
  var QuickLRU = class {
    constructor(options = {}) {
      if (!(options.maxSize && options.maxSize > 0)) {
        throw new TypeError("`maxSize` must be a number greater than 0")
      }
      this.maxSize = options.maxSize
      this.cache = new Map()
      this.oldCache = new Map()
      this._size = 0
    }
    _set(key, value) {
      this.cache.set(key, value)
      this._size++
      if (this._size >= this.maxSize) {
        this._size = 0
        this.oldCache = this.cache
        this.cache = new Map()
      }
    }
    get(key) {
      if (this.cache.has(key)) {
        return this.cache.get(key)
      }
      if (this.oldCache.has(key)) {
        const value = this.oldCache.get(key)
        this.oldCache.delete(key)
        this._set(key, value)
        return value
      }
    }
    set(key, value) {
      if (this.cache.has(key)) {
        this.cache.set(key, value)
      } else {
        this._set(key, value)
      }
      return this
    }
    has(key) {
      return this.cache.has(key) || this.oldCache.has(key)
    }
    peek(key) {
      if (this.cache.has(key)) {
        return this.cache.get(key)
      }
      if (this.oldCache.has(key)) {
        return this.oldCache.get(key)
      }
    }
    delete(key) {
      const deleted = this.cache.delete(key)
      if (deleted) {
        this._size--
      }
      return this.oldCache.delete(key) || deleted
    }
    clear() {
      this.cache.clear()
      this.oldCache.clear()
      this._size = 0
    }
    *keys() {
      for (const [key] of this) {
        yield key
      }
    }
    *values() {
      for (const [, value] of this) {
        yield value
      }
    }
    *[Symbol.iterator]() {
      for (const item of this.cache) {
        yield item
      }
      for (const item of this.oldCache) {
        const [key] = item
        if (!this.cache.has(key)) {
          yield item
        }
      }
    }
    get size() {
      let oldCacheSize = 0
      for (const key of this.oldCache.keys()) {
        if (!this.cache.has(key)) {
          oldCacheSize++
        }
      }
      return this._size + oldCacheSize
    }
  }
  module.exports = QuickLRU
})

// node_modules/camelcase-keys/index.js
var require_camelcase_keys = __commonJS((exports, module) => {
  "use strict"
  var mapObj = require_map_obj()
  var camelCase = require_camelcase()
  var QuickLru = require_quick_lru()
  var has = (array, key) =>
    array.some((x) => {
      if (typeof x === "string") {
        return x === key
      }
      x.lastIndex = 0
      return x.test(key)
    })
  var cache = new QuickLru({ maxSize: 1e5 })
  var isObject = (value) =>
    typeof value === "object" &&
    value !== null &&
    !(value instanceof RegExp) &&
    !(value instanceof Error) &&
    !(value instanceof Date)
  var camelCaseConvert = (input, options) => {
    if (!isObject(input)) {
      return input
    }
    options = {
      deep: false,
      pascalCase: false,
      ...options,
    }
    const { exclude, pascalCase, stopPaths, deep } = options
    const stopPathsSet = new Set(stopPaths)
    const makeMapper = (parentPath) => (key, value) => {
      if (deep && isObject(value)) {
        const path = parentPath === void 0 ? key : `${parentPath}.${key}`
        if (!stopPathsSet.has(path)) {
          value = mapObj(value, makeMapper(path))
        }
      }
      if (!(exclude && has(exclude, key))) {
        const cacheKey = pascalCase ? `${key}_` : key
        if (cache.has(cacheKey)) {
          key = cache.get(cacheKey)
        } else {
          const ret = camelCase(key, { pascalCase })
          if (key.length < 100) {
            cache.set(cacheKey, ret)
          }
          key = ret
        }
      }
      return [key, value]
    }
    return mapObj(input, makeMapper(void 0))
  }
  module.exports = (input, options) => {
    if (Array.isArray(input)) {
      return Object.keys(input).map((key) =>
        camelCaseConvert(input[key], options),
      )
    }
    return camelCaseConvert(input, options)
  }
})

// node_modules/map-obj/index.js
var require_map_obj2 = __commonJS((exports, module) => {
  "use strict"
  module.exports = function (obj, cb) {
    var ret = {}
    var keys = Object.keys(obj)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var res = cb(key, obj[key], obj)
      ret[res[0]] = res[1]
    }
    return ret
  }
})

// node_modules/decamelize/index.js
var require_decamelize = __commonJS((exports, module) => {
  "use strict"
  module.exports = function (str, sep) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string")
    }
    sep = typeof sep === "undefined" ? "_" : sep
    return str
      .replace(/([a-z\d])([A-Z])/g, "$1" + sep + "$2")
      .replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + sep + "$2")
      .toLowerCase()
  }
})

// node_modules/decamelize-keys/index.js
var require_decamelize_keys = __commonJS((exports, module) => {
  "use strict"
  var mapObj = require_map_obj2()
  var decamelize = require_decamelize()
  module.exports = function (input, separator, options) {
    if (typeof separator !== "string") {
      options = separator
      separator = null
    }
    options = options || {}
    separator = separator || options.separator
    var exclude = options.exclude || []
    return mapObj(input, function (key, val) {
      key = exclude.indexOf(key) === -1 ? decamelize(key, separator) : key
      return [key, val]
    })
  }
})

// node_modules/trim-newlines/index.js
var require_trim_newlines = __commonJS((exports, module) => {
  "use strict"
  module.exports = (string) =>
    string.replace(/^[\r\n]+/, "").replace(/[\r\n]+$/, "")
  module.exports.start = (string) => string.replace(/^[\r\n]+/, "")
  module.exports.end = (string) => string.replace(/[\r\n]+$/, "")
})

// node_modules/min-indent/index.js
var require_min_indent = __commonJS((exports, module) => {
  "use strict"
  module.exports = (string) => {
    const match = string.match(/^[ \t]*(?=\S)/gm)
    if (!match) {
      return 0
    }
    return match.reduce((r, a) => Math.min(r, a.length), Infinity)
  }
})

// node_modules/strip-indent/index.js
var require_strip_indent = __commonJS((exports, module) => {
  "use strict"
  var minIndent = require_min_indent()
  module.exports = (string) => {
    const indent = minIndent(string)
    if (indent === 0) {
      return string
    }
    const regex = new RegExp(`^[ \\t]{${indent}}`, "gm")
    return string.replace(regex, "")
  }
})

// node_modules/indent-string/index.js
var require_indent_string = __commonJS((exports, module) => {
  "use strict"
  module.exports = (string, count = 1, options) => {
    options = {
      indent: " ",
      includeEmptyLines: false,
      ...options,
    }
    if (typeof string !== "string") {
      throw new TypeError(
        `Expected \`input\` to be a \`string\`, got \`${typeof string}\``,
      )
    }
    if (typeof count !== "number") {
      throw new TypeError(
        `Expected \`count\` to be a \`number\`, got \`${typeof count}\``,
      )
    }
    if (typeof options.indent !== "string") {
      throw new TypeError(
        `Expected \`options.indent\` to be a \`string\`, got \`${typeof options.indent}\``,
      )
    }
    if (count === 0) {
      return string
    }
    const regex = options.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm
    return string.replace(regex, options.indent.repeat(count))
  }
})

// node_modules/redent/index.js
var require_redent = __commonJS((exports, module) => {
  "use strict"
  var stripIndent = require_strip_indent()
  var indentString = require_indent_string()
  module.exports = (string, count = 0, options) =>
    indentString(stripIndent(string), count, options)
})

// node_modules/p-try/index.js
var require_p_try = __commonJS((exports, module) => {
  "use strict"
  var pTry = (fn, ...arguments_) =>
    new Promise((resolve) => {
      resolve(fn(...arguments_))
    })
  module.exports = pTry
  module.exports.default = pTry
})

// node_modules/p-limit/index.js
var require_p_limit = __commonJS((exports, module) => {
  "use strict"
  var pTry = require_p_try()
  var pLimit = (concurrency) => {
    if (
      !(
        (Number.isInteger(concurrency) || concurrency === Infinity) &&
        concurrency > 0
      )
    ) {
      return Promise.reject(
        new TypeError("Expected `concurrency` to be a number from 1 and up"),
      )
    }
    const queue = []
    let activeCount = 0
    const next = () => {
      activeCount--
      if (queue.length > 0) {
        queue.shift()()
      }
    }
    const run = (fn, resolve, ...args) => {
      activeCount++
      const result = pTry(fn, ...args)
      resolve(result)
      result.then(next, next)
    }
    const enqueue = (fn, resolve, ...args) => {
      if (activeCount < concurrency) {
        run(fn, resolve, ...args)
      } else {
        queue.push(run.bind(null, fn, resolve, ...args))
      }
    }
    const generator = (fn, ...args) =>
      new Promise((resolve) => enqueue(fn, resolve, ...args))
    Object.defineProperties(generator, {
      activeCount: {
        get: () => activeCount,
      },
      pendingCount: {
        get: () => queue.length,
      },
      clearQueue: {
        value: () => {
          queue.length = 0
        },
      },
    })
    return generator
  }
  module.exports = pLimit
  module.exports.default = pLimit
})

// node_modules/p-locate/index.js
var require_p_locate = __commonJS((exports, module) => {
  "use strict"
  var pLimit = require_p_limit()
  var EndError = class extends Error {
    constructor(value) {
      super()
      this.value = value
    }
  }
  var testElement = async (element, tester) => tester(await element)
  var finder = async (element) => {
    const values = await Promise.all(element)
    if (values[1] === true) {
      throw new EndError(values[0])
    }
    return false
  }
  var pLocate = async (iterable, tester, options) => {
    options = {
      concurrency: Infinity,
      preserveOrder: true,
      ...options,
    }
    const limit = pLimit(options.concurrency)
    const items = [...iterable].map((element) => [
      element,
      limit(testElement, element, tester),
    ])
    const checkLimit = pLimit(options.preserveOrder ? 1 : Infinity)
    try {
      await Promise.all(items.map((element) => checkLimit(finder, element)))
    } catch (error) {
      if (error instanceof EndError) {
        return error.value
      }
      throw error
    }
  }
  module.exports = pLocate
  module.exports.default = pLocate
})

// node_modules/locate-path/index.js
var require_locate_path = __commonJS((exports, module) => {
  "use strict"
  var path = require("path")
  var fs = require("fs")
  var { promisify } = require("util")
  var pLocate = require_p_locate()
  var fsStat = promisify(fs.stat)
  var fsLStat = promisify(fs.lstat)
  var typeMappings = {
    directory: "isDirectory",
    file: "isFile",
  }
  function checkType({ type }) {
    if (type in typeMappings) {
      return
    }
    throw new Error(`Invalid type specified: ${type}`)
  }
  var matchType = (type, stat) => type === void 0 || stat[typeMappings[type]]()
  module.exports = async (paths, options) => {
    options = {
      cwd: process.cwd(),
      type: "file",
      allowSymlinks: true,
      ...options,
    }
    checkType(options)
    const statFn = options.allowSymlinks ? fsStat : fsLStat
    return pLocate(
      paths,
      async (path_) => {
        try {
          const stat = await statFn(path.resolve(options.cwd, path_))
          return matchType(options.type, stat)
        } catch (_) {
          return false
        }
      },
      options,
    )
  }
  module.exports.sync = (paths, options) => {
    options = {
      cwd: process.cwd(),
      allowSymlinks: true,
      type: "file",
      ...options,
    }
    checkType(options)
    const statFn = options.allowSymlinks ? fs.statSync : fs.lstatSync
    for (const path_ of paths) {
      try {
        const stat = statFn(path.resolve(options.cwd, path_))
        if (matchType(options.type, stat)) {
          return path_
        }
      } catch (_) {}
    }
  }
})

// node_modules/read-pkg-up/node_modules/path-exists/index.js
var require_path_exists = __commonJS((exports, module) => {
  "use strict"
  var fs = require("fs")
  var { promisify } = require("util")
  var pAccess = promisify(fs.access)
  module.exports = async (path) => {
    try {
      await pAccess(path)
      return true
    } catch (_) {
      return false
    }
  }
  module.exports.sync = (path) => {
    try {
      fs.accessSync(path)
      return true
    } catch (_) {
      return false
    }
  }
})

// node_modules/read-pkg-up/node_modules/find-up/index.js
var require_find_up = __commonJS((exports, module) => {
  "use strict"
  var path = require("path")
  var locatePath = require_locate_path()
  var pathExists = require_path_exists()
  var stop = Symbol("findUp.stop")
  module.exports = async (name, options = {}) => {
    let directory = path.resolve(options.cwd || "")
    const { root } = path.parse(directory)
    const paths = [].concat(name)
    const runMatcher = async (locateOptions) => {
      if (typeof name !== "function") {
        return locatePath(paths, locateOptions)
      }
      const foundPath = await name(locateOptions.cwd)
      if (typeof foundPath === "string") {
        return locatePath([foundPath], locateOptions)
      }
      return foundPath
    }
    while (true) {
      const foundPath = await runMatcher({ ...options, cwd: directory })
      if (foundPath === stop) {
        return
      }
      if (foundPath) {
        return path.resolve(directory, foundPath)
      }
      if (directory === root) {
        return
      }
      directory = path.dirname(directory)
    }
  }
  module.exports.sync = (name, options = {}) => {
    let directory = path.resolve(options.cwd || "")
    const { root } = path.parse(directory)
    const paths = [].concat(name)
    const runMatcher = (locateOptions) => {
      if (typeof name !== "function") {
        return locatePath.sync(paths, locateOptions)
      }
      const foundPath = name(locateOptions.cwd)
      if (typeof foundPath === "string") {
        return locatePath.sync([foundPath], locateOptions)
      }
      return foundPath
    }
    while (true) {
      const foundPath = runMatcher({ ...options, cwd: directory })
      if (foundPath === stop) {
        return
      }
      if (foundPath) {
        return path.resolve(directory, foundPath)
      }
      if (directory === root) {
        return
      }
      directory = path.dirname(directory)
    }
  }
  module.exports.exists = pathExists
  module.exports.sync.exists = pathExists.sync
  module.exports.stop = stop
})

// node_modules/is-arrayish/index.js
var require_is_arrayish = __commonJS((exports, module) => {
  "use strict"
  module.exports = function isArrayish(obj) {
    if (!obj) {
      return false
    }
    return (
      obj instanceof Array ||
      Array.isArray(obj) ||
      (obj.length >= 0 && obj.splice instanceof Function)
    )
  }
})

// node_modules/error-ex/index.js
var require_error_ex = __commonJS((exports, module) => {
  "use strict"
  var util = require("util")
  var isArrayish = require_is_arrayish()
  var errorEx = function errorEx2(name, properties) {
    if (!name || name.constructor !== String) {
      properties = name || {}
      name = Error.name
    }
    var errorExError = function ErrorEXError(message) {
      if (!this) {
        return new ErrorEXError(message)
      }
      message =
        message instanceof Error ? message.message : message || this.message
      Error.call(this, message)
      Error.captureStackTrace(this, errorExError)
      this.name = name
      Object.defineProperty(this, "message", {
        configurable: true,
        enumerable: false,
        get: function () {
          var newMessage = message.split(/\r?\n/g)
          for (var key in properties) {
            if (!properties.hasOwnProperty(key)) {
              continue
            }
            var modifier = properties[key]
            if ("message" in modifier) {
              newMessage = modifier.message(this[key], newMessage) || newMessage
              if (!isArrayish(newMessage)) {
                newMessage = [newMessage]
              }
            }
          }
          return newMessage.join("\n")
        },
        set: function (v) {
          message = v
        },
      })
      var overwrittenStack = null
      var stackDescriptor = Object.getOwnPropertyDescriptor(this, "stack")
      var stackGetter = stackDescriptor.get
      var stackValue = stackDescriptor.value
      delete stackDescriptor.value
      delete stackDescriptor.writable
      stackDescriptor.set = function (newstack) {
        overwrittenStack = newstack
      }
      stackDescriptor.get = function () {
        var stack = (
          overwrittenStack ||
          (stackGetter ? stackGetter.call(this) : stackValue)
        ).split(/\r?\n+/g)
        if (!overwrittenStack) {
          stack[0] = this.name + ": " + this.message
        }
        var lineCount = 1
        for (var key in properties) {
          if (!properties.hasOwnProperty(key)) {
            continue
          }
          var modifier = properties[key]
          if ("line" in modifier) {
            var line = modifier.line(this[key])
            if (line) {
              stack.splice(lineCount++, 0, "    " + line)
            }
          }
          if ("stack" in modifier) {
            modifier.stack(this[key], stack)
          }
        }
        return stack.join("\n")
      }
      Object.defineProperty(this, "stack", stackDescriptor)
    }
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(errorExError.prototype, Error.prototype)
      Object.setPrototypeOf(errorExError, Error)
    } else {
      util.inherits(errorExError, Error)
    }
    return errorExError
  }
  errorEx.append = function (str, def) {
    return {
      message: function (v, message) {
        v = v || def
        if (v) {
          message[0] += " " + str.replace("%s", v.toString())
        }
        return message
      },
    }
  }
  errorEx.line = function (str, def) {
    return {
      line: function (v) {
        v = v || def
        if (v) {
          return str.replace("%s", v.toString())
        }
        return null
      },
    }
  }
  module.exports = errorEx
})

// node_modules/json-parse-better-errors/index.js
var require_json_parse_better_errors = __commonJS((exports, module) => {
  "use strict"
  module.exports = parseJson
  function parseJson(txt, reviver, context) {
    context = context || 20
    try {
      return JSON.parse(txt, reviver)
    } catch (e) {
      if (typeof txt !== "string") {
        const isEmptyArray = Array.isArray(txt) && txt.length === 0
        const errorMessage =
          "Cannot parse " + (isEmptyArray ? "an empty array" : String(txt))
        throw new TypeError(errorMessage)
      }
      const syntaxErr = e.message.match(/^Unexpected token.*position\s+(\d+)/i)
      const errIdx = syntaxErr
        ? +syntaxErr[1]
        : e.message.match(/^Unexpected end of JSON.*/i)
        ? txt.length - 1
        : null
      if (errIdx != null) {
        const start = errIdx <= context ? 0 : errIdx - context
        const end =
          errIdx + context >= txt.length ? txt.length : errIdx + context
        e.message += ` while parsing near '${
          start === 0 ? "" : "..."
        }${txt.slice(start, end)}${end === txt.length ? "" : "..."}'`
      } else {
        e.message += ` while parsing '${txt.slice(0, context * 2)}'`
      }
      throw e
    }
  }
})

// node_modules/lines-and-columns/dist/index.js
var require_dist = __commonJS((exports) => {
  "use strict"
  var LF = "\n"
  var CR = "\r"
  var LinesAndColumns = (function () {
    function LinesAndColumns2(string) {
      this.string = string
      var offsets = [0]
      for (var offset = 0; offset < string.length; ) {
        switch (string[offset]) {
          case LF:
            offset += LF.length
            offsets.push(offset)
            break
          case CR:
            offset += CR.length
            if (string[offset] === LF) {
              offset += LF.length
            }
            offsets.push(offset)
            break
          default:
            offset++
            break
        }
      }
      this.offsets = offsets
    }
    LinesAndColumns2.prototype.locationForIndex = function (index) {
      if (index < 0 || index > this.string.length) {
        return null
      }
      var line = 0
      var offsets = this.offsets
      while (offsets[line + 1] <= index) {
        line++
      }
      var column = index - offsets[line]
      return { line, column }
    }
    LinesAndColumns2.prototype.indexForLocation = function (location) {
      var line = location.line,
        column = location.column
      if (line < 0 || line >= this.offsets.length) {
        return null
      }
      if (column < 0 || column > this.lengthOfLine(line)) {
        return null
      }
      return this.offsets[line] + column
    }
    LinesAndColumns2.prototype.lengthOfLine = function (line) {
      var offset = this.offsets[line]
      var nextOffset =
        line === this.offsets.length - 1
          ? this.string.length
          : this.offsets[line + 1]
      return nextOffset - offset
    }
    return LinesAndColumns2
  })()
  exports.__esModule = true
  exports["default"] = LinesAndColumns
})

// node_modules/js-tokens/index.js
var require_js_tokens = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports.default = /((['"])(?:(?!\2|\\).|\\(?:\r\n|[\s\S]))*(\2)?|`(?:[^`\\$]|\\[\s\S]|\$(?!\{)|\$\{(?:[^{}]|\{[^}]*\}?)*\}?)*(`)?)|(\/\/.*)|(\/\*(?:[^*]|\*(?!\/))*(\*\/)?)|(\/(?!\*)(?:\[(?:(?![\]\\]).|\\.)*\]|(?![\/\]\\]).|\\.)+\/(?:(?!\s*(?:\b|[\u0080-\uFFFF$\\'"~({]|[+\-!](?!=)|\.?\d))|[gmiyus]{1,6}\b(?![\u0080-\uFFFF$\\]|\s*(?:[+\-*%&|^<>!=?({]|\/(?![\/*])))))|(0[xX][\da-fA-F]+|0[oO][0-7]+|0[bB][01]+|(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?)|((?!\d)(?:(?!\s)[$\w\u0080-\uFFFF]|\\u[\da-fA-F]{4}|\\u\{[\da-fA-F]+\})+)|(--|\+\+|&&|\|\||=>|\.{3}|(?:[+\-\/%&|^]|\*{1,2}|<{1,2}|>{1,3}|!=?|={1,2})=?|[?~.,:;[\](){}])|(\s+)|(^$|[\s\S])/g
  exports.matchToToken = function (match) {
    var token = { type: "invalid", value: match[0], closed: void 0 }
    if (match[1])
      (token.type = "string"), (token.closed = !!(match[3] || match[4]))
    else if (match[5]) token.type = "comment"
    else if (match[6]) (token.type = "comment"), (token.closed = !!match[7])
    else if (match[8]) token.type = "regex"
    else if (match[9]) token.type = "number"
    else if (match[10]) token.type = "name"
    else if (match[11]) token.type = "punctuator"
    else if (match[12]) token.type = "whitespace"
    return token
  }
})

// node_modules/parse-json/node_modules/@babel/helper-validator-identifier/lib/identifier.js
var require_identifier = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports.isIdentifierStart = isIdentifierStart
  exports.isIdentifierChar = isIdentifierChar
  exports.isIdentifierName = isIdentifierName
  var nonASCIIidentifierStartChars =
    "\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D5F-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1878\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC"
  var nonASCIIidentifierChars =
    "\u200C\u200D\xB7\u0300-\u036F\u0387\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u0669\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u06F0-\u06F9\u0711\u0730-\u074A\u07A6-\u07B0\u07C0-\u07C9\u07EB-\u07F3\u07FD\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08D3-\u08E1\u08E3-\u0903\u093A-\u093C\u093E-\u094F\u0951-\u0957\u0962\u0963\u0966-\u096F\u0981-\u0983\u09BC\u09BE-\u09C4\u09C7\u09C8\u09CB-\u09CD\u09D7\u09E2\u09E3\u09E6-\u09EF\u09FE\u0A01-\u0A03\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A66-\u0A71\u0A75\u0A81-\u0A83\u0ABC\u0ABE-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AE2\u0AE3\u0AE6-\u0AEF\u0AFA-\u0AFF\u0B01-\u0B03\u0B3C\u0B3E-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B62\u0B63\u0B66-\u0B6F\u0B82\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD7\u0BE6-\u0BEF\u0C00-\u0C04\u0C3E-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0CBC\u0CBE-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CE2\u0CE3\u0CE6-\u0CEF\u0D00-\u0D03\u0D3B\u0D3C\u0D3E-\u0D44\u0D46-\u0D48\u0D4A-\u0D4D\u0D57\u0D62\u0D63\u0D66-\u0D6F\u0D81-\u0D83\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0E50-\u0E59\u0EB1\u0EB4-\u0EBC\u0EC8-\u0ECD\u0ED0-\u0ED9\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E\u0F3F\u0F71-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102B-\u103E\u1040-\u1049\u1056-\u1059\u105E-\u1060\u1062-\u1064\u1067-\u106D\u1071-\u1074\u1082-\u108D\u108F-\u109D\u135D-\u135F\u1369-\u1371\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4-\u17D3\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u18A9\u1920-\u192B\u1930-\u193B\u1946-\u194F\u19D0-\u19DA\u1A17-\u1A1B\u1A55-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AB0-\u1ABD\u1ABF\u1AC0\u1B00-\u1B04\u1B34-\u1B44\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1B82\u1BA1-\u1BAD\u1BB0-\u1BB9\u1BE6-\u1BF3\u1C24-\u1C37\u1C40-\u1C49\u1C50-\u1C59\u1CD0-\u1CD2\u1CD4-\u1CE8\u1CED\u1CF4\u1CF7-\u1CF9\u1DC0-\u1DF9\u1DFB-\u1DFF\u203F\u2040\u2054\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302F\u3099\u309A\uA620-\uA629\uA66F\uA674-\uA67D\uA69E\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA823-\uA827\uA82C\uA880\uA881\uA8B4-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F1\uA8FF-\uA909\uA926-\uA92D\uA947-\uA953\uA980-\uA983\uA9B3-\uA9C0\uA9D0-\uA9D9\uA9E5\uA9F0-\uA9F9\uAA29-\uAA36\uAA43\uAA4C\uAA4D\uAA50-\uAA59\uAA7B-\uAA7D\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEB-\uAAEF\uAAF5\uAAF6\uABE3-\uABEA\uABEC\uABED\uABF0-\uABF9\uFB1E\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFF10-\uFF19\uFF3F"
  var nonASCIIidentifierStart = new RegExp(
    "[" + nonASCIIidentifierStartChars + "]",
  )
  var nonASCIIidentifier = new RegExp(
    "[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]",
  )
  nonASCIIidentifierStartChars = nonASCIIidentifierChars = null
  var astralIdentifierStartCodes = [
    0,
    11,
    2,
    25,
    2,
    18,
    2,
    1,
    2,
    14,
    3,
    13,
    35,
    122,
    70,
    52,
    268,
    28,
    4,
    48,
    48,
    31,
    14,
    29,
    6,
    37,
    11,
    29,
    3,
    35,
    5,
    7,
    2,
    4,
    43,
    157,
    19,
    35,
    5,
    35,
    5,
    39,
    9,
    51,
    157,
    310,
    10,
    21,
    11,
    7,
    153,
    5,
    3,
    0,
    2,
    43,
    2,
    1,
    4,
    0,
    3,
    22,
    11,
    22,
    10,
    30,
    66,
    18,
    2,
    1,
    11,
    21,
    11,
    25,
    71,
    55,
    7,
    1,
    65,
    0,
    16,
    3,
    2,
    2,
    2,
    28,
    43,
    28,
    4,
    28,
    36,
    7,
    2,
    27,
    28,
    53,
    11,
    21,
    11,
    18,
    14,
    17,
    111,
    72,
    56,
    50,
    14,
    50,
    14,
    35,
    349,
    41,
    7,
    1,
    79,
    28,
    11,
    0,
    9,
    21,
    107,
    20,
    28,
    22,
    13,
    52,
    76,
    44,
    33,
    24,
    27,
    35,
    30,
    0,
    3,
    0,
    9,
    34,
    4,
    0,
    13,
    47,
    15,
    3,
    22,
    0,
    2,
    0,
    36,
    17,
    2,
    24,
    85,
    6,
    2,
    0,
    2,
    3,
    2,
    14,
    2,
    9,
    8,
    46,
    39,
    7,
    3,
    1,
    3,
    21,
    2,
    6,
    2,
    1,
    2,
    4,
    4,
    0,
    19,
    0,
    13,
    4,
    159,
    52,
    19,
    3,
    21,
    2,
    31,
    47,
    21,
    1,
    2,
    0,
    185,
    46,
    42,
    3,
    37,
    47,
    21,
    0,
    60,
    42,
    14,
    0,
    72,
    26,
    230,
    43,
    117,
    63,
    32,
    7,
    3,
    0,
    3,
    7,
    2,
    1,
    2,
    23,
    16,
    0,
    2,
    0,
    95,
    7,
    3,
    38,
    17,
    0,
    2,
    0,
    29,
    0,
    11,
    39,
    8,
    0,
    22,
    0,
    12,
    45,
    20,
    0,
    35,
    56,
    264,
    8,
    2,
    36,
    18,
    0,
    50,
    29,
    113,
    6,
    2,
    1,
    2,
    37,
    22,
    0,
    26,
    5,
    2,
    1,
    2,
    31,
    15,
    0,
    328,
    18,
    190,
    0,
    80,
    921,
    103,
    110,
    18,
    195,
    2749,
    1070,
    4050,
    582,
    8634,
    568,
    8,
    30,
    114,
    29,
    19,
    47,
    17,
    3,
    32,
    20,
    6,
    18,
    689,
    63,
    129,
    74,
    6,
    0,
    67,
    12,
    65,
    1,
    2,
    0,
    29,
    6135,
    9,
    1237,
    43,
    8,
    8952,
    286,
    50,
    2,
    18,
    3,
    9,
    395,
    2309,
    106,
    6,
    12,
    4,
    8,
    8,
    9,
    5991,
    84,
    2,
    70,
    2,
    1,
    3,
    0,
    3,
    1,
    3,
    3,
    2,
    11,
    2,
    0,
    2,
    6,
    2,
    64,
    2,
    3,
    3,
    7,
    2,
    6,
    2,
    27,
    2,
    3,
    2,
    4,
    2,
    0,
    4,
    6,
    2,
    339,
    3,
    24,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    30,
    2,
    24,
    2,
    7,
    2357,
    44,
    11,
    6,
    17,
    0,
    370,
    43,
    1301,
    196,
    60,
    67,
    8,
    0,
    1205,
    3,
    2,
    26,
    2,
    1,
    2,
    0,
    3,
    0,
    2,
    9,
    2,
    3,
    2,
    0,
    2,
    0,
    7,
    0,
    5,
    0,
    2,
    0,
    2,
    0,
    2,
    2,
    2,
    1,
    2,
    0,
    3,
    0,
    2,
    0,
    2,
    0,
    2,
    0,
    2,
    0,
    2,
    1,
    2,
    0,
    3,
    3,
    2,
    6,
    2,
    3,
    2,
    3,
    2,
    0,
    2,
    9,
    2,
    16,
    6,
    2,
    2,
    4,
    2,
    16,
    4421,
    42717,
    35,
    4148,
    12,
    221,
    3,
    5761,
    15,
    7472,
    3104,
    541,
    1507,
    4938,
  ]
  var astralIdentifierCodes = [
    509,
    0,
    227,
    0,
    150,
    4,
    294,
    9,
    1368,
    2,
    2,
    1,
    6,
    3,
    41,
    2,
    5,
    0,
    166,
    1,
    574,
    3,
    9,
    9,
    370,
    1,
    154,
    10,
    176,
    2,
    54,
    14,
    32,
    9,
    16,
    3,
    46,
    10,
    54,
    9,
    7,
    2,
    37,
    13,
    2,
    9,
    6,
    1,
    45,
    0,
    13,
    2,
    49,
    13,
    9,
    3,
    2,
    11,
    83,
    11,
    7,
    0,
    161,
    11,
    6,
    9,
    7,
    3,
    56,
    1,
    2,
    6,
    3,
    1,
    3,
    2,
    10,
    0,
    11,
    1,
    3,
    6,
    4,
    4,
    193,
    17,
    10,
    9,
    5,
    0,
    82,
    19,
    13,
    9,
    214,
    6,
    3,
    8,
    28,
    1,
    83,
    16,
    16,
    9,
    82,
    12,
    9,
    9,
    84,
    14,
    5,
    9,
    243,
    14,
    166,
    9,
    71,
    5,
    2,
    1,
    3,
    3,
    2,
    0,
    2,
    1,
    13,
    9,
    120,
    6,
    3,
    6,
    4,
    0,
    29,
    9,
    41,
    6,
    2,
    3,
    9,
    0,
    10,
    10,
    47,
    15,
    406,
    7,
    2,
    7,
    17,
    9,
    57,
    21,
    2,
    13,
    123,
    5,
    4,
    0,
    2,
    1,
    2,
    6,
    2,
    0,
    9,
    9,
    49,
    4,
    2,
    1,
    2,
    4,
    9,
    9,
    330,
    3,
    19306,
    9,
    135,
    4,
    60,
    6,
    26,
    9,
    1014,
    0,
    2,
    54,
    8,
    3,
    82,
    0,
    12,
    1,
    19628,
    1,
    5319,
    4,
    4,
    5,
    9,
    7,
    3,
    6,
    31,
    3,
    149,
    2,
    1418,
    49,
    513,
    54,
    5,
    49,
    9,
    0,
    15,
    0,
    23,
    4,
    2,
    14,
    1361,
    6,
    2,
    16,
    3,
    6,
    2,
    1,
    2,
    4,
    262,
    6,
    10,
    9,
    419,
    13,
    1495,
    6,
    110,
    6,
    6,
    9,
    4759,
    9,
    787719,
    239,
  ]
  function isInAstralSet(code, set) {
    let pos = 65536
    for (let i = 0, length = set.length; i < length; i += 2) {
      pos += set[i]
      if (pos > code) return false
      pos += set[i + 1]
      if (pos >= code) return true
    }
    return false
  }
  function isIdentifierStart(code) {
    if (code < 65) return code === 36
    if (code <= 90) return true
    if (code < 97) return code === 95
    if (code <= 122) return true
    if (code <= 65535) {
      return (
        code >= 170 && nonASCIIidentifierStart.test(String.fromCharCode(code))
      )
    }
    return isInAstralSet(code, astralIdentifierStartCodes)
  }
  function isIdentifierChar(code) {
    if (code < 48) return code === 36
    if (code < 58) return true
    if (code < 65) return false
    if (code <= 90) return true
    if (code < 97) return code === 95
    if (code <= 122) return true
    if (code <= 65535) {
      return code >= 170 && nonASCIIidentifier.test(String.fromCharCode(code))
    }
    return (
      isInAstralSet(code, astralIdentifierStartCodes) ||
      isInAstralSet(code, astralIdentifierCodes)
    )
  }
  function isIdentifierName(name) {
    let isFirst = true
    for (
      let _i = 0, _Array$from = Array.from(name);
      _i < _Array$from.length;
      _i++
    ) {
      const char = _Array$from[_i]
      const cp = char.codePointAt(0)
      if (isFirst) {
        if (!isIdentifierStart(cp)) {
          return false
        }
        isFirst = false
      } else if (!isIdentifierChar(cp)) {
        return false
      }
    }
    return !isFirst
  }
})

// node_modules/parse-json/node_modules/@babel/helper-validator-identifier/lib/keyword.js
var require_keyword = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports.isReservedWord = isReservedWord
  exports.isStrictReservedWord = isStrictReservedWord
  exports.isStrictBindOnlyReservedWord = isStrictBindOnlyReservedWord
  exports.isStrictBindReservedWord = isStrictBindReservedWord
  exports.isKeyword = isKeyword
  var reservedWords = {
    keyword: [
      "break",
      "case",
      "catch",
      "continue",
      "debugger",
      "default",
      "do",
      "else",
      "finally",
      "for",
      "function",
      "if",
      "return",
      "switch",
      "throw",
      "try",
      "var",
      "const",
      "while",
      "with",
      "new",
      "this",
      "super",
      "class",
      "extends",
      "export",
      "import",
      "null",
      "true",
      "false",
      "in",
      "instanceof",
      "typeof",
      "void",
      "delete",
    ],
    strict: [
      "implements",
      "interface",
      "let",
      "package",
      "private",
      "protected",
      "public",
      "static",
      "yield",
    ],
    strictBind: ["eval", "arguments"],
  }
  var keywords = new Set(reservedWords.keyword)
  var reservedWordsStrictSet = new Set(reservedWords.strict)
  var reservedWordsStrictBindSet = new Set(reservedWords.strictBind)
  function isReservedWord(word, inModule) {
    return (inModule && word === "await") || word === "enum"
  }
  function isStrictReservedWord(word, inModule) {
    return isReservedWord(word, inModule) || reservedWordsStrictSet.has(word)
  }
  function isStrictBindOnlyReservedWord(word) {
    return reservedWordsStrictBindSet.has(word)
  }
  function isStrictBindReservedWord(word, inModule) {
    return (
      isStrictReservedWord(word, inModule) || isStrictBindOnlyReservedWord(word)
    )
  }
  function isKeyword(word) {
    return keywords.has(word)
  }
})

// node_modules/parse-json/node_modules/@babel/helper-validator-identifier/lib/index.js
var require_lib = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  Object.defineProperty(exports, "isIdentifierName", {
    enumerable: true,
    get: function () {
      return _identifier.isIdentifierName
    },
  })
  Object.defineProperty(exports, "isIdentifierChar", {
    enumerable: true,
    get: function () {
      return _identifier.isIdentifierChar
    },
  })
  Object.defineProperty(exports, "isIdentifierStart", {
    enumerable: true,
    get: function () {
      return _identifier.isIdentifierStart
    },
  })
  Object.defineProperty(exports, "isReservedWord", {
    enumerable: true,
    get: function () {
      return _keyword.isReservedWord
    },
  })
  Object.defineProperty(exports, "isStrictBindOnlyReservedWord", {
    enumerable: true,
    get: function () {
      return _keyword.isStrictBindOnlyReservedWord
    },
  })
  Object.defineProperty(exports, "isStrictBindReservedWord", {
    enumerable: true,
    get: function () {
      return _keyword.isStrictBindReservedWord
    },
  })
  Object.defineProperty(exports, "isStrictReservedWord", {
    enumerable: true,
    get: function () {
      return _keyword.isStrictReservedWord
    },
  })
  Object.defineProperty(exports, "isKeyword", {
    enumerable: true,
    get: function () {
      return _keyword.isKeyword
    },
  })
  var _identifier = require_identifier()
  var _keyword = require_keyword()
})

// node_modules/escape-string-regexp/index.js
var require_escape_string_regexp = __commonJS((exports, module) => {
  "use strict"
  var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g
  module.exports = function (str) {
    if (typeof str !== "string") {
      throw new TypeError("Expected a string")
    }
    return str.replace(matchOperatorsRe, "\\$&")
  }
})

// node_modules/color-convert/node_modules/color-name/index.js
var require_color_name = __commonJS((exports, module) => {
  "use strict"
  module.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  }
})

// node_modules/color-convert/conversions.js
var require_conversions = __commonJS((exports, module) => {
  var cssKeywords = require_color_name()
  var reverseKeywords = {}
  for (var key in cssKeywords) {
    if (cssKeywords.hasOwnProperty(key)) {
      reverseKeywords[cssKeywords[key]] = key
    }
  }
  var convert = (module.exports = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] },
  })
  for (var model in convert) {
    if (convert.hasOwnProperty(model)) {
      if (!("channels" in convert[model])) {
        throw new Error("missing channels property: " + model)
      }
      if (!("labels" in convert[model])) {
        throw new Error("missing channel labels property: " + model)
      }
      if (convert[model].labels.length !== convert[model].channels) {
        throw new Error("channel and label counts mismatch: " + model)
      }
      channels = convert[model].channels
      labels = convert[model].labels
      delete convert[model].channels
      delete convert[model].labels
      Object.defineProperty(convert[model], "channels", { value: channels })
      Object.defineProperty(convert[model], "labels", { value: labels })
    }
  }
  var channels
  var labels
  convert.rgb.hsl = function (rgb) {
    var r = rgb[0] / 255
    var g = rgb[1] / 255
    var b = rgb[2] / 255
    var min = Math.min(r, g, b)
    var max = Math.max(r, g, b)
    var delta = max - min
    var h
    var s
    var l
    if (max === min) {
      h = 0
    } else if (r === max) {
      h = (g - b) / delta
    } else if (g === max) {
      h = 2 + (b - r) / delta
    } else if (b === max) {
      h = 4 + (r - g) / delta
    }
    h = Math.min(h * 60, 360)
    if (h < 0) {
      h += 360
    }
    l = (min + max) / 2
    if (max === min) {
      s = 0
    } else if (l <= 0.5) {
      s = delta / (max + min)
    } else {
      s = delta / (2 - max - min)
    }
    return [h, s * 100, l * 100]
  }
  convert.rgb.hsv = function (rgb) {
    var rdif
    var gdif
    var bdif
    var h
    var s
    var r = rgb[0] / 255
    var g = rgb[1] / 255
    var b = rgb[2] / 255
    var v = Math.max(r, g, b)
    var diff = v - Math.min(r, g, b)
    var diffc = function (c) {
      return (v - c) / 6 / diff + 1 / 2
    }
    if (diff === 0) {
      h = s = 0
    } else {
      s = diff / v
      rdif = diffc(r)
      gdif = diffc(g)
      bdif = diffc(b)
      if (r === v) {
        h = bdif - gdif
      } else if (g === v) {
        h = 1 / 3 + rdif - bdif
      } else if (b === v) {
        h = 2 / 3 + gdif - rdif
      }
      if (h < 0) {
        h += 1
      } else if (h > 1) {
        h -= 1
      }
    }
    return [h * 360, s * 100, v * 100]
  }
  convert.rgb.hwb = function (rgb) {
    var r = rgb[0]
    var g = rgb[1]
    var b = rgb[2]
    var h = convert.rgb.hsl(rgb)[0]
    var w = (1 / 255) * Math.min(r, Math.min(g, b))
    b = 1 - (1 / 255) * Math.max(r, Math.max(g, b))
    return [h, w * 100, b * 100]
  }
  convert.rgb.cmyk = function (rgb) {
    var r = rgb[0] / 255
    var g = rgb[1] / 255
    var b = rgb[2] / 255
    var c
    var m
    var y
    var k
    k = Math.min(1 - r, 1 - g, 1 - b)
    c = (1 - r - k) / (1 - k) || 0
    m = (1 - g - k) / (1 - k) || 0
    y = (1 - b - k) / (1 - k) || 0
    return [c * 100, m * 100, y * 100, k * 100]
  }
  function comparativeDistance(x, y) {
    return (
      Math.pow(x[0] - y[0], 2) +
      Math.pow(x[1] - y[1], 2) +
      Math.pow(x[2] - y[2], 2)
    )
  }
  convert.rgb.keyword = function (rgb) {
    var reversed = reverseKeywords[rgb]
    if (reversed) {
      return reversed
    }
    var currentClosestDistance = Infinity
    var currentClosestKeyword
    for (var keyword in cssKeywords) {
      if (cssKeywords.hasOwnProperty(keyword)) {
        var value = cssKeywords[keyword]
        var distance = comparativeDistance(rgb, value)
        if (distance < currentClosestDistance) {
          currentClosestDistance = distance
          currentClosestKeyword = keyword
        }
      }
    }
    return currentClosestKeyword
  }
  convert.keyword.rgb = function (keyword) {
    return cssKeywords[keyword]
  }
  convert.rgb.xyz = function (rgb) {
    var r = rgb[0] / 255
    var g = rgb[1] / 255
    var b = rgb[2] / 255
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92
    var x = r * 0.4124 + g * 0.3576 + b * 0.1805
    var y = r * 0.2126 + g * 0.7152 + b * 0.0722
    var z = r * 0.0193 + g * 0.1192 + b * 0.9505
    return [x * 100, y * 100, z * 100]
  }
  convert.rgb.lab = function (rgb) {
    var xyz = convert.rgb.xyz(rgb)
    var x = xyz[0]
    var y = xyz[1]
    var z = xyz[2]
    var l
    var a
    var b
    x /= 95.047
    y /= 100
    z /= 108.883
    x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
    y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
    z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116
    l = 116 * y - 16
    a = 500 * (x - y)
    b = 200 * (y - z)
    return [l, a, b]
  }
  convert.hsl.rgb = function (hsl) {
    var h = hsl[0] / 360
    var s = hsl[1] / 100
    var l = hsl[2] / 100
    var t1
    var t2
    var t3
    var rgb
    var val
    if (s === 0) {
      val = l * 255
      return [val, val, val]
    }
    if (l < 0.5) {
      t2 = l * (1 + s)
    } else {
      t2 = l + s - l * s
    }
    t1 = 2 * l - t2
    rgb = [0, 0, 0]
    for (var i = 0; i < 3; i++) {
      t3 = h + (1 / 3) * -(i - 1)
      if (t3 < 0) {
        t3++
      }
      if (t3 > 1) {
        t3--
      }
      if (6 * t3 < 1) {
        val = t1 + (t2 - t1) * 6 * t3
      } else if (2 * t3 < 1) {
        val = t2
      } else if (3 * t3 < 2) {
        val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
      } else {
        val = t1
      }
      rgb[i] = val * 255
    }
    return rgb
  }
  convert.hsl.hsv = function (hsl) {
    var h = hsl[0]
    var s = hsl[1] / 100
    var l = hsl[2] / 100
    var smin = s
    var lmin = Math.max(l, 0.01)
    var sv
    var v
    l *= 2
    s *= l <= 1 ? l : 2 - l
    smin *= lmin <= 1 ? lmin : 2 - lmin
    v = (l + s) / 2
    sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)
    return [h, sv * 100, v * 100]
  }
  convert.hsv.rgb = function (hsv) {
    var h = hsv[0] / 60
    var s = hsv[1] / 100
    var v = hsv[2] / 100
    var hi = Math.floor(h) % 6
    var f = h - Math.floor(h)
    var p = 255 * v * (1 - s)
    var q = 255 * v * (1 - s * f)
    var t = 255 * v * (1 - s * (1 - f))
    v *= 255
    switch (hi) {
      case 0:
        return [v, t, p]
      case 1:
        return [q, v, p]
      case 2:
        return [p, v, t]
      case 3:
        return [p, q, v]
      case 4:
        return [t, p, v]
      case 5:
        return [v, p, q]
    }
  }
  convert.hsv.hsl = function (hsv) {
    var h = hsv[0]
    var s = hsv[1] / 100
    var v = hsv[2] / 100
    var vmin = Math.max(v, 0.01)
    var lmin
    var sl
    var l
    l = (2 - s) * v
    lmin = (2 - s) * vmin
    sl = s * vmin
    sl /= lmin <= 1 ? lmin : 2 - lmin
    sl = sl || 0
    l /= 2
    return [h, sl * 100, l * 100]
  }
  convert.hwb.rgb = function (hwb) {
    var h = hwb[0] / 360
    var wh = hwb[1] / 100
    var bl = hwb[2] / 100
    var ratio = wh + bl
    var i
    var v
    var f
    var n
    if (ratio > 1) {
      wh /= ratio
      bl /= ratio
    }
    i = Math.floor(6 * h)
    v = 1 - bl
    f = 6 * h - i
    if ((i & 1) !== 0) {
      f = 1 - f
    }
    n = wh + f * (v - wh)
    var r
    var g
    var b
    switch (i) {
      default:
      case 6:
      case 0:
        r = v
        g = n
        b = wh
        break
      case 1:
        r = n
        g = v
        b = wh
        break
      case 2:
        r = wh
        g = v
        b = n
        break
      case 3:
        r = wh
        g = n
        b = v
        break
      case 4:
        r = n
        g = wh
        b = v
        break
      case 5:
        r = v
        g = wh
        b = n
        break
    }
    return [r * 255, g * 255, b * 255]
  }
  convert.cmyk.rgb = function (cmyk) {
    var c = cmyk[0] / 100
    var m = cmyk[1] / 100
    var y = cmyk[2] / 100
    var k = cmyk[3] / 100
    var r
    var g
    var b
    r = 1 - Math.min(1, c * (1 - k) + k)
    g = 1 - Math.min(1, m * (1 - k) + k)
    b = 1 - Math.min(1, y * (1 - k) + k)
    return [r * 255, g * 255, b * 255]
  }
  convert.xyz.rgb = function (xyz) {
    var x = xyz[0] / 100
    var y = xyz[1] / 100
    var z = xyz[2] / 100
    var r
    var g
    var b
    r = x * 3.2406 + y * -1.5372 + z * -0.4986
    g = x * -0.9689 + y * 1.8758 + z * 0.0415
    b = x * 0.0557 + y * -0.204 + z * 1.057
    r = r > 31308e-7 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : r * 12.92
    g = g > 31308e-7 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : g * 12.92
    b = b > 31308e-7 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : b * 12.92
    r = Math.min(Math.max(0, r), 1)
    g = Math.min(Math.max(0, g), 1)
    b = Math.min(Math.max(0, b), 1)
    return [r * 255, g * 255, b * 255]
  }
  convert.xyz.lab = function (xyz) {
    var x = xyz[0]
    var y = xyz[1]
    var z = xyz[2]
    var l
    var a
    var b
    x /= 95.047
    y /= 100
    z /= 108.883
    x = x > 8856e-6 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116
    y = y > 8856e-6 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116
    z = z > 8856e-6 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116
    l = 116 * y - 16
    a = 500 * (x - y)
    b = 200 * (y - z)
    return [l, a, b]
  }
  convert.lab.xyz = function (lab) {
    var l = lab[0]
    var a = lab[1]
    var b = lab[2]
    var x
    var y
    var z
    y = (l + 16) / 116
    x = a / 500 + y
    z = y - b / 200
    var y2 = Math.pow(y, 3)
    var x2 = Math.pow(x, 3)
    var z2 = Math.pow(z, 3)
    y = y2 > 8856e-6 ? y2 : (y - 16 / 116) / 7.787
    x = x2 > 8856e-6 ? x2 : (x - 16 / 116) / 7.787
    z = z2 > 8856e-6 ? z2 : (z - 16 / 116) / 7.787
    x *= 95.047
    y *= 100
    z *= 108.883
    return [x, y, z]
  }
  convert.lab.lch = function (lab) {
    var l = lab[0]
    var a = lab[1]
    var b = lab[2]
    var hr
    var h
    var c
    hr = Math.atan2(b, a)
    h = (hr * 360) / 2 / Math.PI
    if (h < 0) {
      h += 360
    }
    c = Math.sqrt(a * a + b * b)
    return [l, c, h]
  }
  convert.lch.lab = function (lch) {
    var l = lch[0]
    var c = lch[1]
    var h = lch[2]
    var a
    var b
    var hr
    hr = (h / 360) * 2 * Math.PI
    a = c * Math.cos(hr)
    b = c * Math.sin(hr)
    return [l, a, b]
  }
  convert.rgb.ansi16 = function (args) {
    var r = args[0]
    var g = args[1]
    var b = args[2]
    var value = 1 in arguments ? arguments[1] : convert.rgb.hsv(args)[2]
    value = Math.round(value / 50)
    if (value === 0) {
      return 30
    }
    var ansi =
      30 +
      ((Math.round(b / 255) << 2) |
        (Math.round(g / 255) << 1) |
        Math.round(r / 255))
    if (value === 2) {
      ansi += 60
    }
    return ansi
  }
  convert.hsv.ansi16 = function (args) {
    return convert.rgb.ansi16(convert.hsv.rgb(args), args[2])
  }
  convert.rgb.ansi256 = function (args) {
    var r = args[0]
    var g = args[1]
    var b = args[2]
    if (r === g && g === b) {
      if (r < 8) {
        return 16
      }
      if (r > 248) {
        return 231
      }
      return Math.round(((r - 8) / 247) * 24) + 232
    }
    var ansi =
      16 +
      36 * Math.round((r / 255) * 5) +
      6 * Math.round((g / 255) * 5) +
      Math.round((b / 255) * 5)
    return ansi
  }
  convert.ansi16.rgb = function (args) {
    var color = args % 10
    if (color === 0 || color === 7) {
      if (args > 50) {
        color += 3.5
      }
      color = (color / 10.5) * 255
      return [color, color, color]
    }
    var mult = (~~(args > 50) + 1) * 0.5
    var r = (color & 1) * mult * 255
    var g = ((color >> 1) & 1) * mult * 255
    var b = ((color >> 2) & 1) * mult * 255
    return [r, g, b]
  }
  convert.ansi256.rgb = function (args) {
    if (args >= 232) {
      var c = (args - 232) * 10 + 8
      return [c, c, c]
    }
    args -= 16
    var rem
    var r = (Math.floor(args / 36) / 5) * 255
    var g = (Math.floor((rem = args % 36) / 6) / 5) * 255
    var b = ((rem % 6) / 5) * 255
    return [r, g, b]
  }
  convert.rgb.hex = function (args) {
    var integer =
      ((Math.round(args[0]) & 255) << 16) +
      ((Math.round(args[1]) & 255) << 8) +
      (Math.round(args[2]) & 255)
    var string = integer.toString(16).toUpperCase()
    return "000000".substring(string.length) + string
  }
  convert.hex.rgb = function (args) {
    var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i)
    if (!match) {
      return [0, 0, 0]
    }
    var colorString = match[0]
    if (match[0].length === 3) {
      colorString = colorString
        .split("")
        .map(function (char) {
          return char + char
        })
        .join("")
    }
    var integer = parseInt(colorString, 16)
    var r = (integer >> 16) & 255
    var g = (integer >> 8) & 255
    var b = integer & 255
    return [r, g, b]
  }
  convert.rgb.hcg = function (rgb) {
    var r = rgb[0] / 255
    var g = rgb[1] / 255
    var b = rgb[2] / 255
    var max = Math.max(Math.max(r, g), b)
    var min = Math.min(Math.min(r, g), b)
    var chroma = max - min
    var grayscale
    var hue
    if (chroma < 1) {
      grayscale = min / (1 - chroma)
    } else {
      grayscale = 0
    }
    if (chroma <= 0) {
      hue = 0
    } else if (max === r) {
      hue = ((g - b) / chroma) % 6
    } else if (max === g) {
      hue = 2 + (b - r) / chroma
    } else {
      hue = 4 + (r - g) / chroma + 4
    }
    hue /= 6
    hue %= 1
    return [hue * 360, chroma * 100, grayscale * 100]
  }
  convert.hsl.hcg = function (hsl) {
    var s = hsl[1] / 100
    var l = hsl[2] / 100
    var c = 1
    var f = 0
    if (l < 0.5) {
      c = 2 * s * l
    } else {
      c = 2 * s * (1 - l)
    }
    if (c < 1) {
      f = (l - 0.5 * c) / (1 - c)
    }
    return [hsl[0], c * 100, f * 100]
  }
  convert.hsv.hcg = function (hsv) {
    var s = hsv[1] / 100
    var v = hsv[2] / 100
    var c = s * v
    var f = 0
    if (c < 1) {
      f = (v - c) / (1 - c)
    }
    return [hsv[0], c * 100, f * 100]
  }
  convert.hcg.rgb = function (hcg) {
    var h = hcg[0] / 360
    var c = hcg[1] / 100
    var g = hcg[2] / 100
    if (c === 0) {
      return [g * 255, g * 255, g * 255]
    }
    var pure = [0, 0, 0]
    var hi = (h % 1) * 6
    var v = hi % 1
    var w = 1 - v
    var mg = 0
    switch (Math.floor(hi)) {
      case 0:
        pure[0] = 1
        pure[1] = v
        pure[2] = 0
        break
      case 1:
        pure[0] = w
        pure[1] = 1
        pure[2] = 0
        break
      case 2:
        pure[0] = 0
        pure[1] = 1
        pure[2] = v
        break
      case 3:
        pure[0] = 0
        pure[1] = w
        pure[2] = 1
        break
      case 4:
        pure[0] = v
        pure[1] = 0
        pure[2] = 1
        break
      default:
        pure[0] = 1
        pure[1] = 0
        pure[2] = w
    }
    mg = (1 - c) * g
    return [
      (c * pure[0] + mg) * 255,
      (c * pure[1] + mg) * 255,
      (c * pure[2] + mg) * 255,
    ]
  }
  convert.hcg.hsv = function (hcg) {
    var c = hcg[1] / 100
    var g = hcg[2] / 100
    var v = c + g * (1 - c)
    var f = 0
    if (v > 0) {
      f = c / v
    }
    return [hcg[0], f * 100, v * 100]
  }
  convert.hcg.hsl = function (hcg) {
    var c = hcg[1] / 100
    var g = hcg[2] / 100
    var l = g * (1 - c) + 0.5 * c
    var s = 0
    if (l > 0 && l < 0.5) {
      s = c / (2 * l)
    } else if (l >= 0.5 && l < 1) {
      s = c / (2 * (1 - l))
    }
    return [hcg[0], s * 100, l * 100]
  }
  convert.hcg.hwb = function (hcg) {
    var c = hcg[1] / 100
    var g = hcg[2] / 100
    var v = c + g * (1 - c)
    return [hcg[0], (v - c) * 100, (1 - v) * 100]
  }
  convert.hwb.hcg = function (hwb) {
    var w = hwb[1] / 100
    var b = hwb[2] / 100
    var v = 1 - b
    var c = v - w
    var g = 0
    if (c < 1) {
      g = (v - c) / (1 - c)
    }
    return [hwb[0], c * 100, g * 100]
  }
  convert.apple.rgb = function (apple) {
    return [
      (apple[0] / 65535) * 255,
      (apple[1] / 65535) * 255,
      (apple[2] / 65535) * 255,
    ]
  }
  convert.rgb.apple = function (rgb) {
    return [
      (rgb[0] / 255) * 65535,
      (rgb[1] / 255) * 65535,
      (rgb[2] / 255) * 65535,
    ]
  }
  convert.gray.rgb = function (args) {
    return [(args[0] / 100) * 255, (args[0] / 100) * 255, (args[0] / 100) * 255]
  }
  convert.gray.hsl = convert.gray.hsv = function (args) {
    return [0, 0, args[0]]
  }
  convert.gray.hwb = function (gray) {
    return [0, 100, gray[0]]
  }
  convert.gray.cmyk = function (gray) {
    return [0, 0, 0, gray[0]]
  }
  convert.gray.lab = function (gray) {
    return [gray[0], 0, 0]
  }
  convert.gray.hex = function (gray) {
    var val = Math.round((gray[0] / 100) * 255) & 255
    var integer = (val << 16) + (val << 8) + val
    var string = integer.toString(16).toUpperCase()
    return "000000".substring(string.length) + string
  }
  convert.rgb.gray = function (rgb) {
    var val = (rgb[0] + rgb[1] + rgb[2]) / 3
    return [(val / 255) * 100]
  }
})

// node_modules/color-convert/route.js
var require_route = __commonJS((exports, module) => {
  var conversions = require_conversions()
  function buildGraph() {
    var graph = {}
    var models = Object.keys(conversions)
    for (var len = models.length, i = 0; i < len; i++) {
      graph[models[i]] = {
        distance: -1,
        parent: null,
      }
    }
    return graph
  }
  function deriveBFS(fromModel) {
    var graph = buildGraph()
    var queue = [fromModel]
    graph[fromModel].distance = 0
    while (queue.length) {
      var current = queue.pop()
      var adjacents = Object.keys(conversions[current])
      for (var len = adjacents.length, i = 0; i < len; i++) {
        var adjacent = adjacents[i]
        var node = graph[adjacent]
        if (node.distance === -1) {
          node.distance = graph[current].distance + 1
          node.parent = current
          queue.unshift(adjacent)
        }
      }
    }
    return graph
  }
  function link(from, to) {
    return function (args) {
      return to(from(args))
    }
  }
  function wrapConversion(toModel, graph) {
    var path = [graph[toModel].parent, toModel]
    var fn = conversions[graph[toModel].parent][toModel]
    var cur = graph[toModel].parent
    while (graph[cur].parent) {
      path.unshift(graph[cur].parent)
      fn = link(conversions[graph[cur].parent][cur], fn)
      cur = graph[cur].parent
    }
    fn.conversion = path
    return fn
  }
  module.exports = function (fromModel) {
    var graph = deriveBFS(fromModel)
    var conversion = {}
    var models = Object.keys(graph)
    for (var len = models.length, i = 0; i < len; i++) {
      var toModel = models[i]
      var node = graph[toModel]
      if (node.parent === null) {
        continue
      }
      conversion[toModel] = wrapConversion(toModel, graph)
    }
    return conversion
  }
})

// node_modules/color-convert/index.js
var require_color_convert = __commonJS((exports, module) => {
  var conversions = require_conversions()
  var route = require_route()
  var convert = {}
  var models = Object.keys(conversions)
  function wrapRaw(fn) {
    var wrappedFn = function (args) {
      if (args === void 0 || args === null) {
        return args
      }
      if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments)
      }
      return fn(args)
    }
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion
    }
    return wrappedFn
  }
  function wrapRounded(fn) {
    var wrappedFn = function (args) {
      if (args === void 0 || args === null) {
        return args
      }
      if (arguments.length > 1) {
        args = Array.prototype.slice.call(arguments)
      }
      var result = fn(args)
      if (typeof result === "object") {
        for (var len = result.length, i = 0; i < len; i++) {
          result[i] = Math.round(result[i])
        }
      }
      return result
    }
    if ("conversion" in fn) {
      wrappedFn.conversion = fn.conversion
    }
    return wrappedFn
  }
  models.forEach(function (fromModel) {
    convert[fromModel] = {}
    Object.defineProperty(convert[fromModel], "channels", {
      value: conversions[fromModel].channels,
    })
    Object.defineProperty(convert[fromModel], "labels", {
      value: conversions[fromModel].labels,
    })
    var routes = route(fromModel)
    var routeModels = Object.keys(routes)
    routeModels.forEach(function (toModel) {
      var fn = routes[toModel]
      convert[fromModel][toModel] = wrapRounded(fn)
      convert[fromModel][toModel].raw = wrapRaw(fn)
    })
  })
  module.exports = convert
})

// node_modules/chalk/node_modules/ansi-styles/index.js
var require_ansi_styles = __commonJS((exports, module) => {
  "use strict"
  var colorConvert = require_color_convert()
  var wrapAnsi16 = (fn, offset) =>
    function () {
      const code = fn.apply(colorConvert, arguments)
      return `[${code + offset}m`
    }
  var wrapAnsi256 = (fn, offset) =>
    function () {
      const code = fn.apply(colorConvert, arguments)
      return `[${38 + offset};5;${code}m`
    }
  var wrapAnsi16m = (fn, offset) =>
    function () {
      const rgb = fn.apply(colorConvert, arguments)
      return `[${38 + offset};2;${rgb[0]};${rgb[1]};${rgb[2]}m`
    }
  function assembleStyles() {
    const codes = new Map()
    const styles = {
      modifier: {
        reset: [0, 0],
        bold: [1, 22],
        dim: [2, 22],
        italic: [3, 23],
        underline: [4, 24],
        inverse: [7, 27],
        hidden: [8, 28],
        strikethrough: [9, 29],
      },
      color: {
        black: [30, 39],
        red: [31, 39],
        green: [32, 39],
        yellow: [33, 39],
        blue: [34, 39],
        magenta: [35, 39],
        cyan: [36, 39],
        white: [37, 39],
        gray: [90, 39],
        redBright: [91, 39],
        greenBright: [92, 39],
        yellowBright: [93, 39],
        blueBright: [94, 39],
        magentaBright: [95, 39],
        cyanBright: [96, 39],
        whiteBright: [97, 39],
      },
      bgColor: {
        bgBlack: [40, 49],
        bgRed: [41, 49],
        bgGreen: [42, 49],
        bgYellow: [43, 49],
        bgBlue: [44, 49],
        bgMagenta: [45, 49],
        bgCyan: [46, 49],
        bgWhite: [47, 49],
        bgBlackBright: [100, 49],
        bgRedBright: [101, 49],
        bgGreenBright: [102, 49],
        bgYellowBright: [103, 49],
        bgBlueBright: [104, 49],
        bgMagentaBright: [105, 49],
        bgCyanBright: [106, 49],
        bgWhiteBright: [107, 49],
      },
    }
    styles.color.grey = styles.color.gray
    for (const groupName of Object.keys(styles)) {
      const group = styles[groupName]
      for (const styleName of Object.keys(group)) {
        const style = group[styleName]
        styles[styleName] = {
          open: `[${style[0]}m`,
          close: `[${style[1]}m`,
        }
        group[styleName] = styles[styleName]
        codes.set(style[0], style[1])
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false,
      })
      Object.defineProperty(styles, "codes", {
        value: codes,
        enumerable: false,
      })
    }
    const ansi2ansi = (n) => n
    const rgb2rgb = (r, g, b) => [r, g, b]
    styles.color.close = "[39m"
    styles.bgColor.close = "[49m"
    styles.color.ansi = {
      ansi: wrapAnsi16(ansi2ansi, 0),
    }
    styles.color.ansi256 = {
      ansi256: wrapAnsi256(ansi2ansi, 0),
    }
    styles.color.ansi16m = {
      rgb: wrapAnsi16m(rgb2rgb, 0),
    }
    styles.bgColor.ansi = {
      ansi: wrapAnsi16(ansi2ansi, 10),
    }
    styles.bgColor.ansi256 = {
      ansi256: wrapAnsi256(ansi2ansi, 10),
    }
    styles.bgColor.ansi16m = {
      rgb: wrapAnsi16m(rgb2rgb, 10),
    }
    for (let key of Object.keys(colorConvert)) {
      if (typeof colorConvert[key] !== "object") {
        continue
      }
      const suite = colorConvert[key]
      if (key === "ansi16") {
        key = "ansi"
      }
      if ("ansi16" in suite) {
        styles.color.ansi[key] = wrapAnsi16(suite.ansi16, 0)
        styles.bgColor.ansi[key] = wrapAnsi16(suite.ansi16, 10)
      }
      if ("ansi256" in suite) {
        styles.color.ansi256[key] = wrapAnsi256(suite.ansi256, 0)
        styles.bgColor.ansi256[key] = wrapAnsi256(suite.ansi256, 10)
      }
      if ("rgb" in suite) {
        styles.color.ansi16m[key] = wrapAnsi16m(suite.rgb, 0)
        styles.bgColor.ansi16m[key] = wrapAnsi16m(suite.rgb, 10)
      }
    }
    return styles
  }
  Object.defineProperty(module, "exports", {
    enumerable: true,
    get: assembleStyles,
  })
})

// node_modules/has-flag/index.js
var require_has_flag = __commonJS((exports, module) => {
  "use strict"
  module.exports = (flag, argv) => {
    argv = argv || process.argv
    const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--"
    const pos = argv.indexOf(prefix + flag)
    const terminatorPos = argv.indexOf("--")
    return pos !== -1 && (terminatorPos === -1 ? true : pos < terminatorPos)
  }
})

// node_modules/chalk/node_modules/supports-color/index.js
var require_supports_color = __commonJS((exports, module) => {
  "use strict"
  var os = require("os")
  var hasFlag = require_has_flag()
  var env = process.env
  var forceColor
  if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
    forceColor = false
  } else if (
    hasFlag("color") ||
    hasFlag("colors") ||
    hasFlag("color=true") ||
    hasFlag("color=always")
  ) {
    forceColor = true
  }
  if ("FORCE_COLOR" in env) {
    forceColor =
      env.FORCE_COLOR.length === 0 || parseInt(env.FORCE_COLOR, 10) !== 0
  }
  function translateLevel(level) {
    if (level === 0) {
      return false
    }
    return {
      level,
      hasBasic: true,
      has256: level >= 2,
      has16m: level >= 3,
    }
  }
  function supportsColor(stream) {
    if (forceColor === false) {
      return 0
    }
    if (
      hasFlag("color=16m") ||
      hasFlag("color=full") ||
      hasFlag("color=truecolor")
    ) {
      return 3
    }
    if (hasFlag("color=256")) {
      return 2
    }
    if (stream && !stream.isTTY && forceColor !== true) {
      return 0
    }
    const min = forceColor ? 1 : 0
    if (process.platform === "win32") {
      const osRelease = os.release().split(".")
      if (
        Number(process.versions.node.split(".")[0]) >= 8 &&
        Number(osRelease[0]) >= 10 &&
        Number(osRelease[2]) >= 10586
      ) {
        return Number(osRelease[2]) >= 14931 ? 3 : 2
      }
      return 1
    }
    if ("CI" in env) {
      if (
        ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(
          (sign) => sign in env,
        ) ||
        env.CI_NAME === "codeship"
      ) {
        return 1
      }
      return min
    }
    if ("TEAMCITY_VERSION" in env) {
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0
    }
    if (env.COLORTERM === "truecolor") {
      return 3
    }
    if ("TERM_PROGRAM" in env) {
      const version = parseInt(
        (env.TERM_PROGRAM_VERSION || "").split(".")[0],
        10,
      )
      switch (env.TERM_PROGRAM) {
        case "iTerm.app":
          return version >= 3 ? 3 : 2
        case "Apple_Terminal":
          return 2
      }
    }
    if (/-256(color)?$/i.test(env.TERM)) {
      return 2
    }
    if (
      /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(
        env.TERM,
      )
    ) {
      return 1
    }
    if ("COLORTERM" in env) {
      return 1
    }
    if (env.TERM === "dumb") {
      return min
    }
    return min
  }
  function getSupportLevel(stream) {
    const level = supportsColor(stream)
    return translateLevel(level)
  }
  module.exports = {
    supportsColor: getSupportLevel,
    stdout: getSupportLevel(process.stdout),
    stderr: getSupportLevel(process.stderr),
  }
})

// node_modules/chalk/templates.js
var require_templates = __commonJS((exports, module) => {
  "use strict"
  var TEMPLATE_REGEX = /(?:\\(u[a-f\d]{4}|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi
  var STYLE_REGEX = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g
  var STRING_REGEX = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/
  var ESCAPE_REGEX = /\\(u[a-f\d]{4}|x[a-f\d]{2}|.)|([^\\])/gi
  var ESCAPES = new Map([
    ["n", "\n"],
    ["r", "\r"],
    ["t", "	"],
    ["b", "\b"],
    ["f", "\f"],
    ["v", "\v"],
    ["0", "\0"],
    ["\\", "\\"],
    ["e", ""],
    ["a", "\x07"],
  ])
  function unescape(c) {
    if ((c[0] === "u" && c.length === 5) || (c[0] === "x" && c.length === 3)) {
      return String.fromCharCode(parseInt(c.slice(1), 16))
    }
    return ESCAPES.get(c) || c
  }
  function parseArguments(name, args) {
    const results = []
    const chunks = args.trim().split(/\s*,\s*/g)
    let matches
    for (const chunk of chunks) {
      if (!isNaN(chunk)) {
        results.push(Number(chunk))
      } else if ((matches = chunk.match(STRING_REGEX))) {
        results.push(
          matches[2].replace(ESCAPE_REGEX, (m, escape, chr) =>
            escape ? unescape(escape) : chr,
          ),
        )
      } else {
        throw new Error(
          `Invalid Chalk template style argument: ${chunk} (in style '${name}')`,
        )
      }
    }
    return results
  }
  function parseStyle(style) {
    STYLE_REGEX.lastIndex = 0
    const results = []
    let matches
    while ((matches = STYLE_REGEX.exec(style)) !== null) {
      const name = matches[1]
      if (matches[2]) {
        const args = parseArguments(name, matches[2])
        results.push([name].concat(args))
      } else {
        results.push([name])
      }
    }
    return results
  }
  function buildStyle(chalk, styles) {
    const enabled = {}
    for (const layer of styles) {
      for (const style of layer.styles) {
        enabled[style[0]] = layer.inverse ? null : style.slice(1)
      }
    }
    let current = chalk
    for (const styleName of Object.keys(enabled)) {
      if (Array.isArray(enabled[styleName])) {
        if (!(styleName in current)) {
          throw new Error(`Unknown Chalk style: ${styleName}`)
        }
        if (enabled[styleName].length > 0) {
          current = current[styleName].apply(current, enabled[styleName])
        } else {
          current = current[styleName]
        }
      }
    }
    return current
  }
  module.exports = (chalk, tmp) => {
    const styles = []
    const chunks = []
    let chunk = []
    tmp.replace(TEMPLATE_REGEX, (m, escapeChar, inverse, style, close, chr) => {
      if (escapeChar) {
        chunk.push(unescape(escapeChar))
      } else if (style) {
        const str = chunk.join("")
        chunk = []
        chunks.push(styles.length === 0 ? str : buildStyle(chalk, styles)(str))
        styles.push({ inverse, styles: parseStyle(style) })
      } else if (close) {
        if (styles.length === 0) {
          throw new Error("Found extraneous } in Chalk template literal")
        }
        chunks.push(buildStyle(chalk, styles)(chunk.join("")))
        chunk = []
        styles.pop()
      } else {
        chunk.push(chr)
      }
    })
    chunks.push(chunk.join(""))
    if (styles.length > 0) {
      const errMsg = `Chalk template literal is missing ${
        styles.length
      } closing bracket${styles.length === 1 ? "" : "s"} (\`}\`)`
      throw new Error(errMsg)
    }
    return chunks.join("")
  }
})

// node_modules/chalk/index.js
var require_chalk = __commonJS((exports, module) => {
  "use strict"
  var escapeStringRegexp = require_escape_string_regexp()
  var ansiStyles = require_ansi_styles()
  var stdoutColor = require_supports_color().stdout
  var template = require_templates()
  var isSimpleWindowsTerm =
    process.platform === "win32" &&
    !(process.env.TERM || "").toLowerCase().startsWith("xterm")
  var levelMapping = ["ansi", "ansi", "ansi256", "ansi16m"]
  var skipModels = new Set(["gray"])
  var styles = Object.create(null)
  function applyOptions(obj, options) {
    options = options || {}
    const scLevel = stdoutColor ? stdoutColor.level : 0
    obj.level = options.level === void 0 ? scLevel : options.level
    obj.enabled = "enabled" in options ? options.enabled : obj.level > 0
  }
  function Chalk(options) {
    if (!this || !(this instanceof Chalk) || this.template) {
      const chalk = {}
      applyOptions(chalk, options)
      chalk.template = function () {
        const args = [].slice.call(arguments)
        return chalkTag.apply(null, [chalk.template].concat(args))
      }
      Object.setPrototypeOf(chalk, Chalk.prototype)
      Object.setPrototypeOf(chalk.template, chalk)
      chalk.template.constructor = Chalk
      return chalk.template
    }
    applyOptions(this, options)
  }
  if (isSimpleWindowsTerm) {
    ansiStyles.blue.open = "[94m"
  }
  for (const key of Object.keys(ansiStyles)) {
    ansiStyles[key].closeRe = new RegExp(
      escapeStringRegexp(ansiStyles[key].close),
      "g",
    )
    styles[key] = {
      get() {
        const codes = ansiStyles[key]
        return build.call(
          this,
          this._styles ? this._styles.concat(codes) : [codes],
          this._empty,
          key,
        )
      },
    }
  }
  styles.visible = {
    get() {
      return build.call(this, this._styles || [], true, "visible")
    },
  }
  ansiStyles.color.closeRe = new RegExp(
    escapeStringRegexp(ansiStyles.color.close),
    "g",
  )
  for (const model of Object.keys(ansiStyles.color.ansi)) {
    if (skipModels.has(model)) {
      continue
    }
    styles[model] = {
      get() {
        const level = this.level
        return function () {
          const open = ansiStyles.color[levelMapping[level]][model].apply(
            null,
            arguments,
          )
          const codes = {
            open,
            close: ansiStyles.color.close,
            closeRe: ansiStyles.color.closeRe,
          }
          return build.call(
            this,
            this._styles ? this._styles.concat(codes) : [codes],
            this._empty,
            model,
          )
        }
      },
    }
  }
  ansiStyles.bgColor.closeRe = new RegExp(
    escapeStringRegexp(ansiStyles.bgColor.close),
    "g",
  )
  for (const model of Object.keys(ansiStyles.bgColor.ansi)) {
    if (skipModels.has(model)) {
      continue
    }
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1)
    styles[bgModel] = {
      get() {
        const level = this.level
        return function () {
          const open = ansiStyles.bgColor[levelMapping[level]][model].apply(
            null,
            arguments,
          )
          const codes = {
            open,
            close: ansiStyles.bgColor.close,
            closeRe: ansiStyles.bgColor.closeRe,
          }
          return build.call(
            this,
            this._styles ? this._styles.concat(codes) : [codes],
            this._empty,
            model,
          )
        }
      },
    }
  }
  var proto = Object.defineProperties(() => {}, styles)
  function build(_styles, _empty, key) {
    const builder = function () {
      return applyStyle.apply(builder, arguments)
    }
    builder._styles = _styles
    builder._empty = _empty
    const self = this
    Object.defineProperty(builder, "level", {
      enumerable: true,
      get() {
        return self.level
      },
      set(level) {
        self.level = level
      },
    })
    Object.defineProperty(builder, "enabled", {
      enumerable: true,
      get() {
        return self.enabled
      },
      set(enabled) {
        self.enabled = enabled
      },
    })
    builder.hasGrey = this.hasGrey || key === "gray" || key === "grey"
    builder.__proto__ = proto
    return builder
  }
  function applyStyle() {
    const args = arguments
    const argsLen = args.length
    let str = String(arguments[0])
    if (argsLen === 0) {
      return ""
    }
    if (argsLen > 1) {
      for (let a = 1; a < argsLen; a++) {
        str += " " + args[a]
      }
    }
    if (!this.enabled || this.level <= 0 || !str) {
      return this._empty ? "" : str
    }
    const originalDim = ansiStyles.dim.open
    if (isSimpleWindowsTerm && this.hasGrey) {
      ansiStyles.dim.open = ""
    }
    for (const code of this._styles.slice().reverse()) {
      str = code.open + str.replace(code.closeRe, code.open) + code.close
      str = str.replace(/\r?\n/g, `${code.close}$&${code.open}`)
    }
    ansiStyles.dim.open = originalDim
    return str
  }
  function chalkTag(chalk, strings) {
    if (!Array.isArray(strings)) {
      return [].slice.call(arguments, 1).join(" ")
    }
    const args = [].slice.call(arguments, 2)
    const parts = [strings.raw[0]]
    for (let i = 1; i < strings.length; i++) {
      parts.push(String(args[i - 1]).replace(/[{}\\]/g, "\\$&"))
      parts.push(String(strings.raw[i]))
    }
    return template(chalk, parts.join(""))
  }
  Object.defineProperties(Chalk.prototype, styles)
  module.exports = Chalk()
  module.exports.supportsColor = stdoutColor
  module.exports.default = module.exports
})

// node_modules/parse-json/node_modules/@babel/highlight/lib/index.js
var require_lib2 = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports.shouldHighlight = shouldHighlight
  exports.getChalk = getChalk
  exports.default = highlight
  var _jsTokens = _interopRequireWildcard(require_js_tokens())
  var _helperValidatorIdentifier = require_lib()
  var _chalk = _interopRequireDefault(require_chalk())
  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj }
  }
  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null
    var cache = new WeakMap()
    _getRequireWildcardCache = function () {
      return cache
    }
    return cache
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj
    }
    if (
      obj === null ||
      (typeof obj !== "object" && typeof obj !== "function")
    ) {
      return { default: obj }
    }
    var cache = _getRequireWildcardCache()
    if (cache && cache.has(obj)) {
      return cache.get(obj)
    }
    var newObj = {}
    var hasPropertyDescriptor =
      Object.defineProperty && Object.getOwnPropertyDescriptor
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor
          ? Object.getOwnPropertyDescriptor(obj, key)
          : null
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc)
        } else {
          newObj[key] = obj[key]
        }
      }
    }
    newObj.default = obj
    if (cache) {
      cache.set(obj, newObj)
    }
    return newObj
  }
  function getDefs(chalk) {
    return {
      keyword: chalk.cyan,
      capitalized: chalk.yellow,
      jsx_tag: chalk.yellow,
      punctuator: chalk.yellow,
      number: chalk.magenta,
      string: chalk.green,
      regex: chalk.magenta,
      comment: chalk.grey,
      invalid: chalk.white.bgRed.bold,
    }
  }
  var NEWLINE = /\r\n|[\n\r\u2028\u2029]/
  var JSX_TAG = /^[a-z][\w-]*$/i
  var BRACKET = /^[()[\]{}]$/
  function getTokenType(match) {
    const [offset, text] = match.slice(-2)
    const token = (0, _jsTokens.matchToToken)(match)
    if (token.type === "name") {
      if (
        (0, _helperValidatorIdentifier.isKeyword)(token.value) ||
        (0, _helperValidatorIdentifier.isReservedWord)(token.value)
      ) {
        return "keyword"
      }
      if (
        JSX_TAG.test(token.value) &&
        (text[offset - 1] === "<" || text.substr(offset - 2, 2) == "</")
      ) {
        return "jsx_tag"
      }
      if (token.value[0] !== token.value[0].toLowerCase()) {
        return "capitalized"
      }
    }
    if (token.type === "punctuator" && BRACKET.test(token.value)) {
      return "bracket"
    }
    if (
      token.type === "invalid" &&
      (token.value === "@" || token.value === "#")
    ) {
      return "punctuator"
    }
    return token.type
  }
  function highlightTokens(defs, text) {
    return text.replace(_jsTokens.default, function (...args) {
      const type = getTokenType(args)
      const colorize = defs[type]
      if (colorize) {
        return args[0]
          .split(NEWLINE)
          .map((str) => colorize(str))
          .join("\n")
      } else {
        return args[0]
      }
    })
  }
  function shouldHighlight(options) {
    return _chalk.default.supportsColor || options.forceColor
  }
  function getChalk(options) {
    let chalk = _chalk.default
    if (options.forceColor) {
      chalk = new _chalk.default.constructor({
        enabled: true,
        level: 1,
      })
    }
    return chalk
  }
  function highlight(code, options = {}) {
    if (shouldHighlight(options)) {
      const chalk = getChalk(options)
      const defs = getDefs(chalk)
      return highlightTokens(defs, code)
    } else {
      return code
    }
  }
})

// node_modules/parse-json/node_modules/@babel/code-frame/lib/index.js
var require_lib3 = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports.codeFrameColumns = codeFrameColumns
  exports.default = _default
  var _highlight = _interopRequireWildcard(require_lib2())
  function _getRequireWildcardCache() {
    if (typeof WeakMap !== "function") return null
    var cache = new WeakMap()
    _getRequireWildcardCache = function () {
      return cache
    }
    return cache
  }
  function _interopRequireWildcard(obj) {
    if (obj && obj.__esModule) {
      return obj
    }
    if (
      obj === null ||
      (typeof obj !== "object" && typeof obj !== "function")
    ) {
      return { default: obj }
    }
    var cache = _getRequireWildcardCache()
    if (cache && cache.has(obj)) {
      return cache.get(obj)
    }
    var newObj = {}
    var hasPropertyDescriptor =
      Object.defineProperty && Object.getOwnPropertyDescriptor
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        var desc = hasPropertyDescriptor
          ? Object.getOwnPropertyDescriptor(obj, key)
          : null
        if (desc && (desc.get || desc.set)) {
          Object.defineProperty(newObj, key, desc)
        } else {
          newObj[key] = obj[key]
        }
      }
    }
    newObj.default = obj
    if (cache) {
      cache.set(obj, newObj)
    }
    return newObj
  }
  var deprecationWarningShown = false
  function getDefs(chalk) {
    return {
      gutter: chalk.grey,
      marker: chalk.red.bold,
      message: chalk.red.bold,
    }
  }
  var NEWLINE = /\r\n|[\n\r\u2028\u2029]/
  function getMarkerLines(loc, source, opts) {
    const startLoc = Object.assign(
      {
        column: 0,
        line: -1,
      },
      loc.start,
    )
    const endLoc = Object.assign(Object.assign({}, startLoc), loc.end)
    const { linesAbove = 2, linesBelow = 3 } = opts || {}
    const startLine = startLoc.line
    const startColumn = startLoc.column
    const endLine = endLoc.line
    const endColumn = endLoc.column
    let start = Math.max(startLine - (linesAbove + 1), 0)
    let end = Math.min(source.length, endLine + linesBelow)
    if (startLine === -1) {
      start = 0
    }
    if (endLine === -1) {
      end = source.length
    }
    const lineDiff = endLine - startLine
    const markerLines = {}
    if (lineDiff) {
      for (let i = 0; i <= lineDiff; i++) {
        const lineNumber = i + startLine
        if (!startColumn) {
          markerLines[lineNumber] = true
        } else if (i === 0) {
          const sourceLength = source[lineNumber - 1].length
          markerLines[lineNumber] = [
            startColumn,
            sourceLength - startColumn + 1,
          ]
        } else if (i === lineDiff) {
          markerLines[lineNumber] = [0, endColumn]
        } else {
          const sourceLength = source[lineNumber - i].length
          markerLines[lineNumber] = [0, sourceLength]
        }
      }
    } else {
      if (startColumn === endColumn) {
        if (startColumn) {
          markerLines[startLine] = [startColumn, 0]
        } else {
          markerLines[startLine] = true
        }
      } else {
        markerLines[startLine] = [startColumn, endColumn - startColumn]
      }
    }
    return {
      start,
      end,
      markerLines,
    }
  }
  function codeFrameColumns(rawLines, loc, opts = {}) {
    const highlighted =
      (opts.highlightCode || opts.forceColor) &&
      (0, _highlight.shouldHighlight)(opts)
    const chalk = (0, _highlight.getChalk)(opts)
    const defs = getDefs(chalk)
    const maybeHighlight = (chalkFn, string) => {
      return highlighted ? chalkFn(string) : string
    }
    const lines = rawLines.split(NEWLINE)
    const { start, end, markerLines } = getMarkerLines(loc, lines, opts)
    const hasColumns = loc.start && typeof loc.start.column === "number"
    const numberMaxWidth = String(end).length
    const highlightedLines = highlighted
      ? (0, _highlight.default)(rawLines, opts)
      : rawLines
    let frame = highlightedLines
      .split(NEWLINE)
      .slice(start, end)
      .map((line, index) => {
        const number = start + 1 + index
        const paddedNumber = ` ${number}`.slice(-numberMaxWidth)
        const gutter = ` ${paddedNumber} | `
        const hasMarker = markerLines[number]
        const lastMarkerLine = !markerLines[number + 1]
        if (hasMarker) {
          let markerLine = ""
          if (Array.isArray(hasMarker)) {
            const markerSpacing = line
              .slice(0, Math.max(hasMarker[0] - 1, 0))
              .replace(/[^\t]/g, " ")
            const numberOfMarkers = hasMarker[1] || 1
            markerLine = [
              "\n ",
              maybeHighlight(defs.gutter, gutter.replace(/\d/g, " ")),
              markerSpacing,
              maybeHighlight(defs.marker, "^").repeat(numberOfMarkers),
            ].join("")
            if (lastMarkerLine && opts.message) {
              markerLine += " " + maybeHighlight(defs.message, opts.message)
            }
          }
          return [
            maybeHighlight(defs.marker, ">"),
            maybeHighlight(defs.gutter, gutter),
            line,
            markerLine,
          ].join("")
        } else {
          return ` ${maybeHighlight(defs.gutter, gutter)}${line}`
        }
      })
      .join("\n")
    if (opts.message && !hasColumns) {
      frame = `${" ".repeat(numberMaxWidth + 1)}${opts.message}
${frame}`
    }
    if (highlighted) {
      return chalk.reset(frame)
    } else {
      return frame
    }
  }
  function _default(rawLines, lineNumber, colNumber, opts = {}) {
    if (!deprecationWarningShown) {
      deprecationWarningShown = true
      const message =
        "Passing lineNumber and colNumber is deprecated to @babel/code-frame. Please use `codeFrameColumns`."
      if (process.emitWarning) {
        process.emitWarning(message, "DeprecationWarning")
      } else {
        const deprecationError = new Error(message)
        deprecationError.name = "DeprecationWarning"
        console.warn(new Error(message))
      }
    }
    colNumber = Math.max(colNumber, 0)
    const location = {
      start: {
        column: colNumber,
        line: lineNumber,
      },
    }
    return codeFrameColumns(rawLines, location, opts)
  }
})

// node_modules/parse-json/index.js
var require_parse_json = __commonJS((exports, module) => {
  "use strict"
  var errorEx = require_error_ex()
  var fallback = require_json_parse_better_errors()
  var { default: LinesAndColumns } = require_dist()
  var { codeFrameColumns } = require_lib3()
  var JSONError = errorEx("JSONError", {
    fileName: errorEx.append("in %s"),
    codeFrame: errorEx.append("\n\n%s\n"),
  })
  module.exports = (string, reviver, filename) => {
    if (typeof reviver === "string") {
      filename = reviver
      reviver = null
    }
    try {
      try {
        return JSON.parse(string, reviver)
      } catch (error) {
        fallback(string, reviver)
        throw error
      }
    } catch (error) {
      error.message = error.message.replace(/\n/g, "")
      const indexMatch = error.message.match(
        /in JSON at position (\d+) while parsing near/,
      )
      const jsonError = new JSONError(error)
      if (filename) {
        jsonError.fileName = filename
      }
      if (indexMatch && indexMatch.length > 0) {
        const lines = new LinesAndColumns(string)
        const index = Number(indexMatch[1])
        const location = lines.locationForIndex(index)
        const codeFrame = codeFrameColumns(
          string,
          { start: { line: location.line + 1, column: location.column + 1 } },
          { highlightCode: true },
        )
        jsonError.codeFrame = codeFrame
      }
      throw jsonError
    }
  }
})

// node_modules/semver/semver.js
var require_semver = __commonJS((exports, module) => {
  exports = module.exports = SemVer
  var debug
  if (
    typeof process === "object" &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)
  ) {
    debug = function () {
      var args = Array.prototype.slice.call(arguments, 0)
      args.unshift("SEMVER")
      console.log.apply(console, args)
    }
  } else {
    debug = function () {}
  }
  exports.SEMVER_SPEC_VERSION = "2.0.0"
  var MAX_LENGTH = 256
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991
  var MAX_SAFE_COMPONENT_LENGTH = 16
  var re = (exports.re = [])
  var src = (exports.src = [])
  var R = 0
  var NUMERICIDENTIFIER = R++
  src[NUMERICIDENTIFIER] = "0|[1-9]\\d*"
  var NUMERICIDENTIFIERLOOSE = R++
  src[NUMERICIDENTIFIERLOOSE] = "[0-9]+"
  var NONNUMERICIDENTIFIER = R++
  src[NONNUMERICIDENTIFIER] = "\\d*[a-zA-Z-][a-zA-Z0-9-]*"
  var MAINVERSION = R++
  src[MAINVERSION] =
    "(" +
    src[NUMERICIDENTIFIER] +
    ")\\.(" +
    src[NUMERICIDENTIFIER] +
    ")\\.(" +
    src[NUMERICIDENTIFIER] +
    ")"
  var MAINVERSIONLOOSE = R++
  src[MAINVERSIONLOOSE] =
    "(" +
    src[NUMERICIDENTIFIERLOOSE] +
    ")\\.(" +
    src[NUMERICIDENTIFIERLOOSE] +
    ")\\.(" +
    src[NUMERICIDENTIFIERLOOSE] +
    ")"
  var PRERELEASEIDENTIFIER = R++
  src[PRERELEASEIDENTIFIER] =
    "(?:" + src[NUMERICIDENTIFIER] + "|" + src[NONNUMERICIDENTIFIER] + ")"
  var PRERELEASEIDENTIFIERLOOSE = R++
  src[PRERELEASEIDENTIFIERLOOSE] =
    "(?:" + src[NUMERICIDENTIFIERLOOSE] + "|" + src[NONNUMERICIDENTIFIER] + ")"
  var PRERELEASE = R++
  src[PRERELEASE] =
    "(?:-(" +
    src[PRERELEASEIDENTIFIER] +
    "(?:\\." +
    src[PRERELEASEIDENTIFIER] +
    ")*))"
  var PRERELEASELOOSE = R++
  src[PRERELEASELOOSE] =
    "(?:-?(" +
    src[PRERELEASEIDENTIFIERLOOSE] +
    "(?:\\." +
    src[PRERELEASEIDENTIFIERLOOSE] +
    ")*))"
  var BUILDIDENTIFIER = R++
  src[BUILDIDENTIFIER] = "[0-9A-Za-z-]+"
  var BUILD = R++
  src[BUILD] =
    "(?:\\+(" + src[BUILDIDENTIFIER] + "(?:\\." + src[BUILDIDENTIFIER] + ")*))"
  var FULL = R++
  var FULLPLAIN =
    "v?" + src[MAINVERSION] + src[PRERELEASE] + "?" + src[BUILD] + "?"
  src[FULL] = "^" + FULLPLAIN + "$"
  var LOOSEPLAIN =
    "[v=\\s]*" +
    src[MAINVERSIONLOOSE] +
    src[PRERELEASELOOSE] +
    "?" +
    src[BUILD] +
    "?"
  var LOOSE = R++
  src[LOOSE] = "^" + LOOSEPLAIN + "$"
  var GTLT = R++
  src[GTLT] = "((?:<|>)?=?)"
  var XRANGEIDENTIFIERLOOSE = R++
  src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + "|x|X|\\*"
  var XRANGEIDENTIFIER = R++
  src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + "|x|X|\\*"
  var XRANGEPLAIN = R++
  src[XRANGEPLAIN] =
    "[v=\\s]*(" +
    src[XRANGEIDENTIFIER] +
    ")(?:\\.(" +
    src[XRANGEIDENTIFIER] +
    ")(?:\\.(" +
    src[XRANGEIDENTIFIER] +
    ")(?:" +
    src[PRERELEASE] +
    ")?" +
    src[BUILD] +
    "?)?)?"
  var XRANGEPLAINLOOSE = R++
  src[XRANGEPLAINLOOSE] =
    "[v=\\s]*(" +
    src[XRANGEIDENTIFIERLOOSE] +
    ")(?:\\.(" +
    src[XRANGEIDENTIFIERLOOSE] +
    ")(?:\\.(" +
    src[XRANGEIDENTIFIERLOOSE] +
    ")(?:" +
    src[PRERELEASELOOSE] +
    ")?" +
    src[BUILD] +
    "?)?)?"
  var XRANGE = R++
  src[XRANGE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAIN] + "$"
  var XRANGELOOSE = R++
  src[XRANGELOOSE] = "^" + src[GTLT] + "\\s*" + src[XRANGEPLAINLOOSE] + "$"
  var COERCE = R++
  src[COERCE] =
    "(?:^|[^\\d])(\\d{1," +
    MAX_SAFE_COMPONENT_LENGTH +
    "})(?:\\.(\\d{1," +
    MAX_SAFE_COMPONENT_LENGTH +
    "}))?(?:\\.(\\d{1," +
    MAX_SAFE_COMPONENT_LENGTH +
    "}))?(?:$|[^\\d])"
  var LONETILDE = R++
  src[LONETILDE] = "(?:~>?)"
  var TILDETRIM = R++
  src[TILDETRIM] = "(\\s*)" + src[LONETILDE] + "\\s+"
  re[TILDETRIM] = new RegExp(src[TILDETRIM], "g")
  var tildeTrimReplace = "$1~"
  var TILDE = R++
  src[TILDE] = "^" + src[LONETILDE] + src[XRANGEPLAIN] + "$"
  var TILDELOOSE = R++
  src[TILDELOOSE] = "^" + src[LONETILDE] + src[XRANGEPLAINLOOSE] + "$"
  var LONECARET = R++
  src[LONECARET] = "(?:\\^)"
  var CARETTRIM = R++
  src[CARETTRIM] = "(\\s*)" + src[LONECARET] + "\\s+"
  re[CARETTRIM] = new RegExp(src[CARETTRIM], "g")
  var caretTrimReplace = "$1^"
  var CARET = R++
  src[CARET] = "^" + src[LONECARET] + src[XRANGEPLAIN] + "$"
  var CARETLOOSE = R++
  src[CARETLOOSE] = "^" + src[LONECARET] + src[XRANGEPLAINLOOSE] + "$"
  var COMPARATORLOOSE = R++
  src[COMPARATORLOOSE] = "^" + src[GTLT] + "\\s*(" + LOOSEPLAIN + ")$|^$"
  var COMPARATOR = R++
  src[COMPARATOR] = "^" + src[GTLT] + "\\s*(" + FULLPLAIN + ")$|^$"
  var COMPARATORTRIM = R++
  src[COMPARATORTRIM] =
    "(\\s*)" + src[GTLT] + "\\s*(" + LOOSEPLAIN + "|" + src[XRANGEPLAIN] + ")"
  re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], "g")
  var comparatorTrimReplace = "$1$2$3"
  var HYPHENRANGE = R++
  src[HYPHENRANGE] =
    "^\\s*(" + src[XRANGEPLAIN] + ")\\s+-\\s+(" + src[XRANGEPLAIN] + ")\\s*$"
  var HYPHENRANGELOOSE = R++
  src[HYPHENRANGELOOSE] =
    "^\\s*(" +
    src[XRANGEPLAINLOOSE] +
    ")\\s+-\\s+(" +
    src[XRANGEPLAINLOOSE] +
    ")\\s*$"
  var STAR = R++
  src[STAR] = "(<|>)?=?\\s*\\*"
  for (var i = 0; i < R; i++) {
    debug(i, src[i])
    if (!re[i]) {
      re[i] = new RegExp(src[i])
    }
  }
  exports.parse = parse
  function parse(version, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }
    if (version instanceof SemVer) {
      return version
    }
    if (typeof version !== "string") {
      return null
    }
    if (version.length > MAX_LENGTH) {
      return null
    }
    var r = options.loose ? re[LOOSE] : re[FULL]
    if (!r.test(version)) {
      return null
    }
    try {
      return new SemVer(version, options)
    } catch (er) {
      return null
    }
  }
  exports.valid = valid
  function valid(version, options) {
    var v = parse(version, options)
    return v ? v.version : null
  }
  exports.clean = clean
  function clean(version, options) {
    var s = parse(version.trim().replace(/^[=v]+/, ""), options)
    return s ? s.version : null
  }
  exports.SemVer = SemVer
  function SemVer(version, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }
    if (version instanceof SemVer) {
      if (version.loose === options.loose) {
        return version
      } else {
        version = version.version
      }
    } else if (typeof version !== "string") {
      throw new TypeError("Invalid Version: " + version)
    }
    if (version.length > MAX_LENGTH) {
      throw new TypeError(
        "version is longer than " + MAX_LENGTH + " characters",
      )
    }
    if (!(this instanceof SemVer)) {
      return new SemVer(version, options)
    }
    debug("SemVer", version, options)
    this.options = options
    this.loose = !!options.loose
    var m = version.trim().match(options.loose ? re[LOOSE] : re[FULL])
    if (!m) {
      throw new TypeError("Invalid Version: " + version)
    }
    this.raw = version
    this.major = +m[1]
    this.minor = +m[2]
    this.patch = +m[3]
    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
      throw new TypeError("Invalid major version")
    }
    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
      throw new TypeError("Invalid minor version")
    }
    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
      throw new TypeError("Invalid patch version")
    }
    if (!m[4]) {
      this.prerelease = []
    } else {
      this.prerelease = m[4].split(".").map(function (id) {
        if (/^[0-9]+$/.test(id)) {
          var num = +id
          if (num >= 0 && num < MAX_SAFE_INTEGER) {
            return num
          }
        }
        return id
      })
    }
    this.build = m[5] ? m[5].split(".") : []
    this.format()
  }
  SemVer.prototype.format = function () {
    this.version = this.major + "." + this.minor + "." + this.patch
    if (this.prerelease.length) {
      this.version += "-" + this.prerelease.join(".")
    }
    return this.version
  }
  SemVer.prototype.toString = function () {
    return this.version
  }
  SemVer.prototype.compare = function (other) {
    debug("SemVer.compare", this.version, this.options, other)
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
    return this.compareMain(other) || this.comparePre(other)
  }
  SemVer.prototype.compareMain = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
    return (
      compareIdentifiers(this.major, other.major) ||
      compareIdentifiers(this.minor, other.minor) ||
      compareIdentifiers(this.patch, other.patch)
    )
  }
  SemVer.prototype.comparePre = function (other) {
    if (!(other instanceof SemVer)) {
      other = new SemVer(other, this.options)
    }
    if (this.prerelease.length && !other.prerelease.length) {
      return -1
    } else if (!this.prerelease.length && other.prerelease.length) {
      return 1
    } else if (!this.prerelease.length && !other.prerelease.length) {
      return 0
    }
    var i2 = 0
    do {
      var a = this.prerelease[i2]
      var b = other.prerelease[i2]
      debug("prerelease compare", i2, a, b)
      if (a === void 0 && b === void 0) {
        return 0
      } else if (b === void 0) {
        return 1
      } else if (a === void 0) {
        return -1
      } else if (a === b) {
        continue
      } else {
        return compareIdentifiers(a, b)
      }
    } while (++i2)
  }
  SemVer.prototype.inc = function (release, identifier) {
    switch (release) {
      case "premajor":
        this.prerelease.length = 0
        this.patch = 0
        this.minor = 0
        this.major++
        this.inc("pre", identifier)
        break
      case "preminor":
        this.prerelease.length = 0
        this.patch = 0
        this.minor++
        this.inc("pre", identifier)
        break
      case "prepatch":
        this.prerelease.length = 0
        this.inc("patch", identifier)
        this.inc("pre", identifier)
        break
      case "prerelease":
        if (this.prerelease.length === 0) {
          this.inc("patch", identifier)
        }
        this.inc("pre", identifier)
        break
      case "major":
        if (
          this.minor !== 0 ||
          this.patch !== 0 ||
          this.prerelease.length === 0
        ) {
          this.major++
        }
        this.minor = 0
        this.patch = 0
        this.prerelease = []
        break
      case "minor":
        if (this.patch !== 0 || this.prerelease.length === 0) {
          this.minor++
        }
        this.patch = 0
        this.prerelease = []
        break
      case "patch":
        if (this.prerelease.length === 0) {
          this.patch++
        }
        this.prerelease = []
        break
      case "pre":
        if (this.prerelease.length === 0) {
          this.prerelease = [0]
        } else {
          var i2 = this.prerelease.length
          while (--i2 >= 0) {
            if (typeof this.prerelease[i2] === "number") {
              this.prerelease[i2]++
              i2 = -2
            }
          }
          if (i2 === -1) {
            this.prerelease.push(0)
          }
        }
        if (identifier) {
          if (this.prerelease[0] === identifier) {
            if (isNaN(this.prerelease[1])) {
              this.prerelease = [identifier, 0]
            }
          } else {
            this.prerelease = [identifier, 0]
          }
        }
        break
      default:
        throw new Error("invalid increment argument: " + release)
    }
    this.format()
    this.raw = this.version
    return this
  }
  exports.inc = inc
  function inc(version, release, loose, identifier) {
    if (typeof loose === "string") {
      identifier = loose
      loose = void 0
    }
    try {
      return new SemVer(version, loose).inc(release, identifier).version
    } catch (er) {
      return null
    }
  }
  exports.diff = diff
  function diff(version1, version2) {
    if (eq(version1, version2)) {
      return null
    } else {
      var v1 = parse(version1)
      var v2 = parse(version2)
      var prefix = ""
      if (v1.prerelease.length || v2.prerelease.length) {
        prefix = "pre"
        var defaultResult = "prerelease"
      }
      for (var key in v1) {
        if (key === "major" || key === "minor" || key === "patch") {
          if (v1[key] !== v2[key]) {
            return prefix + key
          }
        }
      }
      return defaultResult
    }
  }
  exports.compareIdentifiers = compareIdentifiers
  var numeric = /^[0-9]+$/
  function compareIdentifiers(a, b) {
    var anum = numeric.test(a)
    var bnum = numeric.test(b)
    if (anum && bnum) {
      a = +a
      b = +b
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1
  }
  exports.rcompareIdentifiers = rcompareIdentifiers
  function rcompareIdentifiers(a, b) {
    return compareIdentifiers(b, a)
  }
  exports.major = major
  function major(a, loose) {
    return new SemVer(a, loose).major
  }
  exports.minor = minor
  function minor(a, loose) {
    return new SemVer(a, loose).minor
  }
  exports.patch = patch
  function patch(a, loose) {
    return new SemVer(a, loose).patch
  }
  exports.compare = compare
  function compare(a, b, loose) {
    return new SemVer(a, loose).compare(new SemVer(b, loose))
  }
  exports.compareLoose = compareLoose
  function compareLoose(a, b) {
    return compare(a, b, true)
  }
  exports.rcompare = rcompare
  function rcompare(a, b, loose) {
    return compare(b, a, loose)
  }
  exports.sort = sort
  function sort(list, loose) {
    return list.sort(function (a, b) {
      return exports.compare(a, b, loose)
    })
  }
  exports.rsort = rsort
  function rsort(list, loose) {
    return list.sort(function (a, b) {
      return exports.rcompare(a, b, loose)
    })
  }
  exports.gt = gt
  function gt(a, b, loose) {
    return compare(a, b, loose) > 0
  }
  exports.lt = lt
  function lt(a, b, loose) {
    return compare(a, b, loose) < 0
  }
  exports.eq = eq
  function eq(a, b, loose) {
    return compare(a, b, loose) === 0
  }
  exports.neq = neq
  function neq(a, b, loose) {
    return compare(a, b, loose) !== 0
  }
  exports.gte = gte
  function gte(a, b, loose) {
    return compare(a, b, loose) >= 0
  }
  exports.lte = lte
  function lte(a, b, loose) {
    return compare(a, b, loose) <= 0
  }
  exports.cmp = cmp
  function cmp(a, op, b, loose) {
    switch (op) {
      case "===":
        if (typeof a === "object") a = a.version
        if (typeof b === "object") b = b.version
        return a === b
      case "!==":
        if (typeof a === "object") a = a.version
        if (typeof b === "object") b = b.version
        return a !== b
      case "":
      case "=":
      case "==":
        return eq(a, b, loose)
      case "!=":
        return neq(a, b, loose)
      case ">":
        return gt(a, b, loose)
      case ">=":
        return gte(a, b, loose)
      case "<":
        return lt(a, b, loose)
      case "<=":
        return lte(a, b, loose)
      default:
        throw new TypeError("Invalid operator: " + op)
    }
  }
  exports.Comparator = Comparator
  function Comparator(comp, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }
    if (comp instanceof Comparator) {
      if (comp.loose === !!options.loose) {
        return comp
      } else {
        comp = comp.value
      }
    }
    if (!(this instanceof Comparator)) {
      return new Comparator(comp, options)
    }
    debug("comparator", comp, options)
    this.options = options
    this.loose = !!options.loose
    this.parse(comp)
    if (this.semver === ANY) {
      this.value = ""
    } else {
      this.value = this.operator + this.semver.version
    }
    debug("comp", this)
  }
  var ANY = {}
  Comparator.prototype.parse = function (comp) {
    var r = this.options.loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
    var m = comp.match(r)
    if (!m) {
      throw new TypeError("Invalid comparator: " + comp)
    }
    this.operator = m[1]
    if (this.operator === "=") {
      this.operator = ""
    }
    if (!m[2]) {
      this.semver = ANY
    } else {
      this.semver = new SemVer(m[2], this.options.loose)
    }
  }
  Comparator.prototype.toString = function () {
    return this.value
  }
  Comparator.prototype.test = function (version) {
    debug("Comparator.test", version, this.options.loose)
    if (this.semver === ANY) {
      return true
    }
    if (typeof version === "string") {
      version = new SemVer(version, this.options)
    }
    return cmp(version, this.operator, this.semver, this.options)
  }
  Comparator.prototype.intersects = function (comp, options) {
    if (!(comp instanceof Comparator)) {
      throw new TypeError("a Comparator is required")
    }
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }
    var rangeTmp
    if (this.operator === "") {
      rangeTmp = new Range(comp.value, options)
      return satisfies(this.value, rangeTmp, options)
    } else if (comp.operator === "") {
      rangeTmp = new Range(this.value, options)
      return satisfies(comp.semver, rangeTmp, options)
    }
    var sameDirectionIncreasing =
      (this.operator === ">=" || this.operator === ">") &&
      (comp.operator === ">=" || comp.operator === ">")
    var sameDirectionDecreasing =
      (this.operator === "<=" || this.operator === "<") &&
      (comp.operator === "<=" || comp.operator === "<")
    var sameSemVer = this.semver.version === comp.semver.version
    var differentDirectionsInclusive =
      (this.operator === ">=" || this.operator === "<=") &&
      (comp.operator === ">=" || comp.operator === "<=")
    var oppositeDirectionsLessThan =
      cmp(this.semver, "<", comp.semver, options) &&
      (this.operator === ">=" || this.operator === ">") &&
      (comp.operator === "<=" || comp.operator === "<")
    var oppositeDirectionsGreaterThan =
      cmp(this.semver, ">", comp.semver, options) &&
      (this.operator === "<=" || this.operator === "<") &&
      (comp.operator === ">=" || comp.operator === ">")
    return (
      sameDirectionIncreasing ||
      sameDirectionDecreasing ||
      (sameSemVer && differentDirectionsInclusive) ||
      oppositeDirectionsLessThan ||
      oppositeDirectionsGreaterThan
    )
  }
  exports.Range = Range
  function Range(range, options) {
    if (!options || typeof options !== "object") {
      options = {
        loose: !!options,
        includePrerelease: false,
      }
    }
    if (range instanceof Range) {
      if (
        range.loose === !!options.loose &&
        range.includePrerelease === !!options.includePrerelease
      ) {
        return range
      } else {
        return new Range(range.raw, options)
      }
    }
    if (range instanceof Comparator) {
      return new Range(range.value, options)
    }
    if (!(this instanceof Range)) {
      return new Range(range, options)
    }
    this.options = options
    this.loose = !!options.loose
    this.includePrerelease = !!options.includePrerelease
    this.raw = range
    this.set = range
      .split(/\s*\|\|\s*/)
      .map(function (range2) {
        return this.parseRange(range2.trim())
      }, this)
      .filter(function (c) {
        return c.length
      })
    if (!this.set.length) {
      throw new TypeError("Invalid SemVer Range: " + range)
    }
    this.format()
  }
  Range.prototype.format = function () {
    this.range = this.set
      .map(function (comps) {
        return comps.join(" ").trim()
      })
      .join("||")
      .trim()
    return this.range
  }
  Range.prototype.toString = function () {
    return this.range
  }
  Range.prototype.parseRange = function (range) {
    var loose = this.options.loose
    range = range.trim()
    var hr = loose ? re[HYPHENRANGELOOSE] : re[HYPHENRANGE]
    range = range.replace(hr, hyphenReplace)
    debug("hyphen replace", range)
    range = range.replace(re[COMPARATORTRIM], comparatorTrimReplace)
    debug("comparator trim", range, re[COMPARATORTRIM])
    range = range.replace(re[TILDETRIM], tildeTrimReplace)
    range = range.replace(re[CARETTRIM], caretTrimReplace)
    range = range.split(/\s+/).join(" ")
    var compRe = loose ? re[COMPARATORLOOSE] : re[COMPARATOR]
    var set = range
      .split(" ")
      .map(function (comp) {
        return parseComparator(comp, this.options)
      }, this)
      .join(" ")
      .split(/\s+/)
    if (this.options.loose) {
      set = set.filter(function (comp) {
        return !!comp.match(compRe)
      })
    }
    set = set.map(function (comp) {
      return new Comparator(comp, this.options)
    }, this)
    return set
  }
  Range.prototype.intersects = function (range, options) {
    if (!(range instanceof Range)) {
      throw new TypeError("a Range is required")
    }
    return this.set.some(function (thisComparators) {
      return thisComparators.every(function (thisComparator) {
        return range.set.some(function (rangeComparators) {
          return rangeComparators.every(function (rangeComparator) {
            return thisComparator.intersects(rangeComparator, options)
          })
        })
      })
    })
  }
  exports.toComparators = toComparators
  function toComparators(range, options) {
    return new Range(range, options).set.map(function (comp) {
      return comp
        .map(function (c) {
          return c.value
        })
        .join(" ")
        .trim()
        .split(" ")
    })
  }
  function parseComparator(comp, options) {
    debug("comp", comp, options)
    comp = replaceCarets(comp, options)
    debug("caret", comp)
    comp = replaceTildes(comp, options)
    debug("tildes", comp)
    comp = replaceXRanges(comp, options)
    debug("xrange", comp)
    comp = replaceStars(comp, options)
    debug("stars", comp)
    return comp
  }
  function isX(id) {
    return !id || id.toLowerCase() === "x" || id === "*"
  }
  function replaceTildes(comp, options) {
    return comp
      .trim()
      .split(/\s+/)
      .map(function (comp2) {
        return replaceTilde(comp2, options)
      })
      .join(" ")
  }
  function replaceTilde(comp, options) {
    var r = options.loose ? re[TILDELOOSE] : re[TILDE]
    return comp.replace(r, function (_, M, m, p, pr) {
      debug("tilde", comp, _, M, m, p, pr)
      var ret
      if (isX(M)) {
        ret = ""
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0"
      } else if (isX(p)) {
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0"
      } else if (pr) {
        debug("replaceTilde pr", pr)
        ret =
          ">=" +
          M +
          "." +
          m +
          "." +
          p +
          "-" +
          pr +
          " <" +
          M +
          "." +
          (+m + 1) +
          ".0"
      } else {
        ret = ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0"
      }
      debug("tilde return", ret)
      return ret
    })
  }
  function replaceCarets(comp, options) {
    return comp
      .trim()
      .split(/\s+/)
      .map(function (comp2) {
        return replaceCaret(comp2, options)
      })
      .join(" ")
  }
  function replaceCaret(comp, options) {
    debug("caret", comp, options)
    var r = options.loose ? re[CARETLOOSE] : re[CARET]
    return comp.replace(r, function (_, M, m, p, pr) {
      debug("caret", comp, _, M, m, p, pr)
      var ret
      if (isX(M)) {
        ret = ""
      } else if (isX(m)) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0"
      } else if (isX(p)) {
        if (M === "0") {
          ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0"
        } else {
          ret = ">=" + M + "." + m + ".0 <" + (+M + 1) + ".0.0"
        }
      } else if (pr) {
        debug("replaceCaret pr", pr)
        if (M === "0") {
          if (m === "0") {
            ret =
              ">=" +
              M +
              "." +
              m +
              "." +
              p +
              "-" +
              pr +
              " <" +
              M +
              "." +
              m +
              "." +
              (+p + 1)
          } else {
            ret =
              ">=" +
              M +
              "." +
              m +
              "." +
              p +
              "-" +
              pr +
              " <" +
              M +
              "." +
              (+m + 1) +
              ".0"
          }
        } else {
          ret =
            ">=" + M + "." + m + "." + p + "-" + pr + " <" + (+M + 1) + ".0.0"
        }
      } else {
        debug("no pr")
        if (M === "0") {
          if (m === "0") {
            ret =
              ">=" + M + "." + m + "." + p + " <" + M + "." + m + "." + (+p + 1)
          } else {
            ret =
              ">=" + M + "." + m + "." + p + " <" + M + "." + (+m + 1) + ".0"
          }
        } else {
          ret = ">=" + M + "." + m + "." + p + " <" + (+M + 1) + ".0.0"
        }
      }
      debug("caret return", ret)
      return ret
    })
  }
  function replaceXRanges(comp, options) {
    debug("replaceXRanges", comp, options)
    return comp
      .split(/\s+/)
      .map(function (comp2) {
        return replaceXRange(comp2, options)
      })
      .join(" ")
  }
  function replaceXRange(comp, options) {
    comp = comp.trim()
    var r = options.loose ? re[XRANGELOOSE] : re[XRANGE]
    return comp.replace(r, function (ret, gtlt, M, m, p, pr) {
      debug("xRange", comp, ret, gtlt, M, m, p, pr)
      var xM = isX(M)
      var xm = xM || isX(m)
      var xp = xm || isX(p)
      var anyX = xp
      if (gtlt === "=" && anyX) {
        gtlt = ""
      }
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0"
        } else {
          ret = "*"
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0
        }
        p = 0
        if (gtlt === ">") {
          gtlt = ">="
          if (xm) {
            M = +M + 1
            m = 0
            p = 0
          } else {
            m = +m + 1
            p = 0
          }
        } else if (gtlt === "<=") {
          gtlt = "<"
          if (xm) {
            M = +M + 1
          } else {
            m = +m + 1
          }
        }
        ret = gtlt + M + "." + m + "." + p
      } else if (xm) {
        ret = ">=" + M + ".0.0 <" + (+M + 1) + ".0.0"
      } else if (xp) {
        ret = ">=" + M + "." + m + ".0 <" + M + "." + (+m + 1) + ".0"
      }
      debug("xRange return", ret)
      return ret
    })
  }
  function replaceStars(comp, options) {
    debug("replaceStars", comp, options)
    return comp.trim().replace(re[STAR], "")
  }
  function hyphenReplace(
    $0,
    from,
    fM,
    fm,
    fp,
    fpr,
    fb,
    to,
    tM,
    tm,
    tp,
    tpr,
    tb,
  ) {
    if (isX(fM)) {
      from = ""
    } else if (isX(fm)) {
      from = ">=" + fM + ".0.0"
    } else if (isX(fp)) {
      from = ">=" + fM + "." + fm + ".0"
    } else {
      from = ">=" + from
    }
    if (isX(tM)) {
      to = ""
    } else if (isX(tm)) {
      to = "<" + (+tM + 1) + ".0.0"
    } else if (isX(tp)) {
      to = "<" + tM + "." + (+tm + 1) + ".0"
    } else if (tpr) {
      to = "<=" + tM + "." + tm + "." + tp + "-" + tpr
    } else {
      to = "<=" + to
    }
    return (from + " " + to).trim()
  }
  Range.prototype.test = function (version) {
    if (!version) {
      return false
    }
    if (typeof version === "string") {
      version = new SemVer(version, this.options)
    }
    for (var i2 = 0; i2 < this.set.length; i2++) {
      if (testSet(this.set[i2], version, this.options)) {
        return true
      }
    }
    return false
  }
  function testSet(set, version, options) {
    for (var i2 = 0; i2 < set.length; i2++) {
      if (!set[i2].test(version)) {
        return false
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (i2 = 0; i2 < set.length; i2++) {
        debug(set[i2].semver)
        if (set[i2].semver === ANY) {
          continue
        }
        if (set[i2].semver.prerelease.length > 0) {
          var allowed = set[i2].semver
          if (
            allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch
          ) {
            return true
          }
        }
      }
      return false
    }
    return true
  }
  exports.satisfies = satisfies
  function satisfies(version, range, options) {
    try {
      range = new Range(range, options)
    } catch (er) {
      return false
    }
    return range.test(version)
  }
  exports.maxSatisfying = maxSatisfying
  function maxSatisfying(versions, range, options) {
    var max = null
    var maxSV = null
    try {
      var rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v
          maxSV = new SemVer(max, options)
        }
      }
    })
    return max
  }
  exports.minSatisfying = minSatisfying
  function minSatisfying(versions, range, options) {
    var min = null
    var minSV = null
    try {
      var rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach(function (v) {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v
          minSV = new SemVer(min, options)
        }
      }
    })
    return min
  }
  exports.minVersion = minVersion
  function minVersion(range, loose) {
    range = new Range(range, loose)
    var minver = new SemVer("0.0.0")
    if (range.test(minver)) {
      return minver
    }
    minver = new SemVer("0.0.0-0")
    if (range.test(minver)) {
      return minver
    }
    minver = null
    for (var i2 = 0; i2 < range.set.length; ++i2) {
      var comparators = range.set[i2]
      comparators.forEach(function (comparator) {
        var compver = new SemVer(comparator.semver.version)
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++
            } else {
              compver.prerelease.push(0)
            }
            compver.raw = compver.format()
          case "":
          case ">=":
            if (!minver || gt(minver, compver)) {
              minver = compver
            }
            break
          case "<":
          case "<=":
            break
          default:
            throw new Error("Unexpected operation: " + comparator.operator)
        }
      })
    }
    if (minver && range.test(minver)) {
      return minver
    }
    return null
  }
  exports.validRange = validRange
  function validRange(range, options) {
    try {
      return new Range(range, options).range || "*"
    } catch (er) {
      return null
    }
  }
  exports.ltr = ltr
  function ltr(version, range, options) {
    return outside(version, range, "<", options)
  }
  exports.gtr = gtr
  function gtr(version, range, options) {
    return outside(version, range, ">", options)
  }
  exports.outside = outside
  function outside(version, range, hilo, options) {
    version = new SemVer(version, options)
    range = new Range(range, options)
    var gtfn, ltefn, ltfn, comp, ecomp
    switch (hilo) {
      case ">":
        gtfn = gt
        ltefn = lte
        ltfn = lt
        comp = ">"
        ecomp = ">="
        break
      case "<":
        gtfn = lt
        ltefn = gte
        ltfn = gt
        comp = "<"
        ecomp = "<="
        break
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"')
    }
    if (satisfies(version, range, options)) {
      return false
    }
    for (var i2 = 0; i2 < range.set.length; ++i2) {
      var comparators = range.set[i2]
      var high = null
      var low = null
      comparators.forEach(function (comparator) {
        if (comparator.semver === ANY) {
          comparator = new Comparator(">=0.0.0")
        }
        high = high || comparator
        low = low || comparator
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator
        }
      })
      if (high.operator === comp || high.operator === ecomp) {
        return false
      }
      if (
        (!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)
      ) {
        return false
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false
      }
    }
    return true
  }
  exports.prerelease = prerelease
  function prerelease(version, options) {
    var parsed = parse(version, options)
    return parsed && parsed.prerelease.length ? parsed.prerelease : null
  }
  exports.intersects = intersects
  function intersects(r1, r2, options) {
    r1 = new Range(r1, options)
    r2 = new Range(r2, options)
    return r1.intersects(r2)
  }
  exports.coerce = coerce
  function coerce(version) {
    if (version instanceof SemVer) {
      return version
    }
    if (typeof version !== "string") {
      return null
    }
    var match = version.match(re[COERCE])
    if (match == null) {
      return null
    }
    return parse(match[1] + "." + (match[2] || "0") + "." + (match[3] || "0"))
  }
})

// node_modules/spdx-license-ids/index.json
var require_spdx_license_ids = __commonJS((exports, module) => {
  module.exports = [
    "0BSD",
    "AAL",
    "ADSL",
    "AFL-1.1",
    "AFL-1.2",
    "AFL-2.0",
    "AFL-2.1",
    "AFL-3.0",
    "AGPL-1.0-only",
    "AGPL-1.0-or-later",
    "AGPL-3.0-only",
    "AGPL-3.0-or-later",
    "AMDPLPA",
    "AML",
    "AMPAS",
    "ANTLR-PD",
    "ANTLR-PD-fallback",
    "APAFML",
    "APL-1.0",
    "APSL-1.0",
    "APSL-1.1",
    "APSL-1.2",
    "APSL-2.0",
    "Abstyles",
    "Adobe-2006",
    "Adobe-Glyph",
    "Afmparse",
    "Aladdin",
    "Apache-1.0",
    "Apache-1.1",
    "Apache-2.0",
    "Artistic-1.0",
    "Artistic-1.0-Perl",
    "Artistic-1.0-cl8",
    "Artistic-2.0",
    "BSD-1-Clause",
    "BSD-2-Clause",
    "BSD-2-Clause-Patent",
    "BSD-2-Clause-Views",
    "BSD-3-Clause",
    "BSD-3-Clause-Attribution",
    "BSD-3-Clause-Clear",
    "BSD-3-Clause-LBNL",
    "BSD-3-Clause-No-Nuclear-License",
    "BSD-3-Clause-No-Nuclear-License-2014",
    "BSD-3-Clause-No-Nuclear-Warranty",
    "BSD-3-Clause-Open-MPI",
    "BSD-4-Clause",
    "BSD-4-Clause-UC",
    "BSD-Protection",
    "BSD-Source-Code",
    "BSL-1.0",
    "BUSL-1.1",
    "Bahyph",
    "Barr",
    "Beerware",
    "BitTorrent-1.0",
    "BitTorrent-1.1",
    "BlueOak-1.0.0",
    "Borceux",
    "CAL-1.0",
    "CAL-1.0-Combined-Work-Exception",
    "CATOSL-1.1",
    "CC-BY-1.0",
    "CC-BY-2.0",
    "CC-BY-2.5",
    "CC-BY-3.0",
    "CC-BY-3.0-AT",
    "CC-BY-3.0-US",
    "CC-BY-4.0",
    "CC-BY-NC-1.0",
    "CC-BY-NC-2.0",
    "CC-BY-NC-2.5",
    "CC-BY-NC-3.0",
    "CC-BY-NC-4.0",
    "CC-BY-NC-ND-1.0",
    "CC-BY-NC-ND-2.0",
    "CC-BY-NC-ND-2.5",
    "CC-BY-NC-ND-3.0",
    "CC-BY-NC-ND-3.0-IGO",
    "CC-BY-NC-ND-4.0",
    "CC-BY-NC-SA-1.0",
    "CC-BY-NC-SA-2.0",
    "CC-BY-NC-SA-2.5",
    "CC-BY-NC-SA-3.0",
    "CC-BY-NC-SA-4.0",
    "CC-BY-ND-1.0",
    "CC-BY-ND-2.0",
    "CC-BY-ND-2.5",
    "CC-BY-ND-3.0",
    "CC-BY-ND-4.0",
    "CC-BY-SA-1.0",
    "CC-BY-SA-2.0",
    "CC-BY-SA-2.0-UK",
    "CC-BY-SA-2.5",
    "CC-BY-SA-3.0",
    "CC-BY-SA-3.0-AT",
    "CC-BY-SA-4.0",
    "CC-PDDC",
    "CC0-1.0",
    "CDDL-1.0",
    "CDDL-1.1",
    "CDLA-Permissive-1.0",
    "CDLA-Sharing-1.0",
    "CECILL-1.0",
    "CECILL-1.1",
    "CECILL-2.0",
    "CECILL-2.1",
    "CECILL-B",
    "CECILL-C",
    "CERN-OHL-1.1",
    "CERN-OHL-1.2",
    "CERN-OHL-P-2.0",
    "CERN-OHL-S-2.0",
    "CERN-OHL-W-2.0",
    "CNRI-Jython",
    "CNRI-Python",
    "CNRI-Python-GPL-Compatible",
    "CPAL-1.0",
    "CPL-1.0",
    "CPOL-1.02",
    "CUA-OPL-1.0",
    "Caldera",
    "ClArtistic",
    "Condor-1.1",
    "Crossword",
    "CrystalStacker",
    "Cube",
    "D-FSL-1.0",
    "DOC",
    "DSDP",
    "Dotseqn",
    "ECL-1.0",
    "ECL-2.0",
    "EFL-1.0",
    "EFL-2.0",
    "EPICS",
    "EPL-1.0",
    "EPL-2.0",
    "EUDatagrid",
    "EUPL-1.0",
    "EUPL-1.1",
    "EUPL-1.2",
    "Entessa",
    "ErlPL-1.1",
    "Eurosym",
    "FSFAP",
    "FSFUL",
    "FSFULLR",
    "FTL",
    "Fair",
    "Frameworx-1.0",
    "FreeImage",
    "GFDL-1.1-invariants-only",
    "GFDL-1.1-invariants-or-later",
    "GFDL-1.1-no-invariants-only",
    "GFDL-1.1-no-invariants-or-later",
    "GFDL-1.1-only",
    "GFDL-1.1-or-later",
    "GFDL-1.2-invariants-only",
    "GFDL-1.2-invariants-or-later",
    "GFDL-1.2-no-invariants-only",
    "GFDL-1.2-no-invariants-or-later",
    "GFDL-1.2-only",
    "GFDL-1.2-or-later",
    "GFDL-1.3-invariants-only",
    "GFDL-1.3-invariants-or-later",
    "GFDL-1.3-no-invariants-only",
    "GFDL-1.3-no-invariants-or-later",
    "GFDL-1.3-only",
    "GFDL-1.3-or-later",
    "GL2PS",
    "GLWTPL",
    "GPL-1.0-only",
    "GPL-1.0-or-later",
    "GPL-2.0-only",
    "GPL-2.0-or-later",
    "GPL-3.0-only",
    "GPL-3.0-or-later",
    "Giftware",
    "Glide",
    "Glulxe",
    "HPND",
    "HPND-sell-variant",
    "HTMLTIDY",
    "HaskellReport",
    "Hippocratic-2.1",
    "IBM-pibs",
    "ICU",
    "IJG",
    "IPA",
    "IPL-1.0",
    "ISC",
    "ImageMagick",
    "Imlib2",
    "Info-ZIP",
    "Intel",
    "Intel-ACPI",
    "Interbase-1.0",
    "JPNIC",
    "JSON",
    "JasPer-2.0",
    "LAL-1.2",
    "LAL-1.3",
    "LGPL-2.0-only",
    "LGPL-2.0-or-later",
    "LGPL-2.1-only",
    "LGPL-2.1-or-later",
    "LGPL-3.0-only",
    "LGPL-3.0-or-later",
    "LGPLLR",
    "LPL-1.0",
    "LPL-1.02",
    "LPPL-1.0",
    "LPPL-1.1",
    "LPPL-1.2",
    "LPPL-1.3a",
    "LPPL-1.3c",
    "Latex2e",
    "Leptonica",
    "LiLiQ-P-1.1",
    "LiLiQ-R-1.1",
    "LiLiQ-Rplus-1.1",
    "Libpng",
    "Linux-OpenIB",
    "MIT",
    "MIT-0",
    "MIT-CMU",
    "MIT-advertising",
    "MIT-enna",
    "MIT-feh",
    "MIT-open-group",
    "MITNFA",
    "MPL-1.0",
    "MPL-1.1",
    "MPL-2.0",
    "MPL-2.0-no-copyleft-exception",
    "MS-PL",
    "MS-RL",
    "MTLL",
    "MakeIndex",
    "MirOS",
    "Motosoto",
    "MulanPSL-1.0",
    "MulanPSL-2.0",
    "Multics",
    "Mup",
    "NASA-1.3",
    "NBPL-1.0",
    "NCGL-UK-2.0",
    "NCSA",
    "NGPL",
    "NIST-PD",
    "NIST-PD-fallback",
    "NLOD-1.0",
    "NLPL",
    "NOSL",
    "NPL-1.0",
    "NPL-1.1",
    "NPOSL-3.0",
    "NRL",
    "NTP",
    "NTP-0",
    "Naumen",
    "Net-SNMP",
    "NetCDF",
    "Newsletr",
    "Nokia",
    "Noweb",
    "O-UDA-1.0",
    "OCCT-PL",
    "OCLC-2.0",
    "ODC-By-1.0",
    "ODbL-1.0",
    "OFL-1.0",
    "OFL-1.0-RFN",
    "OFL-1.0-no-RFN",
    "OFL-1.1",
    "OFL-1.1-RFN",
    "OFL-1.1-no-RFN",
    "OGC-1.0",
    "OGL-Canada-2.0",
    "OGL-UK-1.0",
    "OGL-UK-2.0",
    "OGL-UK-3.0",
    "OGTSL",
    "OLDAP-1.1",
    "OLDAP-1.2",
    "OLDAP-1.3",
    "OLDAP-1.4",
    "OLDAP-2.0",
    "OLDAP-2.0.1",
    "OLDAP-2.1",
    "OLDAP-2.2",
    "OLDAP-2.2.1",
    "OLDAP-2.2.2",
    "OLDAP-2.3",
    "OLDAP-2.4",
    "OLDAP-2.5",
    "OLDAP-2.6",
    "OLDAP-2.7",
    "OLDAP-2.8",
    "OML",
    "OPL-1.0",
    "OSET-PL-2.1",
    "OSL-1.0",
    "OSL-1.1",
    "OSL-2.0",
    "OSL-2.1",
    "OSL-3.0",
    "OpenSSL",
    "PDDL-1.0",
    "PHP-3.0",
    "PHP-3.01",
    "PSF-2.0",
    "Parity-6.0.0",
    "Parity-7.0.0",
    "Plexus",
    "PolyForm-Noncommercial-1.0.0",
    "PolyForm-Small-Business-1.0.0",
    "PostgreSQL",
    "Python-2.0",
    "QPL-1.0",
    "Qhull",
    "RHeCos-1.1",
    "RPL-1.1",
    "RPL-1.5",
    "RPSL-1.0",
    "RSA-MD",
    "RSCPL",
    "Rdisc",
    "Ruby",
    "SAX-PD",
    "SCEA",
    "SGI-B-1.0",
    "SGI-B-1.1",
    "SGI-B-2.0",
    "SHL-0.5",
    "SHL-0.51",
    "SISSL",
    "SISSL-1.2",
    "SMLNJ",
    "SMPPL",
    "SNIA",
    "SPL-1.0",
    "SSH-OpenSSH",
    "SSH-short",
    "SSPL-1.0",
    "SWL",
    "Saxpath",
    "Sendmail",
    "Sendmail-8.23",
    "SimPL-2.0",
    "Sleepycat",
    "Spencer-86",
    "Spencer-94",
    "Spencer-99",
    "SugarCRM-1.1.3",
    "TAPR-OHL-1.0",
    "TCL",
    "TCP-wrappers",
    "TMate",
    "TORQUE-1.1",
    "TOSL",
    "TU-Berlin-1.0",
    "TU-Berlin-2.0",
    "UCL-1.0",
    "UPL-1.0",
    "Unicode-DFS-2015",
    "Unicode-DFS-2016",
    "Unicode-TOU",
    "Unlicense",
    "VOSTROM",
    "VSL-1.0",
    "Vim",
    "W3C",
    "W3C-19980720",
    "W3C-20150513",
    "WTFPL",
    "Watcom-1.0",
    "Wsuipa",
    "X11",
    "XFree86-1.1",
    "XSkat",
    "Xerox",
    "Xnet",
    "YPL-1.0",
    "YPL-1.1",
    "ZPL-1.1",
    "ZPL-2.0",
    "ZPL-2.1",
    "Zed",
    "Zend-2.0",
    "Zimbra-1.3",
    "Zimbra-1.4",
    "Zlib",
    "blessing",
    "bzip2-1.0.5",
    "bzip2-1.0.6",
    "copyleft-next-0.3.0",
    "copyleft-next-0.3.1",
    "curl",
    "diffmark",
    "dvipdfm",
    "eGenix",
    "etalab-2.0",
    "gSOAP-1.3b",
    "gnuplot",
    "iMatix",
    "libpng-2.0",
    "libselinux-1.0",
    "libtiff",
    "mpich2",
    "psfrag",
    "psutils",
    "xinetd",
    "xpp",
    "zlib-acknowledgement",
  ]
})

// node_modules/spdx-license-ids/deprecated.json
var require_deprecated = __commonJS((exports, module) => {
  module.exports = [
    "AGPL-1.0",
    "AGPL-3.0",
    "BSD-2-Clause-FreeBSD",
    "BSD-2-Clause-NetBSD",
    "GFDL-1.1",
    "GFDL-1.2",
    "GFDL-1.3",
    "GPL-1.0",
    "GPL-2.0",
    "GPL-2.0-with-GCC-exception",
    "GPL-2.0-with-autoconf-exception",
    "GPL-2.0-with-bison-exception",
    "GPL-2.0-with-classpath-exception",
    "GPL-2.0-with-font-exception",
    "GPL-3.0",
    "GPL-3.0-with-GCC-exception",
    "GPL-3.0-with-autoconf-exception",
    "LGPL-2.0",
    "LGPL-2.1",
    "LGPL-3.0",
    "Nunit",
    "StandardML-NJ",
    "eCos-2.0",
    "wxWindows",
  ]
})

// node_modules/spdx-exceptions/index.json
var require_spdx_exceptions = __commonJS((exports, module) => {
  module.exports = [
    "389-exception",
    "Autoconf-exception-2.0",
    "Autoconf-exception-3.0",
    "Bison-exception-2.2",
    "Bootloader-exception",
    "Classpath-exception-2.0",
    "CLISP-exception-2.0",
    "DigiRule-FOSS-exception",
    "eCos-exception-2.0",
    "Fawkes-Runtime-exception",
    "FLTK-exception",
    "Font-exception-2.0",
    "freertos-exception-2.0",
    "GCC-exception-2.0",
    "GCC-exception-3.1",
    "gnu-javamail-exception",
    "GPL-3.0-linking-exception",
    "GPL-3.0-linking-source-exception",
    "GPL-CC-1.0",
    "i2p-gpl-java-exception",
    "Libtool-exception",
    "Linux-syscall-note",
    "LLVM-exception",
    "LZMA-exception",
    "mif-exception",
    "Nokia-Qt-exception-1.1",
    "OCaml-LGPL-linking-exception",
    "OCCT-exception-1.0",
    "OpenJDK-assembly-exception-1.0",
    "openvpn-openssl-exception",
    "PS-or-PDF-font-exception-20170817",
    "Qt-GPL-exception-1.0",
    "Qt-LGPL-exception-1.1",
    "Qwt-exception-1.0",
    "Swift-exception",
    "u-boot-exception-2.0",
    "Universal-FOSS-exception-1.0",
    "WxWindows-exception-3.1",
  ]
})

// node_modules/spdx-expression-parse/scan.js
var require_scan = __commonJS((exports, module) => {
  "use strict"
  var licenses = []
    .concat(require_spdx_license_ids())
    .concat(require_deprecated())
  var exceptions = require_spdx_exceptions()
  module.exports = function (source) {
    var index = 0
    function hasMore() {
      return index < source.length
    }
    function read(value) {
      if (value instanceof RegExp) {
        var chars = source.slice(index)
        var match = chars.match(value)
        if (match) {
          index += match[0].length
          return match[0]
        }
      } else {
        if (source.indexOf(value, index) === index) {
          index += value.length
          return value
        }
      }
    }
    function skipWhitespace() {
      read(/[ ]*/)
    }
    function operator() {
      var string
      var possibilities = ["WITH", "AND", "OR", "(", ")", ":", "+"]
      for (var i = 0; i < possibilities.length; i++) {
        string = read(possibilities[i])
        if (string) {
          break
        }
      }
      if (string === "+" && index > 1 && source[index - 2] === " ") {
        throw new Error("Space before `+`")
      }
      return (
        string && {
          type: "OPERATOR",
          string,
        }
      )
    }
    function idstring() {
      return read(/[A-Za-z0-9-.]+/)
    }
    function expectIdstring() {
      var string = idstring()
      if (!string) {
        throw new Error("Expected idstring at offset " + index)
      }
      return string
    }
    function documentRef() {
      if (read("DocumentRef-")) {
        var string = expectIdstring()
        return { type: "DOCUMENTREF", string }
      }
    }
    function licenseRef() {
      if (read("LicenseRef-")) {
        var string = expectIdstring()
        return { type: "LICENSEREF", string }
      }
    }
    function identifier() {
      var begin = index
      var string = idstring()
      if (licenses.indexOf(string) !== -1) {
        return {
          type: "LICENSE",
          string,
        }
      } else if (exceptions.indexOf(string) !== -1) {
        return {
          type: "EXCEPTION",
          string,
        }
      }
      index = begin
    }
    function parseToken() {
      return operator() || documentRef() || licenseRef() || identifier()
    }
    var tokens = []
    while (hasMore()) {
      skipWhitespace()
      if (!hasMore()) {
        break
      }
      var token = parseToken()
      if (!token) {
        throw new Error("Unexpected `" + source[index] + "` at offset " + index)
      }
      tokens.push(token)
    }
    return tokens
  }
})

// node_modules/spdx-expression-parse/parse.js
var require_parse = __commonJS((exports, module) => {
  "use strict"
  module.exports = function (tokens) {
    var index = 0
    function hasMore() {
      return index < tokens.length
    }
    function token() {
      return hasMore() ? tokens[index] : null
    }
    function next() {
      if (!hasMore()) {
        throw new Error()
      }
      index++
    }
    function parseOperator(operator) {
      var t = token()
      if (t && t.type === "OPERATOR" && operator === t.string) {
        next()
        return t.string
      }
    }
    function parseWith() {
      if (parseOperator("WITH")) {
        var t = token()
        if (t && t.type === "EXCEPTION") {
          next()
          return t.string
        }
        throw new Error("Expected exception after `WITH`")
      }
    }
    function parseLicenseRef() {
      var begin = index
      var string = ""
      var t = token()
      if (t.type === "DOCUMENTREF") {
        next()
        string += "DocumentRef-" + t.string + ":"
        if (!parseOperator(":")) {
          throw new Error("Expected `:` after `DocumentRef-...`")
        }
      }
      t = token()
      if (t.type === "LICENSEREF") {
        next()
        string += "LicenseRef-" + t.string
        return { license: string }
      }
      index = begin
    }
    function parseLicense() {
      var t = token()
      if (t && t.type === "LICENSE") {
        next()
        var node2 = { license: t.string }
        if (parseOperator("+")) {
          node2.plus = true
        }
        var exception = parseWith()
        if (exception) {
          node2.exception = exception
        }
        return node2
      }
    }
    function parseParenthesizedExpression() {
      var left = parseOperator("(")
      if (!left) {
        return
      }
      var expr = parseExpression()
      if (!parseOperator(")")) {
        throw new Error("Expected `)`")
      }
      return expr
    }
    function parseAtom() {
      return (
        parseParenthesizedExpression() || parseLicenseRef() || parseLicense()
      )
    }
    function makeBinaryOpParser(operator, nextParser) {
      return function parseBinaryOp() {
        var left = nextParser()
        if (!left) {
          return
        }
        if (!parseOperator(operator)) {
          return left
        }
        var right = parseBinaryOp()
        if (!right) {
          throw new Error("Expected expression")
        }
        return {
          left,
          conjunction: operator.toLowerCase(),
          right,
        }
      }
    }
    var parseAnd = makeBinaryOpParser("AND", parseAtom)
    var parseExpression = makeBinaryOpParser("OR", parseAnd)
    var node = parseExpression()
    if (!node || hasMore()) {
      throw new Error("Syntax error")
    }
    return node
  }
})

// node_modules/spdx-expression-parse/index.js
var require_spdx_expression_parse = __commonJS((exports, module) => {
  "use strict"
  var scan = require_scan()
  var parse = require_parse()
  module.exports = function (source) {
    return parse(scan(source))
  }
})

// node_modules/spdx-correct/index.js
var require_spdx_correct = __commonJS((exports, module) => {
  var parse = require_spdx_expression_parse()
  var spdxLicenseIds = require_spdx_license_ids()
  function valid(string) {
    try {
      parse(string)
      return true
    } catch (error) {
      return false
    }
  }
  var transpositions = [
    ["APGL", "AGPL"],
    ["Gpl", "GPL"],
    ["GLP", "GPL"],
    ["APL", "Apache"],
    ["ISD", "ISC"],
    ["GLP", "GPL"],
    ["IST", "ISC"],
    ["Claude", "Clause"],
    [" or later", "+"],
    [" International", ""],
    ["GNU", "GPL"],
    ["GUN", "GPL"],
    ["+", ""],
    ["GNU GPL", "GPL"],
    ["GNU/GPL", "GPL"],
    ["GNU GLP", "GPL"],
    ["GNU General Public License", "GPL"],
    ["Gnu public license", "GPL"],
    ["GNU Public License", "GPL"],
    ["GNU GENERAL PUBLIC LICENSE", "GPL"],
    ["MTI", "MIT"],
    ["Mozilla Public License", "MPL"],
    ["Universal Permissive License", "UPL"],
    ["WTH", "WTF"],
    ["-License", ""],
  ]
  var TRANSPOSED = 0
  var CORRECT = 1
  var transforms = [
    function (argument) {
      return argument.toUpperCase()
    },
    function (argument) {
      return argument.trim()
    },
    function (argument) {
      return argument.replace(/\./g, "")
    },
    function (argument) {
      return argument.replace(/\s+/g, "")
    },
    function (argument) {
      return argument.replace(/\s+/g, "-")
    },
    function (argument) {
      return argument.replace("v", "-")
    },
    function (argument) {
      return argument.replace(/,?\s*(\d)/, "-$1")
    },
    function (argument) {
      return argument.replace(/,?\s*(\d)/, "-$1.0")
    },
    function (argument) {
      return argument.replace(
        /,?\s*(V\.|v\.|V|v|Version|version)\s*(\d)/,
        "-$2",
      )
    },
    function (argument) {
      return argument.replace(
        /,?\s*(V\.|v\.|V|v|Version|version)\s*(\d)/,
        "-$2.0",
      )
    },
    function (argument) {
      return argument[0].toUpperCase() + argument.slice(1)
    },
    function (argument) {
      return argument.replace("/", "-")
    },
    function (argument) {
      return argument.replace(/\s*V\s*(\d)/, "-$1").replace(/(\d)$/, "$1.0")
    },
    function (argument) {
      if (argument.indexOf("3.0") !== -1) {
        return argument + "-or-later"
      } else {
        return argument + "-only"
      }
    },
    function (argument) {
      return argument + "only"
    },
    function (argument) {
      return argument.replace(/(\d)$/, "-$1.0")
    },
    function (argument) {
      return argument.replace(/(-| )?(\d)$/, "-$2-Clause")
    },
    function (argument) {
      return argument.replace(/(-| )clause(-| )(\d)/, "-$3-Clause")
    },
    function (argument) {
      return argument.replace(
        /\b(Modified|New|Revised)(-| )?BSD((-| )License)?/i,
        "BSD-3-Clause",
      )
    },
    function (argument) {
      return argument.replace(
        /\bSimplified(-| )?BSD((-| )License)?/i,
        "BSD-2-Clause",
      )
    },
    function (argument) {
      return argument.replace(
        /\b(Free|Net)(-| )?BSD((-| )License)?/i,
        "BSD-2-Clause-$1BSD",
      )
    },
    function (argument) {
      return argument.replace(
        /\bClear(-| )?BSD((-| )License)?/i,
        "BSD-3-Clause-Clear",
      )
    },
    function (argument) {
      return argument.replace(
        /\b(Old|Original)(-| )?BSD((-| )License)?/i,
        "BSD-4-Clause",
      )
    },
    function (argument) {
      return "CC-" + argument
    },
    function (argument) {
      return "CC-" + argument + "-4.0"
    },
    function (argument) {
      return argument
        .replace("Attribution", "BY")
        .replace("NonCommercial", "NC")
        .replace("NoDerivatives", "ND")
        .replace(/ (\d)/, "-$1")
        .replace(/ ?International/, "")
    },
    function (argument) {
      return (
        "CC-" +
        argument
          .replace("Attribution", "BY")
          .replace("NonCommercial", "NC")
          .replace("NoDerivatives", "ND")
          .replace(/ (\d)/, "-$1")
          .replace(/ ?International/, "") +
        "-4.0"
      )
    },
  ]
  var licensesWithVersions = spdxLicenseIds
    .map(function (id) {
      var match = /^(.*)-\d+\.\d+$/.exec(id)
      return match ? [match[0], match[1]] : [id, null]
    })
    .reduce(function (objectMap, item) {
      var key = item[1]
      objectMap[key] = objectMap[key] || []
      objectMap[key].push(item[0])
      return objectMap
    }, {})
  var licensesWithOneVersion = Object.keys(licensesWithVersions)
    .map(function makeEntries(key) {
      return [key, licensesWithVersions[key]]
    })
    .filter(function identifySoleVersions(item) {
      return item[1].length === 1 && item[0] !== null && item[0] !== "APL"
    })
    .map(function createLastResorts(item) {
      return [item[0], item[1][0]]
    })
  licensesWithVersions = void 0
  var lastResorts = [
    ["UNLI", "Unlicense"],
    ["WTF", "WTFPL"],
    ["2 CLAUSE", "BSD-2-Clause"],
    ["2-CLAUSE", "BSD-2-Clause"],
    ["3 CLAUSE", "BSD-3-Clause"],
    ["3-CLAUSE", "BSD-3-Clause"],
    ["AFFERO", "AGPL-3.0-or-later"],
    ["AGPL", "AGPL-3.0-or-later"],
    ["APACHE", "Apache-2.0"],
    ["ARTISTIC", "Artistic-2.0"],
    ["Affero", "AGPL-3.0-or-later"],
    ["BEER", "Beerware"],
    ["BOOST", "BSL-1.0"],
    ["BSD", "BSD-2-Clause"],
    ["CDDL", "CDDL-1.1"],
    ["ECLIPSE", "EPL-1.0"],
    ["FUCK", "WTFPL"],
    ["GNU", "GPL-3.0-or-later"],
    ["LGPL", "LGPL-3.0-or-later"],
    ["GPLV1", "GPL-1.0-only"],
    ["GPL-1", "GPL-1.0-only"],
    ["GPLV2", "GPL-2.0-only"],
    ["GPL-2", "GPL-2.0-only"],
    ["GPL", "GPL-3.0-or-later"],
    ["MIT +NO-FALSE-ATTRIBS", "MITNFA"],
    ["MIT", "MIT"],
    ["MPL", "MPL-2.0"],
    ["X11", "X11"],
    ["ZLIB", "Zlib"],
  ].concat(licensesWithOneVersion)
  var SUBSTRING = 0
  var IDENTIFIER = 1
  var validTransformation = function (identifier) {
    for (var i = 0; i < transforms.length; i++) {
      var transformed = transforms[i](identifier).trim()
      if (transformed !== identifier && valid(transformed)) {
        return transformed
      }
    }
    return null
  }
  var validLastResort = function (identifier) {
    var upperCased = identifier.toUpperCase()
    for (var i = 0; i < lastResorts.length; i++) {
      var lastResort = lastResorts[i]
      if (upperCased.indexOf(lastResort[SUBSTRING]) > -1) {
        return lastResort[IDENTIFIER]
      }
    }
    return null
  }
  var anyCorrection = function (identifier, check) {
    for (var i = 0; i < transpositions.length; i++) {
      var transposition = transpositions[i]
      var transposed = transposition[TRANSPOSED]
      if (identifier.indexOf(transposed) > -1) {
        var corrected = identifier.replace(transposed, transposition[CORRECT])
        var checked = check(corrected)
        if (checked !== null) {
          return checked
        }
      }
    }
    return null
  }
  module.exports = function (identifier, options) {
    options = options || {}
    var upgrade = options.upgrade === void 0 ? true : !!options.upgrade
    function postprocess(value) {
      return upgrade ? upgradeGPLs(value) : value
    }
    var validArugment =
      typeof identifier === "string" && identifier.trim().length !== 0
    if (!validArugment) {
      throw Error("Invalid argument. Expected non-empty string.")
    }
    identifier = identifier.trim()
    if (valid(identifier)) {
      return postprocess(identifier)
    }
    var noPlus = identifier.replace(/\+$/, "").trim()
    if (valid(noPlus)) {
      return postprocess(noPlus)
    }
    var transformed = validTransformation(identifier)
    if (transformed !== null) {
      return postprocess(transformed)
    }
    transformed = anyCorrection(identifier, function (argument) {
      if (valid(argument)) {
        return argument
      }
      return validTransformation(argument)
    })
    if (transformed !== null) {
      return postprocess(transformed)
    }
    transformed = validLastResort(identifier)
    if (transformed !== null) {
      return postprocess(transformed)
    }
    transformed = anyCorrection(identifier, validLastResort)
    if (transformed !== null) {
      return postprocess(transformed)
    }
    return null
  }
  function upgradeGPLs(value) {
    if (
      [
        "GPL-1.0",
        "LGPL-1.0",
        "AGPL-1.0",
        "GPL-2.0",
        "LGPL-2.0",
        "AGPL-2.0",
        "LGPL-2.1",
      ].indexOf(value) !== -1
    ) {
      return value + "-only"
    } else if (
      [
        "GPL-1.0+",
        "GPL-2.0+",
        "GPL-3.0+",
        "LGPL-2.0+",
        "LGPL-2.1+",
        "LGPL-3.0+",
        "AGPL-1.0+",
        "AGPL-3.0+",
      ].indexOf(value) !== -1
    ) {
      return value.replace(/\+$/, "-or-later")
    } else if (["GPL-3.0", "LGPL-3.0", "AGPL-3.0"].indexOf(value) !== -1) {
      return value + "-or-later"
    } else {
      return value
    }
  }
})

// node_modules/validate-npm-package-license/index.js
var require_validate_npm_package_license = __commonJS((exports, module) => {
  var parse = require_spdx_expression_parse()
  var correct = require_spdx_correct()
  var genericWarning =
    'license should be a valid SPDX license expression (without "LicenseRef"), "UNLICENSED", or "SEE LICENSE IN <filename>"'
  var fileReferenceRE = /^SEE LICEN[CS]E IN (.+)$/
  function startsWith(prefix, string) {
    return string.slice(0, prefix.length) === prefix
  }
  function usesLicenseRef(ast) {
    if (ast.hasOwnProperty("license")) {
      var license = ast.license
      return (
        startsWith("LicenseRef", license) || startsWith("DocumentRef", license)
      )
    } else {
      return usesLicenseRef(ast.left) || usesLicenseRef(ast.right)
    }
  }
  module.exports = function (argument) {
    var ast
    try {
      ast = parse(argument)
    } catch (e) {
      var match
      if (argument === "UNLICENSED" || argument === "UNLICENCED") {
        return {
          validForOldPackages: true,
          validForNewPackages: true,
          unlicensed: true,
        }
      } else if ((match = fileReferenceRE.exec(argument))) {
        return {
          validForOldPackages: true,
          validForNewPackages: true,
          inFile: match[1],
        }
      } else {
        var result = {
          validForOldPackages: false,
          validForNewPackages: false,
          warnings: [genericWarning],
        }
        if (argument.trim().length !== 0) {
          var corrected = correct(argument)
          if (corrected) {
            result.warnings.push(
              'license is similar to the valid expression "' + corrected + '"',
            )
          }
        }
        return result
      }
    }
    if (usesLicenseRef(ast)) {
      return {
        validForNewPackages: false,
        validForOldPackages: false,
        spdx: true,
        warnings: [genericWarning],
      }
    } else {
      return {
        validForNewPackages: true,
        validForOldPackages: true,
        spdx: true,
      }
    }
  }
})

// node_modules/hosted-git-info/git-host-info.js
var require_git_host_info = __commonJS((exports, module) => {
  "use strict"
  var gitHosts = (module.exports = {
    github: {
      protocols: ["git", "http", "git+ssh", "git+https", "ssh", "https"],
      domain: "github.com",
      treepath: "tree",
      filetemplate:
        "https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}",
      bugstemplate: "https://{domain}/{user}/{project}/issues",
      gittemplate: "git://{auth@}{domain}/{user}/{project}.git{#committish}",
      tarballtemplate:
        "https://codeload.{domain}/{user}/{project}/tar.gz/{committish}",
    },
    bitbucket: {
      protocols: ["git+ssh", "git+https", "ssh", "https"],
      domain: "bitbucket.org",
      treepath: "src",
      tarballtemplate:
        "https://{domain}/{user}/{project}/get/{committish}.tar.gz",
    },
    gitlab: {
      protocols: ["git+ssh", "git+https", "ssh", "https"],
      domain: "gitlab.com",
      treepath: "tree",
      bugstemplate: "https://{domain}/{user}/{project}/issues",
      httpstemplate:
        "git+https://{auth@}{domain}/{user}/{projectPath}.git{#committish}",
      tarballtemplate:
        "https://{domain}/{user}/{project}/repository/archive.tar.gz?ref={committish}",
      pathmatch: /^[/]([^/]+)[/]((?!.*(\/-\/|\/repository\/archive\.tar\.gz\?=.*|\/repository\/[^/]+\/archive.tar.gz$)).*?)(?:[.]git|[/])?$/,
    },
    gist: {
      protocols: ["git", "git+ssh", "git+https", "ssh", "https"],
      domain: "gist.github.com",
      pathmatch: /^[/](?:([^/]+)[/])?([a-z0-9]{32,})(?:[.]git)?$/,
      filetemplate:
        "https://gist.githubusercontent.com/{user}/{project}/raw{/committish}/{path}",
      bugstemplate: "https://{domain}/{project}",
      gittemplate: "git://{domain}/{project}.git{#committish}",
      sshtemplate: "git@{domain}:/{project}.git{#committish}",
      sshurltemplate: "git+ssh://git@{domain}/{project}.git{#committish}",
      browsetemplate: "https://{domain}/{project}{/committish}",
      browsefiletemplate: "https://{domain}/{project}{/committish}{#path}",
      docstemplate: "https://{domain}/{project}{/committish}",
      httpstemplate: "git+https://{domain}/{project}.git{#committish}",
      shortcuttemplate: "{type}:{project}{#committish}",
      pathtemplate: "{project}{#committish}",
      tarballtemplate:
        "https://codeload.github.com/gist/{project}/tar.gz/{committish}",
      hashformat: function (fragment) {
        return "file-" + formatHashFragment(fragment)
      },
    },
  })
  var gitHostDefaults = {
    sshtemplate: "git@{domain}:{user}/{project}.git{#committish}",
    sshurltemplate: "git+ssh://git@{domain}/{user}/{project}.git{#committish}",
    browsetemplate: "https://{domain}/{user}/{project}{/tree/committish}",
    browsefiletemplate:
      "https://{domain}/{user}/{project}/{treepath}/{committish}/{path}{#fragment}",
    docstemplate: "https://{domain}/{user}/{project}{/tree/committish}#readme",
    httpstemplate:
      "git+https://{auth@}{domain}/{user}/{project}.git{#committish}",
    filetemplate: "https://{domain}/{user}/{project}/raw/{committish}/{path}",
    shortcuttemplate: "{type}:{user}/{project}{#committish}",
    pathtemplate: "{user}/{project}{#committish}",
    pathmatch: /^[/]([^/]+)[/]([^/]+?)(?:[.]git|[/])?$/,
    hashformat: formatHashFragment,
  }
  Object.keys(gitHosts).forEach(function (name) {
    Object.keys(gitHostDefaults).forEach(function (key) {
      if (gitHosts[name][key]) return
      gitHosts[name][key] = gitHostDefaults[key]
    })
    gitHosts[name].protocols_re = RegExp(
      "^(" +
        gitHosts[name].protocols
          .map(function (protocol) {
            return protocol.replace(/([\\+*{}()[\]$^|])/g, "\\$1")
          })
          .join("|") +
        "):$",
    )
  })
  function formatHashFragment(fragment) {
    return fragment
      .toLowerCase()
      .replace(/^\W+|\/|\W+$/g, "")
      .replace(/\W+/g, "-")
  }
})

// node_modules/hosted-git-info/git-host.js
var require_git_host = __commonJS((exports, module) => {
  "use strict"
  var gitHosts = require_git_host_info()
  var extend =
    Object.assign ||
    function _extend(target, source) {
      if (source === null || typeof source !== "object") return target
      var keys = Object.keys(source)
      var i = keys.length
      while (i--) {
        target[keys[i]] = source[keys[i]]
      }
      return target
    }
  module.exports = GitHost
  function GitHost(
    type,
    user,
    auth,
    project,
    committish,
    defaultRepresentation,
    opts,
  ) {
    var gitHostInfo = this
    gitHostInfo.type = type
    Object.keys(gitHosts[type]).forEach(function (key) {
      gitHostInfo[key] = gitHosts[type][key]
    })
    gitHostInfo.user = user
    gitHostInfo.auth = auth
    gitHostInfo.project = project
    gitHostInfo.committish = committish
    gitHostInfo.default = defaultRepresentation
    gitHostInfo.opts = opts || {}
  }
  GitHost.prototype.hash = function () {
    return this.committish ? "#" + this.committish : ""
  }
  GitHost.prototype._fill = function (template, opts) {
    if (!template) return
    var vars = extend({}, opts)
    vars.path = vars.path ? vars.path.replace(/^[/]+/g, "") : ""
    opts = extend(extend({}, this.opts), opts)
    var self = this
    Object.keys(this).forEach(function (key) {
      if (self[key] != null && vars[key] == null) vars[key] = self[key]
    })
    var rawAuth = vars.auth
    var rawcommittish = vars.committish
    var rawFragment = vars.fragment
    var rawPath = vars.path
    var rawProject = vars.project
    Object.keys(vars).forEach(function (key) {
      var value = vars[key]
      if ((key === "path" || key === "project") && typeof value === "string") {
        vars[key] = value
          .split("/")
          .map(function (pathComponent) {
            return encodeURIComponent(pathComponent)
          })
          .join("/")
      } else {
        vars[key] = encodeURIComponent(value)
      }
    })
    vars["auth@"] = rawAuth ? rawAuth + "@" : ""
    vars["#fragment"] = rawFragment ? "#" + this.hashformat(rawFragment) : ""
    vars.fragment = vars.fragment ? vars.fragment : ""
    vars["#path"] = rawPath ? "#" + this.hashformat(rawPath) : ""
    vars["/path"] = vars.path ? "/" + vars.path : ""
    vars.projectPath = rawProject.split("/").map(encodeURIComponent).join("/")
    if (opts.noCommittish) {
      vars["#committish"] = ""
      vars["/tree/committish"] = ""
      vars["/committish"] = ""
      vars.committish = ""
    } else {
      vars["#committish"] = rawcommittish ? "#" + rawcommittish : ""
      vars["/tree/committish"] = vars.committish
        ? "/" + vars.treepath + "/" + vars.committish
        : ""
      vars["/committish"] = vars.committish ? "/" + vars.committish : ""
      vars.committish = vars.committish || "master"
    }
    var res = template
    Object.keys(vars).forEach(function (key) {
      res = res.replace(new RegExp("[{]" + key + "[}]", "g"), vars[key])
    })
    if (opts.noGitPlus) {
      return res.replace(/^git[+]/, "")
    } else {
      return res
    }
  }
  GitHost.prototype.ssh = function (opts) {
    return this._fill(this.sshtemplate, opts)
  }
  GitHost.prototype.sshurl = function (opts) {
    return this._fill(this.sshurltemplate, opts)
  }
  GitHost.prototype.browse = function (P, F, opts) {
    if (typeof P === "string") {
      if (typeof F !== "string") {
        opts = F
        F = null
      }
      return this._fill(
        this.browsefiletemplate,
        extend(
          {
            fragment: F,
            path: P,
          },
          opts,
        ),
      )
    } else {
      return this._fill(this.browsetemplate, P)
    }
  }
  GitHost.prototype.docs = function (opts) {
    return this._fill(this.docstemplate, opts)
  }
  GitHost.prototype.bugs = function (opts) {
    return this._fill(this.bugstemplate, opts)
  }
  GitHost.prototype.https = function (opts) {
    return this._fill(this.httpstemplate, opts)
  }
  GitHost.prototype.git = function (opts) {
    return this._fill(this.gittemplate, opts)
  }
  GitHost.prototype.shortcut = function (opts) {
    return this._fill(this.shortcuttemplate, opts)
  }
  GitHost.prototype.path = function (opts) {
    return this._fill(this.pathtemplate, opts)
  }
  GitHost.prototype.tarball = function (opts_) {
    var opts = extend({}, opts_, { noCommittish: false })
    return this._fill(this.tarballtemplate, opts)
  }
  GitHost.prototype.file = function (P, opts) {
    return this._fill(this.filetemplate, extend({ path: P }, opts))
  }
  GitHost.prototype.getDefaultRepresentation = function () {
    return this.default
  }
  GitHost.prototype.toString = function (opts) {
    if (this.default && typeof this[this.default] === "function")
      return this[this.default](opts)
    return this.sshurl(opts)
  }
})

// node_modules/hosted-git-info/index.js
var require_hosted_git_info = __commonJS((exports, module) => {
  "use strict"
  var url = require("url")
  var gitHosts = require_git_host_info()
  var GitHost = (module.exports = require_git_host())
  var protocolToRepresentationMap = {
    "git+ssh:": "sshurl",
    "git+https:": "https",
    "ssh:": "sshurl",
    "git:": "git",
  }
  function protocolToRepresentation(protocol) {
    return protocolToRepresentationMap[protocol] || protocol.slice(0, -1)
  }
  var authProtocols = {
    "git:": true,
    "https:": true,
    "git+https:": true,
    "http:": true,
    "git+http:": true,
  }
  var cache = {}
  module.exports.fromUrl = function (giturl, opts) {
    if (typeof giturl !== "string") return
    var key = giturl + JSON.stringify(opts || {})
    if (!(key in cache)) {
      cache[key] = fromUrl(giturl, opts)
    }
    return cache[key]
  }
  function fromUrl(giturl, opts) {
    if (giturl == null || giturl === "") return
    var url2 = fixupUnqualifiedGist(
      isGitHubShorthand(giturl) ? "github:" + giturl : giturl,
    )
    var parsed = parseGitUrl(url2)
    var shortcutMatch = url2.match(
      new RegExp(
        "^([^:]+):(?:(?:[^@:]+(?:[^@]+)?@)?([^/]*))[/](.+?)(?:[.]git)?($|#)",
      ),
    )
    var matches = Object.keys(gitHosts)
      .map(function (gitHostName) {
        try {
          var gitHostInfo = gitHosts[gitHostName]
          var auth = null
          if (parsed.auth && authProtocols[parsed.protocol]) {
            auth = parsed.auth
          }
          var committish = parsed.hash
            ? decodeURIComponent(parsed.hash.substr(1))
            : null
          var user = null
          var project = null
          var defaultRepresentation = null
          if (shortcutMatch && shortcutMatch[1] === gitHostName) {
            user = shortcutMatch[2] && decodeURIComponent(shortcutMatch[2])
            project = decodeURIComponent(shortcutMatch[3])
            defaultRepresentation = "shortcut"
          } else {
            if (
              parsed.host &&
              parsed.host !== gitHostInfo.domain &&
              parsed.host.replace(/^www[.]/, "") !== gitHostInfo.domain
            )
              return
            if (!gitHostInfo.protocols_re.test(parsed.protocol)) return
            if (!parsed.path) return
            var pathmatch = gitHostInfo.pathmatch
            var matched = parsed.path.match(pathmatch)
            if (!matched) return
            if (matched[1] !== null && matched[1] !== void 0) {
              user = decodeURIComponent(matched[1].replace(/^:/, ""))
            }
            project = decodeURIComponent(matched[2])
            defaultRepresentation = protocolToRepresentation(parsed.protocol)
          }
          return new GitHost(
            gitHostName,
            user,
            auth,
            project,
            committish,
            defaultRepresentation,
            opts,
          )
        } catch (ex) {
          if (ex instanceof URIError) {
          } else throw ex
        }
      })
      .filter(function (gitHostInfo) {
        return gitHostInfo
      })
    if (matches.length !== 1) return
    return matches[0]
  }
  function isGitHubShorthand(arg) {
    return /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(arg)
  }
  function fixupUnqualifiedGist(giturl) {
    var parsed = url.parse(giturl)
    if (parsed.protocol === "gist:" && parsed.host && !parsed.path) {
      return parsed.protocol + "/" + parsed.host
    } else {
      return giturl
    }
  }
  function parseGitUrl(giturl) {
    var matched = giturl.match(
      /^([^@]+)@([^:/]+):[/]?((?:[^/]+[/])?[^/]+?)(?:[.]git)?(#.*)?$/,
    )
    if (!matched) {
      var legacy = url.parse(giturl)
      if (legacy.auth && typeof url.URL === "function") {
        var authmatch = giturl.match(/[^@]+@[^:/]+/)
        if (authmatch) {
          var whatwg = new url.URL(authmatch[0])
          legacy.auth = whatwg.username || ""
          if (whatwg.password) legacy.auth += ":" + whatwg.password
        }
      }
      return legacy
    }
    return {
      protocol: "git+ssh:",
      slashes: true,
      auth: matched[1],
      host: matched[2],
      port: null,
      hostname: matched[2],
      hash: matched[4],
      search: null,
      query: null,
      pathname: "/" + matched[3],
      path: "/" + matched[3],
      href:
        "git+ssh://" +
        matched[1] +
        "@" +
        matched[2] +
        "/" +
        matched[3] +
        (matched[4] || ""),
    }
  }
})

// node_modules/resolve/lib/caller.js
var require_caller = __commonJS((exports, module) => {
  module.exports = function () {
    var origPrepareStackTrace = Error.prepareStackTrace
    Error.prepareStackTrace = function (_, stack2) {
      return stack2
    }
    var stack = new Error().stack
    Error.prepareStackTrace = origPrepareStackTrace
    return stack[2].getFileName()
  }
})

// node_modules/path-parse/index.js
var require_path_parse = __commonJS((exports, module) => {
  "use strict"
  var isWindows = process.platform === "win32"
  var splitDeviceRe = /^([a-zA-Z]:|[\\\/]{2}[^\\\/]+[\\\/]+[^\\\/]+)?([\\\/])?([\s\S]*?)$/
  var splitTailRe = /^([\s\S]*?)((?:\.{1,2}|[^\\\/]+?|)(\.[^.\/\\]*|))(?:[\\\/]*)$/
  var win32 = {}
  function win32SplitPath(filename) {
    var result = splitDeviceRe.exec(filename),
      device = (result[1] || "") + (result[2] || ""),
      tail = result[3] || ""
    var result2 = splitTailRe.exec(tail),
      dir = result2[1],
      basename = result2[2],
      ext = result2[3]
    return [device, dir, basename, ext]
  }
  win32.parse = function (pathString) {
    if (typeof pathString !== "string") {
      throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString,
      )
    }
    var allParts = win32SplitPath(pathString)
    if (!allParts || allParts.length !== 4) {
      throw new TypeError("Invalid path '" + pathString + "'")
    }
    return {
      root: allParts[0],
      dir: allParts[0] + allParts[1].slice(0, -1),
      base: allParts[2],
      ext: allParts[3],
      name: allParts[2].slice(0, allParts[2].length - allParts[3].length),
    }
  }
  var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/
  var posix = {}
  function posixSplitPath(filename) {
    return splitPathRe.exec(filename).slice(1)
  }
  posix.parse = function (pathString) {
    if (typeof pathString !== "string") {
      throw new TypeError(
        "Parameter 'pathString' must be a string, not " + typeof pathString,
      )
    }
    var allParts = posixSplitPath(pathString)
    if (!allParts || allParts.length !== 4) {
      throw new TypeError("Invalid path '" + pathString + "'")
    }
    allParts[1] = allParts[1] || ""
    allParts[2] = allParts[2] || ""
    allParts[3] = allParts[3] || ""
    return {
      root: allParts[0],
      dir: allParts[0] + allParts[1].slice(0, -1),
      base: allParts[2],
      ext: allParts[3],
      name: allParts[2].slice(0, allParts[2].length - allParts[3].length),
    }
  }
  if (isWindows) module.exports = win32.parse
  else module.exports = posix.parse
  module.exports.posix = posix.parse
  module.exports.win32 = win32.parse
})

// node_modules/resolve/lib/node-modules-paths.js
var require_node_modules_paths = __commonJS((exports, module) => {
  var path = require("path")
  var parse = path.parse || require_path_parse()
  var getNodeModulesDirs = function getNodeModulesDirs2(
    absoluteStart,
    modules,
  ) {
    var prefix = "/"
    if (/^([A-Za-z]:)/.test(absoluteStart)) {
      prefix = ""
    } else if (/^\\\\/.test(absoluteStart)) {
      prefix = "\\\\"
    }
    var paths = [absoluteStart]
    var parsed = parse(absoluteStart)
    while (parsed.dir !== paths[paths.length - 1]) {
      paths.push(parsed.dir)
      parsed = parse(parsed.dir)
    }
    return paths.reduce(function (dirs, aPath) {
      return dirs.concat(
        modules.map(function (moduleDir) {
          return path.resolve(prefix, aPath, moduleDir)
        }),
      )
    }, [])
  }
  module.exports = function nodeModulesPaths(start, opts, request) {
    var modules =
      opts && opts.moduleDirectory
        ? [].concat(opts.moduleDirectory)
        : ["node_modules"]
    if (opts && typeof opts.paths === "function") {
      return opts.paths(
        request,
        start,
        function () {
          return getNodeModulesDirs(start, modules)
        },
        opts,
      )
    }
    var dirs = getNodeModulesDirs(start, modules)
    return opts && opts.paths ? dirs.concat(opts.paths) : dirs
  }
})

// node_modules/resolve/lib/normalize-options.js
var require_normalize_options = __commonJS((exports, module) => {
  module.exports = function (x, opts) {
    return opts || {}
  }
})

// node_modules/function-bind/implementation.js
var require_implementation = __commonJS((exports, module) => {
  "use strict"
  var ERROR_MESSAGE = "Function.prototype.bind called on incompatible "
  var slice = Array.prototype.slice
  var toStr = Object.prototype.toString
  var funcType = "[object Function]"
  module.exports = function bind(that) {
    var target = this
    if (typeof target !== "function" || toStr.call(target) !== funcType) {
      throw new TypeError(ERROR_MESSAGE + target)
    }
    var args = slice.call(arguments, 1)
    var bound
    var binder = function () {
      if (this instanceof bound) {
        var result = target.apply(this, args.concat(slice.call(arguments)))
        if (Object(result) === result) {
          return result
        }
        return this
      } else {
        return target.apply(that, args.concat(slice.call(arguments)))
      }
    }
    var boundLength = Math.max(0, target.length - args.length)
    var boundArgs = []
    for (var i = 0; i < boundLength; i++) {
      boundArgs.push("$" + i)
    }
    bound = Function(
      "binder",
      "return function (" +
        boundArgs.join(",") +
        "){ return binder.apply(this,arguments); }",
    )(binder)
    if (target.prototype) {
      var Empty = function Empty2() {}
      Empty.prototype = target.prototype
      bound.prototype = new Empty()
      Empty.prototype = null
    }
    return bound
  }
})

// node_modules/function-bind/index.js
var require_function_bind = __commonJS((exports, module) => {
  "use strict"
  var implementation = require_implementation()
  module.exports = Function.prototype.bind || implementation
})

// node_modules/has/src/index.js
var require_src = __commonJS((exports, module) => {
  "use strict"
  var bind = require_function_bind()
  module.exports = bind.call(Function.call, Object.prototype.hasOwnProperty)
})

// node_modules/is-core-module/core.json
var require_core = __commonJS((exports, module) => {
  module.exports = {
    assert: true,
    "assert/strict": ">= 15",
    async_hooks: ">= 8",
    buffer_ieee754: "< 0.9.7",
    buffer: true,
    child_process: true,
    cluster: true,
    console: true,
    constants: true,
    crypto: true,
    _debug_agent: ">= 1 && < 8",
    _debugger: "< 8",
    dgram: true,
    diagnostics_channel: ">= 15.1",
    dns: true,
    "dns/promises": ">= 15",
    domain: ">= 0.7.12",
    events: true,
    freelist: "< 6",
    fs: true,
    "fs/promises": [">= 10 && < 10.1", ">= 14"],
    _http_agent: ">= 0.11.1",
    _http_client: ">= 0.11.1",
    _http_common: ">= 0.11.1",
    _http_incoming: ">= 0.11.1",
    _http_outgoing: ">= 0.11.1",
    _http_server: ">= 0.11.1",
    http: true,
    http2: ">= 8.8",
    https: true,
    inspector: ">= 8.0.0",
    _linklist: "< 8",
    module: true,
    net: true,
    "node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
    "node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
    "node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
    os: true,
    path: true,
    "path/posix": ">= 15.3",
    "path/win32": ">= 15.3",
    perf_hooks: ">= 8.5",
    process: ">= 1",
    punycode: true,
    querystring: true,
    readline: true,
    repl: true,
    smalloc: ">= 0.11.5 && < 3",
    _stream_duplex: ">= 0.9.4",
    _stream_transform: ">= 0.9.4",
    _stream_wrap: ">= 1.4.1",
    _stream_passthrough: ">= 0.9.4",
    _stream_readable: ">= 0.9.4",
    _stream_writable: ">= 0.9.4",
    stream: true,
    "stream/promises": ">= 15",
    string_decoder: true,
    sys: [">= 0.6 && < 0.7", ">= 0.8"],
    timers: true,
    "timers/promises": ">= 15",
    _tls_common: ">= 0.11.13",
    _tls_legacy: ">= 0.11.3 && < 10",
    _tls_wrap: ">= 0.11.3",
    tls: true,
    trace_events: ">= 10",
    tty: true,
    url: true,
    util: true,
    "util/types": ">= 15.3",
    "v8/tools/arguments": ">= 10 && < 12",
    "v8/tools/codemap": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/consarray": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/csvparser": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/logreader": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/profile_view": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/splaytree": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    v8: ">= 1",
    vm: true,
    wasi: ">= 13.4 && < 13.5",
    worker_threads: ">= 11.7",
    zlib: true,
  }
})

// node_modules/is-core-module/index.js
var require_is_core_module = __commonJS((exports, module) => {
  "use strict"
  var has = require_src()
  function specifierIncluded(current, specifier) {
    var nodeParts = current.split(".")
    var parts = specifier.split(" ")
    var op = parts.length > 1 ? parts[0] : "="
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".")
    for (var i = 0; i < 3; ++i) {
      var cur = parseInt(nodeParts[i] || 0, 10)
      var ver = parseInt(versionParts[i] || 0, 10)
      if (cur === ver) {
        continue
      }
      if (op === "<") {
        return cur < ver
      }
      if (op === ">=") {
        return cur >= ver
      }
      return false
    }
    return op === ">="
  }
  function matchesRange(current, range) {
    var specifiers = range.split(/ ?&& ?/)
    if (specifiers.length === 0) {
      return false
    }
    for (var i = 0; i < specifiers.length; ++i) {
      if (!specifierIncluded(current, specifiers[i])) {
        return false
      }
    }
    return true
  }
  function versionIncluded(nodeVersion, specifierValue) {
    if (typeof specifierValue === "boolean") {
      return specifierValue
    }
    var current =
      typeof nodeVersion === "undefined"
        ? process.versions && process.versions.node && process.versions.node
        : nodeVersion
    if (typeof current !== "string") {
      throw new TypeError(
        typeof nodeVersion === "undefined"
          ? "Unable to determine current node version"
          : "If provided, a valid node version is required",
      )
    }
    if (specifierValue && typeof specifierValue === "object") {
      for (var i = 0; i < specifierValue.length; ++i) {
        if (matchesRange(current, specifierValue[i])) {
          return true
        }
      }
      return false
    }
    return matchesRange(current, specifierValue)
  }
  var data = require_core()
  module.exports = function isCore(x, nodeVersion) {
    return has(data, x) && versionIncluded(nodeVersion, data[x])
  }
})

// node_modules/resolve/lib/async.js
var require_async = __commonJS((exports, module) => {
  var fs = require("fs")
  var path = require("path")
  var caller = require_caller()
  var nodeModulesPaths = require_node_modules_paths()
  var normalizeOptions = require_normalize_options()
  var isCore = require_is_core_module()
  var realpathFS =
    fs.realpath && typeof fs.realpath.native === "function"
      ? fs.realpath.native
      : fs.realpath
  var defaultIsFile = function isFile(file, cb) {
    fs.stat(file, function (err, stat) {
      if (!err) {
        return cb(null, stat.isFile() || stat.isFIFO())
      }
      if (err.code === "ENOENT" || err.code === "ENOTDIR")
        return cb(null, false)
      return cb(err)
    })
  }
  var defaultIsDir = function isDirectory(dir, cb) {
    fs.stat(dir, function (err, stat) {
      if (!err) {
        return cb(null, stat.isDirectory())
      }
      if (err.code === "ENOENT" || err.code === "ENOTDIR")
        return cb(null, false)
      return cb(err)
    })
  }
  var defaultRealpath = function realpath(x, cb) {
    realpathFS(x, function (realpathErr, realPath) {
      if (realpathErr && realpathErr.code !== "ENOENT") cb(realpathErr)
      else cb(null, realpathErr ? x : realPath)
    })
  }
  var maybeRealpath = function maybeRealpath2(realpath, x, opts, cb) {
    if (opts && opts.preserveSymlinks === false) {
      realpath(x, cb)
    } else {
      cb(null, x)
    }
  }
  var getPackageCandidates = function getPackageCandidates2(x, start, opts) {
    var dirs = nodeModulesPaths(start, opts, x)
    for (var i = 0; i < dirs.length; i++) {
      dirs[i] = path.join(dirs[i], x)
    }
    return dirs
  }
  module.exports = function resolve(x, options, callback) {
    var cb = callback
    var opts = options
    if (typeof options === "function") {
      cb = opts
      opts = {}
    }
    if (typeof x !== "string") {
      var err = new TypeError("Path must be a string.")
      return process.nextTick(function () {
        cb(err)
      })
    }
    opts = normalizeOptions(x, opts)
    var isFile = opts.isFile || defaultIsFile
    var isDirectory = opts.isDirectory || defaultIsDir
    var readFile = opts.readFile || fs.readFile
    var realpath = opts.realpath || defaultRealpath
    var packageIterator = opts.packageIterator
    var extensions = opts.extensions || [".js"]
    var includeCoreModules = opts.includeCoreModules !== false
    var basedir = opts.basedir || path.dirname(caller())
    var parent = opts.filename || basedir
    opts.paths = opts.paths || []
    var absoluteStart = path.resolve(basedir)
    maybeRealpath(realpath, absoluteStart, opts, function (err2, realStart) {
      if (err2) cb(err2)
      else init(realStart)
    })
    var res
    function init(basedir2) {
      if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
        res = path.resolve(basedir2, x)
        if (x === "." || x === ".." || x.slice(-1) === "/") res += "/"
        if (/\/$/.test(x) && res === basedir2) {
          loadAsDirectory(res, opts.package, onfile)
        } else loadAsFile(res, opts.package, onfile)
      } else if (includeCoreModules && isCore(x)) {
        return cb(null, x)
      } else
        loadNodeModules(x, basedir2, function (err2, n, pkg) {
          if (err2) cb(err2)
          else if (n) {
            return maybeRealpath(realpath, n, opts, function (err3, realN) {
              if (err3) {
                cb(err3)
              } else {
                cb(null, realN, pkg)
              }
            })
          } else {
            var moduleError = new Error(
              "Cannot find module '" + x + "' from '" + parent + "'",
            )
            moduleError.code = "MODULE_NOT_FOUND"
            cb(moduleError)
          }
        })
    }
    function onfile(err2, m, pkg) {
      if (err2) cb(err2)
      else if (m) cb(null, m, pkg)
      else
        loadAsDirectory(res, function (err3, d, pkg2) {
          if (err3) cb(err3)
          else if (d) {
            maybeRealpath(realpath, d, opts, function (err4, realD) {
              if (err4) {
                cb(err4)
              } else {
                cb(null, realD, pkg2)
              }
            })
          } else {
            var moduleError = new Error(
              "Cannot find module '" + x + "' from '" + parent + "'",
            )
            moduleError.code = "MODULE_NOT_FOUND"
            cb(moduleError)
          }
        })
    }
    function loadAsFile(x2, thePackage, callback2) {
      var loadAsFilePackage = thePackage
      var cb2 = callback2
      if (typeof loadAsFilePackage === "function") {
        cb2 = loadAsFilePackage
        loadAsFilePackage = void 0
      }
      var exts = [""].concat(extensions)
      load(exts, x2, loadAsFilePackage)
      function load(exts2, x3, loadPackage) {
        if (exts2.length === 0) return cb2(null, void 0, loadPackage)
        var file = x3 + exts2[0]
        var pkg = loadPackage
        if (pkg) onpkg(null, pkg)
        else loadpkg(path.dirname(file), onpkg)
        function onpkg(err2, pkg_, dir) {
          pkg = pkg_
          if (err2) return cb2(err2)
          if (dir && pkg && opts.pathFilter) {
            var rfile = path.relative(dir, file)
            var rel = rfile.slice(0, rfile.length - exts2[0].length)
            var r = opts.pathFilter(pkg, x3, rel)
            if (r)
              return load(
                [""].concat(extensions.slice()),
                path.resolve(dir, r),
                pkg,
              )
          }
          isFile(file, onex)
        }
        function onex(err2, ex) {
          if (err2) return cb2(err2)
          if (ex) return cb2(null, file, pkg)
          load(exts2.slice(1), x3, pkg)
        }
      }
    }
    function loadpkg(dir, cb2) {
      if (dir === "" || dir === "/") return cb2(null)
      if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
        return cb2(null)
      }
      if (/[/\\]node_modules[/\\]*$/.test(dir)) return cb2(null)
      maybeRealpath(realpath, dir, opts, function (unwrapErr, pkgdir) {
        if (unwrapErr) return loadpkg(path.dirname(dir), cb2)
        var pkgfile = path.join(pkgdir, "package.json")
        isFile(pkgfile, function (err2, ex) {
          if (!ex) return loadpkg(path.dirname(dir), cb2)
          readFile(pkgfile, function (err3, body) {
            if (err3) cb2(err3)
            try {
              var pkg = JSON.parse(body)
            } catch (jsonErr) {}
            if (pkg && opts.packageFilter) {
              pkg = opts.packageFilter(pkg, pkgfile)
            }
            cb2(null, pkg, dir)
          })
        })
      })
    }
    function loadAsDirectory(x2, loadAsDirectoryPackage, callback2) {
      var cb2 = callback2
      var fpkg = loadAsDirectoryPackage
      if (typeof fpkg === "function") {
        cb2 = fpkg
        fpkg = opts.package
      }
      maybeRealpath(realpath, x2, opts, function (unwrapErr, pkgdir) {
        if (unwrapErr) return cb2(unwrapErr)
        var pkgfile = path.join(pkgdir, "package.json")
        isFile(pkgfile, function (err2, ex) {
          if (err2) return cb2(err2)
          if (!ex) return loadAsFile(path.join(x2, "index"), fpkg, cb2)
          readFile(pkgfile, function (err3, body) {
            if (err3) return cb2(err3)
            try {
              var pkg = JSON.parse(body)
            } catch (jsonErr) {}
            if (pkg && opts.packageFilter) {
              pkg = opts.packageFilter(pkg, pkgfile)
            }
            if (pkg && pkg.main) {
              if (typeof pkg.main !== "string") {
                var mainError = new TypeError(
                  "package \u201C" +
                    pkg.name +
                    "\u201D `main` must be a string",
                )
                mainError.code = "INVALID_PACKAGE_MAIN"
                return cb2(mainError)
              }
              if (pkg.main === "." || pkg.main === "./") {
                pkg.main = "index"
              }
              loadAsFile(
                path.resolve(x2, pkg.main),
                pkg,
                function (err4, m, pkg2) {
                  if (err4) return cb2(err4)
                  if (m) return cb2(null, m, pkg2)
                  if (!pkg2)
                    return loadAsFile(path.join(x2, "index"), pkg2, cb2)
                  var dir = path.resolve(x2, pkg2.main)
                  loadAsDirectory(dir, pkg2, function (err5, n, pkg3) {
                    if (err5) return cb2(err5)
                    if (n) return cb2(null, n, pkg3)
                    loadAsFile(path.join(x2, "index"), pkg3, cb2)
                  })
                },
              )
              return
            }
            loadAsFile(path.join(x2, "/index"), pkg, cb2)
          })
        })
      })
    }
    function processDirs(cb2, dirs) {
      if (dirs.length === 0) return cb2(null, void 0)
      var dir = dirs[0]
      isDirectory(path.dirname(dir), isdir)
      function isdir(err2, isdir2) {
        if (err2) return cb2(err2)
        if (!isdir2) return processDirs(cb2, dirs.slice(1))
        loadAsFile(dir, opts.package, onfile2)
      }
      function onfile2(err2, m, pkg) {
        if (err2) return cb2(err2)
        if (m) return cb2(null, m, pkg)
        loadAsDirectory(dir, opts.package, ondir)
      }
      function ondir(err2, n, pkg) {
        if (err2) return cb2(err2)
        if (n) return cb2(null, n, pkg)
        processDirs(cb2, dirs.slice(1))
      }
    }
    function loadNodeModules(x2, start, cb2) {
      var thunk = function () {
        return getPackageCandidates(x2, start, opts)
      }
      processDirs(
        cb2,
        packageIterator ? packageIterator(x2, start, thunk, opts) : thunk(),
      )
    }
  }
})

// node_modules/resolve/lib/core.json
var require_core2 = __commonJS((exports, module) => {
  module.exports = {
    assert: true,
    "assert/strict": ">= 15",
    async_hooks: ">= 8",
    buffer_ieee754: "< 0.9.7",
    buffer: true,
    child_process: true,
    cluster: true,
    console: true,
    constants: true,
    crypto: true,
    _debug_agent: ">= 1 && < 8",
    _debugger: "< 8",
    dgram: true,
    diagnostics_channel: ">= 15.1",
    dns: true,
    "dns/promises": ">= 15",
    domain: ">= 0.7.12",
    events: true,
    freelist: "< 6",
    fs: true,
    "fs/promises": [">= 10 && < 10.1", ">= 14"],
    _http_agent: ">= 0.11.1",
    _http_client: ">= 0.11.1",
    _http_common: ">= 0.11.1",
    _http_incoming: ">= 0.11.1",
    _http_outgoing: ">= 0.11.1",
    _http_server: ">= 0.11.1",
    http: true,
    http2: ">= 8.8",
    https: true,
    inspector: ">= 8.0.0",
    _linklist: "< 8",
    module: true,
    net: true,
    "node-inspect/lib/_inspect": ">= 7.6.0 && < 12",
    "node-inspect/lib/internal/inspect_client": ">= 7.6.0 && < 12",
    "node-inspect/lib/internal/inspect_repl": ">= 7.6.0 && < 12",
    os: true,
    path: true,
    perf_hooks: ">= 8.5",
    process: ">= 1",
    punycode: true,
    querystring: true,
    readline: true,
    repl: true,
    smalloc: ">= 0.11.5 && < 3",
    _stream_duplex: ">= 0.9.4",
    _stream_transform: ">= 0.9.4",
    _stream_wrap: ">= 1.4.1",
    _stream_passthrough: ">= 0.9.4",
    _stream_readable: ">= 0.9.4",
    _stream_writable: ">= 0.9.4",
    stream: true,
    "stream/promises": ">= 15",
    string_decoder: true,
    sys: [">= 0.6 && < 0.7", ">= 0.8"],
    timers: true,
    "timers/promises": ">= 15",
    _tls_common: ">= 0.11.13",
    _tls_legacy: ">= 0.11.3 && < 10",
    _tls_wrap: ">= 0.11.3",
    tls: true,
    trace_events: ">= 10",
    tty: true,
    url: true,
    util: true,
    "v8/tools/arguments": ">= 10 && < 12",
    "v8/tools/codemap": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/consarray": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/csvparser": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/logreader": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/profile_view": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    "v8/tools/splaytree": [">= 4.4.0 && < 5", ">= 5.2.0 && < 12"],
    v8: ">= 1",
    vm: true,
    wasi: ">= 13.4 && < 13.5",
    worker_threads: ">= 11.7",
    zlib: true,
  }
})

// node_modules/resolve/lib/core.js
var require_core3 = __commonJS((exports, module) => {
  var current =
    (process.versions &&
      process.versions.node &&
      process.versions.node.split(".")) ||
    []
  function specifierIncluded(specifier) {
    var parts = specifier.split(" ")
    var op = parts.length > 1 ? parts[0] : "="
    var versionParts = (parts.length > 1 ? parts[1] : parts[0]).split(".")
    for (var i = 0; i < 3; ++i) {
      var cur = parseInt(current[i] || 0, 10)
      var ver = parseInt(versionParts[i] || 0, 10)
      if (cur === ver) {
        continue
      }
      if (op === "<") {
        return cur < ver
      } else if (op === ">=") {
        return cur >= ver
      } else {
        return false
      }
    }
    return op === ">="
  }
  function matchesRange(range) {
    var specifiers = range.split(/ ?&& ?/)
    if (specifiers.length === 0) {
      return false
    }
    for (var i = 0; i < specifiers.length; ++i) {
      if (!specifierIncluded(specifiers[i])) {
        return false
      }
    }
    return true
  }
  function versionIncluded(specifierValue) {
    if (typeof specifierValue === "boolean") {
      return specifierValue
    }
    if (specifierValue && typeof specifierValue === "object") {
      for (var i = 0; i < specifierValue.length; ++i) {
        if (matchesRange(specifierValue[i])) {
          return true
        }
      }
      return false
    }
    return matchesRange(specifierValue)
  }
  var data = require_core2()
  var core = {}
  for (var mod in data) {
    if (Object.prototype.hasOwnProperty.call(data, mod)) {
      core[mod] = versionIncluded(data[mod])
    }
  }
  module.exports = core
})

// node_modules/resolve/lib/is-core.js
var require_is_core = __commonJS((exports, module) => {
  var isCoreModule = require_is_core_module()
  module.exports = function isCore(x) {
    return isCoreModule(x)
  }
})

// node_modules/resolve/lib/sync.js
var require_sync = __commonJS((exports, module) => {
  var isCore = require_is_core_module()
  var fs = require("fs")
  var path = require("path")
  var caller = require_caller()
  var nodeModulesPaths = require_node_modules_paths()
  var normalizeOptions = require_normalize_options()
  var realpathFS =
    fs.realpathSync && typeof fs.realpathSync.native === "function"
      ? fs.realpathSync.native
      : fs.realpathSync
  var defaultIsFile = function isFile(file) {
    try {
      var stat = fs.statSync(file)
    } catch (e) {
      if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false
      throw e
    }
    return stat.isFile() || stat.isFIFO()
  }
  var defaultIsDir = function isDirectory(dir) {
    try {
      var stat = fs.statSync(dir)
    } catch (e) {
      if (e && (e.code === "ENOENT" || e.code === "ENOTDIR")) return false
      throw e
    }
    return stat.isDirectory()
  }
  var defaultRealpathSync = function realpathSync(x) {
    try {
      return realpathFS(x)
    } catch (realpathErr) {
      if (realpathErr.code !== "ENOENT") {
        throw realpathErr
      }
    }
    return x
  }
  var maybeRealpathSync = function maybeRealpathSync2(realpathSync, x, opts) {
    if (opts && opts.preserveSymlinks === false) {
      return realpathSync(x)
    }
    return x
  }
  var getPackageCandidates = function getPackageCandidates2(x, start, opts) {
    var dirs = nodeModulesPaths(start, opts, x)
    for (var i = 0; i < dirs.length; i++) {
      dirs[i] = path.join(dirs[i], x)
    }
    return dirs
  }
  module.exports = function resolveSync(x, options) {
    if (typeof x !== "string") {
      throw new TypeError("Path must be a string.")
    }
    var opts = normalizeOptions(x, options)
    var isFile = opts.isFile || defaultIsFile
    var readFileSync = opts.readFileSync || fs.readFileSync
    var isDirectory = opts.isDirectory || defaultIsDir
    var realpathSync = opts.realpathSync || defaultRealpathSync
    var packageIterator = opts.packageIterator
    var extensions = opts.extensions || [".js"]
    var includeCoreModules = opts.includeCoreModules !== false
    var basedir = opts.basedir || path.dirname(caller())
    var parent = opts.filename || basedir
    opts.paths = opts.paths || []
    var absoluteStart = maybeRealpathSync(
      realpathSync,
      path.resolve(basedir),
      opts,
    )
    if (/^(?:\.\.?(?:\/|$)|\/|([A-Za-z]:)?[/\\])/.test(x)) {
      var res = path.resolve(absoluteStart, x)
      if (x === "." || x === ".." || x.slice(-1) === "/") res += "/"
      var m = loadAsFileSync(res) || loadAsDirectorySync(res)
      if (m) return maybeRealpathSync(realpathSync, m, opts)
    } else if (includeCoreModules && isCore(x)) {
      return x
    } else {
      var n = loadNodeModulesSync(x, absoluteStart)
      if (n) return maybeRealpathSync(realpathSync, n, opts)
    }
    var err = new Error("Cannot find module '" + x + "' from '" + parent + "'")
    err.code = "MODULE_NOT_FOUND"
    throw err
    function loadAsFileSync(x2) {
      var pkg = loadpkg(path.dirname(x2))
      if (pkg && pkg.dir && pkg.pkg && opts.pathFilter) {
        var rfile = path.relative(pkg.dir, x2)
        var r = opts.pathFilter(pkg.pkg, x2, rfile)
        if (r) {
          x2 = path.resolve(pkg.dir, r)
        }
      }
      if (isFile(x2)) {
        return x2
      }
      for (var i = 0; i < extensions.length; i++) {
        var file = x2 + extensions[i]
        if (isFile(file)) {
          return file
        }
      }
    }
    function loadpkg(dir) {
      if (dir === "" || dir === "/") return
      if (process.platform === "win32" && /^\w:[/\\]*$/.test(dir)) {
        return
      }
      if (/[/\\]node_modules[/\\]*$/.test(dir)) return
      var pkgfile = path.join(
        maybeRealpathSync(realpathSync, dir, opts),
        "package.json",
      )
      if (!isFile(pkgfile)) {
        return loadpkg(path.dirname(dir))
      }
      var body = readFileSync(pkgfile)
      try {
        var pkg = JSON.parse(body)
      } catch (jsonErr) {}
      if (pkg && opts.packageFilter) {
        pkg = opts.packageFilter(pkg, dir)
      }
      return { pkg, dir }
    }
    function loadAsDirectorySync(x2) {
      var pkgfile = path.join(
        maybeRealpathSync(realpathSync, x2, opts),
        "/package.json",
      )
      if (isFile(pkgfile)) {
        try {
          var body = readFileSync(pkgfile, "UTF8")
          var pkg = JSON.parse(body)
        } catch (e) {}
        if (pkg && opts.packageFilter) {
          pkg = opts.packageFilter(pkg, x2)
        }
        if (pkg && pkg.main) {
          if (typeof pkg.main !== "string") {
            var mainError = new TypeError(
              "package \u201C" + pkg.name + "\u201D `main` must be a string",
            )
            mainError.code = "INVALID_PACKAGE_MAIN"
            throw mainError
          }
          if (pkg.main === "." || pkg.main === "./") {
            pkg.main = "index"
          }
          try {
            var m2 = loadAsFileSync(path.resolve(x2, pkg.main))
            if (m2) return m2
            var n2 = loadAsDirectorySync(path.resolve(x2, pkg.main))
            if (n2) return n2
          } catch (e) {}
        }
      }
      return loadAsFileSync(path.join(x2, "/index"))
    }
    function loadNodeModulesSync(x2, start) {
      var thunk = function () {
        return getPackageCandidates(x2, start, opts)
      }
      var dirs = packageIterator
        ? packageIterator(x2, start, thunk, opts)
        : thunk()
      for (var i = 0; i < dirs.length; i++) {
        var dir = dirs[i]
        if (isDirectory(path.dirname(dir))) {
          var m2 = loadAsFileSync(dir)
          if (m2) return m2
          var n2 = loadAsDirectorySync(dir)
          if (n2) return n2
        }
      }
    }
  }
})

// node_modules/resolve/index.js
var require_resolve = __commonJS((exports, module) => {
  var async = require_async()
  async.core = require_core3()
  async.isCore = require_is_core()
  async.sync = require_sync()
  module.exports = async
})

// node_modules/normalize-package-data/lib/extract_description.js
var require_extract_description = __commonJS((exports, module) => {
  module.exports = extractDescription
  function extractDescription(d) {
    if (!d) return
    if (d === "ERROR: No README data found!") return
    d = d.trim().split("\n")
    for (var s = 0; d[s] && d[s].trim().match(/^(#|$)/); s++);
    var l = d.length
    for (var e = s + 1; e < l && d[e].trim(); e++);
    return d.slice(s, e).join(" ").trim()
  }
})

// node_modules/normalize-package-data/lib/typos.json
var require_typos = __commonJS((exports, module) => {
  module.exports = {
    topLevel: {
      dependancies: "dependencies",
      dependecies: "dependencies",
      depdenencies: "dependencies",
      devEependencies: "devDependencies",
      depends: "dependencies",
      "dev-dependencies": "devDependencies",
      devDependences: "devDependencies",
      devDepenencies: "devDependencies",
      devdependencies: "devDependencies",
      repostitory: "repository",
      repo: "repository",
      prefereGlobal: "preferGlobal",
      hompage: "homepage",
      hampage: "homepage",
      autohr: "author",
      autor: "author",
      contributers: "contributors",
      publicationConfig: "publishConfig",
      script: "scripts",
    },
    bugs: { web: "url", name: "url" },
    script: { server: "start", tests: "test" },
  }
})

// node_modules/normalize-package-data/lib/fixer.js
var require_fixer = __commonJS((exports, module) => {
  var semver = require_semver()
  var validateLicense = require_validate_npm_package_license()
  var hostedGitInfo = require_hosted_git_info()
  var isBuiltinModule = require_resolve().isCore
  var depTypes = ["dependencies", "devDependencies", "optionalDependencies"]
  var extractDescription = require_extract_description()
  var url = require("url")
  var typos = require_typos()
  var fixer = (module.exports = {
    warn: function () {},
    fixRepositoryField: function (data) {
      if (data.repositories) {
        this.warn("repositories")
        data.repository = data.repositories[0]
      }
      if (!data.repository) return this.warn("missingRepository")
      if (typeof data.repository === "string") {
        data.repository = {
          type: "git",
          url: data.repository,
        }
      }
      var r = data.repository.url || ""
      if (r) {
        var hosted = hostedGitInfo.fromUrl(r)
        if (hosted) {
          r = data.repository.url =
            hosted.getDefaultRepresentation() == "shortcut"
              ? hosted.https()
              : hosted.toString()
        }
      }
      if (r.match(/github.com\/[^\/]+\/[^\/]+\.git\.git$/)) {
        this.warn("brokenGitUrl", r)
      }
    },
    fixTypos: function (data) {
      Object.keys(typos.topLevel).forEach(function (d) {
        if (data.hasOwnProperty(d)) {
          this.warn("typo", d, typos.topLevel[d])
        }
      }, this)
    },
    fixScriptsField: function (data) {
      if (!data.scripts) return
      if (typeof data.scripts !== "object") {
        this.warn("nonObjectScripts")
        delete data.scripts
        return
      }
      Object.keys(data.scripts).forEach(function (k) {
        if (typeof data.scripts[k] !== "string") {
          this.warn("nonStringScript")
          delete data.scripts[k]
        } else if (typos.script[k] && !data.scripts[typos.script[k]]) {
          this.warn("typo", k, typos.script[k], "scripts")
        }
      }, this)
    },
    fixFilesField: function (data) {
      var files = data.files
      if (files && !Array.isArray(files)) {
        this.warn("nonArrayFiles")
        delete data.files
      } else if (data.files) {
        data.files = data.files.filter(function (file) {
          if (!file || typeof file !== "string") {
            this.warn("invalidFilename", file)
            return false
          } else {
            return true
          }
        }, this)
      }
    },
    fixBinField: function (data) {
      if (!data.bin) return
      if (typeof data.bin === "string") {
        var b = {}
        var match
        if ((match = data.name.match(/^@[^/]+[/](.*)$/))) {
          b[match[1]] = data.bin
        } else {
          b[data.name] = data.bin
        }
        data.bin = b
      }
    },
    fixManField: function (data) {
      if (!data.man) return
      if (typeof data.man === "string") {
        data.man = [data.man]
      }
    },
    fixBundleDependenciesField: function (data) {
      var bdd = "bundledDependencies"
      var bd = "bundleDependencies"
      if (data[bdd] && !data[bd]) {
        data[bd] = data[bdd]
        delete data[bdd]
      }
      if (data[bd] && !Array.isArray(data[bd])) {
        this.warn("nonArrayBundleDependencies")
        delete data[bd]
      } else if (data[bd]) {
        data[bd] = data[bd].filter(function (bd2) {
          if (!bd2 || typeof bd2 !== "string") {
            this.warn("nonStringBundleDependency", bd2)
            return false
          } else {
            if (!data.dependencies) {
              data.dependencies = {}
            }
            if (!data.dependencies.hasOwnProperty(bd2)) {
              this.warn("nonDependencyBundleDependency", bd2)
              data.dependencies[bd2] = "*"
            }
            return true
          }
        }, this)
      }
    },
    fixDependencies: function (data, strict) {
      var loose = !strict
      objectifyDeps(data, this.warn)
      addOptionalDepsToDeps(data, this.warn)
      this.fixBundleDependenciesField(data)
      ;["dependencies", "devDependencies"].forEach(function (deps) {
        if (!(deps in data)) return
        if (!data[deps] || typeof data[deps] !== "object") {
          this.warn("nonObjectDependencies", deps)
          delete data[deps]
          return
        }
        Object.keys(data[deps]).forEach(function (d) {
          var r = data[deps][d]
          if (typeof r !== "string") {
            this.warn("nonStringDependency", d, JSON.stringify(r))
            delete data[deps][d]
          }
          var hosted = hostedGitInfo.fromUrl(data[deps][d])
          if (hosted) data[deps][d] = hosted.toString()
        }, this)
      }, this)
    },
    fixModulesField: function (data) {
      if (data.modules) {
        this.warn("deprecatedModules")
        delete data.modules
      }
    },
    fixKeywordsField: function (data) {
      if (typeof data.keywords === "string") {
        data.keywords = data.keywords.split(/,\s+/)
      }
      if (data.keywords && !Array.isArray(data.keywords)) {
        delete data.keywords
        this.warn("nonArrayKeywords")
      } else if (data.keywords) {
        data.keywords = data.keywords.filter(function (kw) {
          if (typeof kw !== "string" || !kw) {
            this.warn("nonStringKeyword")
            return false
          } else {
            return true
          }
        }, this)
      }
    },
    fixVersionField: function (data, strict) {
      var loose = !strict
      if (!data.version) {
        data.version = ""
        return true
      }
      if (!semver.valid(data.version, loose)) {
        throw new Error('Invalid version: "' + data.version + '"')
      }
      data.version = semver.clean(data.version, loose)
      return true
    },
    fixPeople: function (data) {
      modifyPeople(data, unParsePerson)
      modifyPeople(data, parsePerson)
    },
    fixNameField: function (data, options) {
      if (typeof options === "boolean") options = { strict: options }
      else if (typeof options === "undefined") options = {}
      var strict = options.strict
      if (!data.name && !strict) {
        data.name = ""
        return
      }
      if (typeof data.name !== "string") {
        throw new Error("name field must be a string.")
      }
      if (!strict) data.name = data.name.trim()
      ensureValidName(data.name, strict, options.allowLegacyCase)
      if (isBuiltinModule(data.name)) this.warn("conflictingName", data.name)
    },
    fixDescriptionField: function (data) {
      if (data.description && typeof data.description !== "string") {
        this.warn("nonStringDescription")
        delete data.description
      }
      if (data.readme && !data.description)
        data.description = extractDescription(data.readme)
      if (data.description === void 0) delete data.description
      if (!data.description) this.warn("missingDescription")
    },
    fixReadmeField: function (data) {
      if (!data.readme) {
        this.warn("missingReadme")
        data.readme = "ERROR: No README data found!"
      }
    },
    fixBugsField: function (data) {
      if (!data.bugs && data.repository && data.repository.url) {
        var hosted = hostedGitInfo.fromUrl(data.repository.url)
        if (hosted && hosted.bugs()) {
          data.bugs = { url: hosted.bugs() }
        }
      } else if (data.bugs) {
        var emailRe = /^.+@.*\..+$/
        if (typeof data.bugs == "string") {
          if (emailRe.test(data.bugs)) data.bugs = { email: data.bugs }
          else if (url.parse(data.bugs).protocol) data.bugs = { url: data.bugs }
          else this.warn("nonEmailUrlBugsString")
        } else {
          bugsTypos(data.bugs, this.warn)
          var oldBugs = data.bugs
          data.bugs = {}
          if (oldBugs.url) {
            if (
              typeof oldBugs.url == "string" &&
              url.parse(oldBugs.url).protocol
            )
              data.bugs.url = oldBugs.url
            else this.warn("nonUrlBugsUrlField")
          }
          if (oldBugs.email) {
            if (typeof oldBugs.email == "string" && emailRe.test(oldBugs.email))
              data.bugs.email = oldBugs.email
            else this.warn("nonEmailBugsEmailField")
          }
        }
        if (!data.bugs.email && !data.bugs.url) {
          delete data.bugs
          this.warn("emptyNormalizedBugs")
        }
      }
    },
    fixHomepageField: function (data) {
      if (!data.homepage && data.repository && data.repository.url) {
        var hosted = hostedGitInfo.fromUrl(data.repository.url)
        if (hosted && hosted.docs()) data.homepage = hosted.docs()
      }
      if (!data.homepage) return
      if (typeof data.homepage !== "string") {
        this.warn("nonUrlHomepage")
        return delete data.homepage
      }
      if (!url.parse(data.homepage).protocol) {
        data.homepage = "http://" + data.homepage
      }
    },
    fixLicenseField: function (data) {
      if (!data.license) {
        return this.warn("missingLicense")
      } else {
        if (
          typeof data.license !== "string" ||
          data.license.length < 1 ||
          data.license.trim() === ""
        ) {
          this.warn("invalidLicense")
        } else {
          if (!validateLicense(data.license).validForNewPackages)
            this.warn("invalidLicense")
        }
      }
    },
  })
  function isValidScopedPackageName(spec) {
    if (spec.charAt(0) !== "@") return false
    var rest = spec.slice(1).split("/")
    if (rest.length !== 2) return false
    return (
      rest[0] &&
      rest[1] &&
      rest[0] === encodeURIComponent(rest[0]) &&
      rest[1] === encodeURIComponent(rest[1])
    )
  }
  function isCorrectlyEncodedName(spec) {
    return !spec.match(/[\/@\s\+%:]/) && spec === encodeURIComponent(spec)
  }
  function ensureValidName(name, strict, allowLegacyCase) {
    if (
      name.charAt(0) === "." ||
      !(isValidScopedPackageName(name) || isCorrectlyEncodedName(name)) ||
      (strict && !allowLegacyCase && name !== name.toLowerCase()) ||
      name.toLowerCase() === "node_modules" ||
      name.toLowerCase() === "favicon.ico"
    ) {
      throw new Error("Invalid name: " + JSON.stringify(name))
    }
  }
  function modifyPeople(data, fn) {
    if (data.author) data.author = fn(data.author)
    ;["maintainers", "contributors"].forEach(function (set) {
      if (!Array.isArray(data[set])) return
      data[set] = data[set].map(fn)
    })
    return data
  }
  function unParsePerson(person) {
    if (typeof person === "string") return person
    var name = person.name || ""
    var u = person.url || person.web
    var url2 = u ? " (" + u + ")" : ""
    var e = person.email || person.mail
    var email = e ? " <" + e + ">" : ""
    return name + email + url2
  }
  function parsePerson(person) {
    if (typeof person !== "string") return person
    var name = person.match(/^([^\(<]+)/)
    var url2 = person.match(/\(([^\)]+)\)/)
    var email = person.match(/<([^>]+)>/)
    var obj = {}
    if (name && name[0].trim()) obj.name = name[0].trim()
    if (email) obj.email = email[1]
    if (url2) obj.url = url2[1]
    return obj
  }
  function addOptionalDepsToDeps(data, warn) {
    var o = data.optionalDependencies
    if (!o) return
    var d = data.dependencies || {}
    Object.keys(o).forEach(function (k) {
      d[k] = o[k]
    })
    data.dependencies = d
  }
  function depObjectify(deps, type, warn) {
    if (!deps) return {}
    if (typeof deps === "string") {
      deps = deps.trim().split(/[\n\r\s\t ,]+/)
    }
    if (!Array.isArray(deps)) return deps
    warn("deprecatedArrayDependencies", type)
    var o = {}
    deps
      .filter(function (d) {
        return typeof d === "string"
      })
      .forEach(function (d) {
        d = d.trim().split(/(:?[@\s><=])/)
        var dn = d.shift()
        var dv = d.join("")
        dv = dv.trim()
        dv = dv.replace(/^@/, "")
        o[dn] = dv
      })
    return o
  }
  function objectifyDeps(data, warn) {
    depTypes.forEach(function (type) {
      if (!data[type]) return
      data[type] = depObjectify(data[type], type, warn)
    })
  }
  function bugsTypos(bugs, warn) {
    if (!bugs) return
    Object.keys(bugs).forEach(function (k) {
      if (typos.bugs[k]) {
        warn("typo", k, typos.bugs[k], "bugs")
        bugs[typos.bugs[k]] = bugs[k]
        delete bugs[k]
      }
    })
  }
})

// node_modules/normalize-package-data/lib/warning_messages.json
var require_warning_messages = __commonJS((exports, module) => {
  module.exports = {
    repositories:
      "'repositories' (plural) Not supported. Please pick one as the 'repository' field",
    missingRepository: "No repository field.",
    brokenGitUrl: "Probably broken git url: %s",
    nonObjectScripts: "scripts must be an object",
    nonStringScript: "script values must be string commands",
    nonArrayFiles: "Invalid 'files' member",
    invalidFilename: "Invalid filename in 'files' list: %s",
    nonArrayBundleDependencies:
      "Invalid 'bundleDependencies' list. Must be array of package names",
    nonStringBundleDependency: "Invalid bundleDependencies member: %s",
    nonDependencyBundleDependency: "Non-dependency in bundleDependencies: %s",
    nonObjectDependencies: "%s field must be an object",
    nonStringDependency: "Invalid dependency: %s %s",
    deprecatedArrayDependencies: "specifying %s as array is deprecated",
    deprecatedModules: "modules field is deprecated",
    nonArrayKeywords: "keywords should be an array of strings",
    nonStringKeyword: "keywords should be an array of strings",
    conflictingName: "%s is also the name of a node core module.",
    nonStringDescription: "'description' field should be a string",
    missingDescription: "No description",
    missingReadme: "No README data",
    missingLicense: "No license field.",
    nonEmailUrlBugsString:
      "Bug string field must be url, email, or {email,url}",
    nonUrlBugsUrlField: "bugs.url field must be a string url. Deleted.",
    nonEmailBugsEmailField: "bugs.email field must be a string email. Deleted.",
    emptyNormalizedBugs:
      "Normalized value of bugs field is an empty object. Deleted.",
    nonUrlHomepage: "homepage field must be a string url. Deleted.",
    invalidLicense: "license should be a valid SPDX license expression",
    typo: "%s should probably be %s.",
  }
})

// node_modules/normalize-package-data/lib/make_warning.js
var require_make_warning = __commonJS((exports, module) => {
  var util = require("util")
  var messages = require_warning_messages()
  module.exports = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    var warningName = args.shift()
    if (warningName == "typo") {
      return makeTypoWarning.apply(null, args)
    } else {
      var msgTemplate = messages[warningName]
        ? messages[warningName]
        : warningName + ": '%s'"
      args.unshift(msgTemplate)
      return util.format.apply(null, args)
    }
  }
  function makeTypoWarning(providedName, probableName, field) {
    if (field) {
      providedName = field + "['" + providedName + "']"
      probableName = field + "['" + probableName + "']"
    }
    return util.format(messages.typo, providedName, probableName)
  }
})

// node_modules/normalize-package-data/lib/normalize.js
var require_normalize = __commonJS((exports, module) => {
  module.exports = normalize
  var fixer = require_fixer()
  normalize.fixer = fixer
  var makeWarning = require_make_warning()
  var fieldsToFix = [
    "name",
    "version",
    "description",
    "repository",
    "modules",
    "scripts",
    "files",
    "bin",
    "man",
    "bugs",
    "keywords",
    "readme",
    "homepage",
    "license",
  ]
  var otherThingsToFix = ["dependencies", "people", "typos"]
  var thingsToFix = fieldsToFix.map(function (fieldName) {
    return ucFirst(fieldName) + "Field"
  })
  thingsToFix = thingsToFix.concat(otherThingsToFix)
  function normalize(data, warn, strict) {
    if (warn === true) (warn = null), (strict = true)
    if (!strict) strict = false
    if (!warn || data.private) warn = function (msg) {}
    if (
      data.scripts &&
      data.scripts.install === "node-gyp rebuild" &&
      !data.scripts.preinstall
    ) {
      data.gypfile = true
    }
    fixer.warn = function () {
      warn(makeWarning.apply(null, arguments))
    }
    thingsToFix.forEach(function (thingName) {
      fixer["fix" + ucFirst(thingName)](data, strict)
    })
    data._id = data.name + "@" + data.version
  }
  function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
})

// node_modules/read-pkg-up/node_modules/read-pkg/index.js
var require_read_pkg = __commonJS((exports, module) => {
  "use strict"
  var { promisify } = require("util")
  var fs = require("fs")
  var path = require("path")
  var parseJson = require_parse_json()
  var readFileAsync = promisify(fs.readFile)
  module.exports = async (options) => {
    options = {
      cwd: process.cwd(),
      normalize: true,
      ...options,
    }
    const filePath = path.resolve(options.cwd, "package.json")
    const json = parseJson(await readFileAsync(filePath, "utf8"))
    if (options.normalize) {
      require_normalize()(json)
    }
    return json
  }
  module.exports.sync = (options) => {
    options = {
      cwd: process.cwd(),
      normalize: true,
      ...options,
    }
    const filePath = path.resolve(options.cwd, "package.json")
    const json = parseJson(fs.readFileSync(filePath, "utf8"))
    if (options.normalize) {
      require_normalize()(json)
    }
    return json
  }
})

// node_modules/read-pkg-up/index.js
var require_read_pkg_up = __commonJS((exports, module) => {
  "use strict"
  var path = require("path")
  var findUp = require_find_up()
  var readPkg = require_read_pkg()
  module.exports = async (options) => {
    const filePath = await findUp("package.json", options)
    if (!filePath) {
      return
    }
    return {
      packageJson: await readPkg({ ...options, cwd: path.dirname(filePath) }),
      path: filePath,
    }
  }
  module.exports.sync = (options) => {
    const filePath = findUp.sync("package.json", options)
    if (!filePath) {
      return
    }
    return {
      packageJson: readPkg.sync({ ...options, cwd: path.dirname(filePath) }),
      path: filePath,
    }
  }
})

// node_modules/hard-rejection/index.js
var require_hard_rejection = __commonJS((exports, module) => {
  "use strict"
  var util = require("util")
  var installed = false
  var hardRejection = (log = console.error) => {
    if (installed) {
      return
    }
    installed = true
    process.on("unhandledRejection", (error) => {
      if (!(error instanceof Error)) {
        error = new Error(`Promise rejected with value: ${util.inspect(error)}`)
      }
      console.log(error.stack)
      process.exit(1)
    })
  }
  module.exports = hardRejection
  module.exports.default = hardRejection
})

// node_modules/meow/node_modules/semver/internal/constants.js
var require_constants = __commonJS((exports, module) => {
  var SEMVER_SPEC_VERSION = "2.0.0"
  var MAX_LENGTH = 256
  var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991
  var MAX_SAFE_COMPONENT_LENGTH = 16
  module.exports = {
    SEMVER_SPEC_VERSION,
    MAX_LENGTH,
    MAX_SAFE_INTEGER,
    MAX_SAFE_COMPONENT_LENGTH,
  }
})

// node_modules/meow/node_modules/semver/internal/debug.js
var require_debug = __commonJS((exports, module) => {
  var debug =
    typeof process === "object" &&
    process.env &&
    process.env.NODE_DEBUG &&
    /\bsemver\b/i.test(process.env.NODE_DEBUG)
      ? (...args) => console.error("SEMVER", ...args)
      : () => {}
  module.exports = debug
})

// node_modules/meow/node_modules/semver/internal/re.js
var require_re = __commonJS((exports, module) => {
  var { MAX_SAFE_COMPONENT_LENGTH } = require_constants()
  var debug = require_debug()
  exports = module.exports = {}
  var re = (exports.re = [])
  var src = (exports.src = [])
  var t = (exports.t = {})
  var R = 0
  var createToken = (name, value, isGlobal) => {
    const index = R++
    debug(index, value)
    t[name] = index
    src[index] = value
    re[index] = new RegExp(value, isGlobal ? "g" : void 0)
  }
  createToken("NUMERICIDENTIFIER", "0|[1-9]\\d*")
  createToken("NUMERICIDENTIFIERLOOSE", "[0-9]+")
  createToken("NONNUMERICIDENTIFIER", "\\d*[a-zA-Z-][a-zA-Z0-9-]*")
  createToken(
    "MAINVERSION",
    `(${src[t.NUMERICIDENTIFIER]})\\.(${src[t.NUMERICIDENTIFIER]})\\.(${
      src[t.NUMERICIDENTIFIER]
    })`,
  )
  createToken(
    "MAINVERSIONLOOSE",
    `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.(${
      src[t.NUMERICIDENTIFIERLOOSE]
    })\\.(${src[t.NUMERICIDENTIFIERLOOSE]})`,
  )
  createToken(
    "PRERELEASEIDENTIFIER",
    `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`,
  )
  createToken(
    "PRERELEASEIDENTIFIERLOOSE",
    `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`,
  )
  createToken(
    "PRERELEASE",
    `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${
      src[t.PRERELEASEIDENTIFIER]
    })*))`,
  )
  createToken(
    "PRERELEASELOOSE",
    `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${
      src[t.PRERELEASEIDENTIFIERLOOSE]
    })*))`,
  )
  createToken("BUILDIDENTIFIER", "[0-9A-Za-z-]+")
  createToken(
    "BUILD",
    `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`,
  )
  createToken(
    "FULLPLAIN",
    `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`,
  )
  createToken("FULL", `^${src[t.FULLPLAIN]}$`)
  createToken(
    "LOOSEPLAIN",
    `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${
      src[t.BUILD]
    }?`,
  )
  createToken("LOOSE", `^${src[t.LOOSEPLAIN]}$`)
  createToken("GTLT", "((?:<|>)?=?)")
  createToken(
    "XRANGEIDENTIFIERLOOSE",
    `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`,
  )
  createToken("XRANGEIDENTIFIER", `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`)
  createToken(
    "XRANGEPLAIN",
    `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})(?:\\.(${
      src[t.XRANGEIDENTIFIER]
    })(?:\\.(${src[t.XRANGEIDENTIFIER]})(?:${src[t.PRERELEASE]})?${
      src[t.BUILD]
    }?)?)?`,
  )
  createToken(
    "XRANGEPLAINLOOSE",
    `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})(?:\\.(${
      src[t.XRANGEIDENTIFIERLOOSE]
    })(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})(?:${src[t.PRERELEASELOOSE]})?${
      src[t.BUILD]
    }?)?)?`,
  )
  createToken("XRANGE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`)
  createToken("XRANGELOOSE", `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`)
  createToken(
    "COERCE",
    `${"(^|[^\\d])(\\d{1,"}${MAX_SAFE_COMPONENT_LENGTH}})(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?(?:$|[^\\d])`,
  )
  createToken("COERCERTL", src[t.COERCE], true)
  createToken("LONETILDE", "(?:~>?)")
  createToken("TILDETRIM", `(\\s*)${src[t.LONETILDE]}\\s+`, true)
  exports.tildeTrimReplace = "$1~"
  createToken("TILDE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`)
  createToken("TILDELOOSE", `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`)
  createToken("LONECARET", "(?:\\^)")
  createToken("CARETTRIM", `(\\s*)${src[t.LONECARET]}\\s+`, true)
  exports.caretTrimReplace = "$1^"
  createToken("CARET", `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`)
  createToken("CARETLOOSE", `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`)
  createToken(
    "COMPARATORLOOSE",
    `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`,
  )
  createToken("COMPARATOR", `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`)
  createToken(
    "COMPARATORTRIM",
    `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`,
    true,
  )
  exports.comparatorTrimReplace = "$1$2$3"
  createToken(
    "HYPHENRANGE",
    `^\\s*(${src[t.XRANGEPLAIN]})\\s+-\\s+(${src[t.XRANGEPLAIN]})\\s*$`,
  )
  createToken(
    "HYPHENRANGELOOSE",
    `^\\s*(${src[t.XRANGEPLAINLOOSE]})\\s+-\\s+(${
      src[t.XRANGEPLAINLOOSE]
    })\\s*$`,
  )
  createToken("STAR", "(<|>)?=?\\s*\\*")
  createToken("GTE0", "^\\s*>=\\s*0.0.0\\s*$")
  createToken("GTE0PRE", "^\\s*>=\\s*0.0.0-0\\s*$")
})

// node_modules/meow/node_modules/semver/internal/parse-options.js
var require_parse_options = __commonJS((exports, module) => {
  var opts = ["includePrerelease", "loose", "rtl"]
  var parseOptions = (options) =>
    !options
      ? {}
      : typeof options !== "object"
      ? { loose: true }
      : opts
          .filter((k) => options[k])
          .reduce((options2, k) => {
            options2[k] = true
            return options2
          }, {})
  module.exports = parseOptions
})

// node_modules/meow/node_modules/semver/internal/identifiers.js
var require_identifiers = __commonJS((exports, module) => {
  var numeric = /^[0-9]+$/
  var compareIdentifiers = (a, b) => {
    const anum = numeric.test(a)
    const bnum = numeric.test(b)
    if (anum && bnum) {
      a = +a
      b = +b
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1
  }
  var rcompareIdentifiers = (a, b) => compareIdentifiers(b, a)
  module.exports = {
    compareIdentifiers,
    rcompareIdentifiers,
  }
})

// node_modules/meow/node_modules/semver/classes/semver.js
var require_semver2 = __commonJS((exports, module) => {
  var debug = require_debug()
  var { MAX_LENGTH, MAX_SAFE_INTEGER } = require_constants()
  var { re, t } = require_re()
  var parseOptions = require_parse_options()
  var { compareIdentifiers } = require_identifiers()
  var SemVer = class {
    constructor(version, options) {
      options = parseOptions(options)
      if (version instanceof SemVer) {
        if (
          version.loose === !!options.loose &&
          version.includePrerelease === !!options.includePrerelease
        ) {
          return version
        } else {
          version = version.version
        }
      } else if (typeof version !== "string") {
        throw new TypeError(`Invalid Version: ${version}`)
      }
      if (version.length > MAX_LENGTH) {
        throw new TypeError(`version is longer than ${MAX_LENGTH} characters`)
      }
      debug("SemVer", version, options)
      this.options = options
      this.loose = !!options.loose
      this.includePrerelease = !!options.includePrerelease
      const m = version.trim().match(options.loose ? re[t.LOOSE] : re[t.FULL])
      if (!m) {
        throw new TypeError(`Invalid Version: ${version}`)
      }
      this.raw = version
      this.major = +m[1]
      this.minor = +m[2]
      this.patch = +m[3]
      if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
        throw new TypeError("Invalid major version")
      }
      if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
        throw new TypeError("Invalid minor version")
      }
      if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
        throw new TypeError("Invalid patch version")
      }
      if (!m[4]) {
        this.prerelease = []
      } else {
        this.prerelease = m[4].split(".").map((id) => {
          if (/^[0-9]+$/.test(id)) {
            const num = +id
            if (num >= 0 && num < MAX_SAFE_INTEGER) {
              return num
            }
          }
          return id
        })
      }
      this.build = m[5] ? m[5].split(".") : []
      this.format()
    }
    format() {
      this.version = `${this.major}.${this.minor}.${this.patch}`
      if (this.prerelease.length) {
        this.version += `-${this.prerelease.join(".")}`
      }
      return this.version
    }
    toString() {
      return this.version
    }
    compare(other) {
      debug("SemVer.compare", this.version, this.options, other)
      if (!(other instanceof SemVer)) {
        if (typeof other === "string" && other === this.version) {
          return 0
        }
        other = new SemVer(other, this.options)
      }
      if (other.version === this.version) {
        return 0
      }
      return this.compareMain(other) || this.comparePre(other)
    }
    compareMain(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options)
      }
      return (
        compareIdentifiers(this.major, other.major) ||
        compareIdentifiers(this.minor, other.minor) ||
        compareIdentifiers(this.patch, other.patch)
      )
    }
    comparePre(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options)
      }
      if (this.prerelease.length && !other.prerelease.length) {
        return -1
      } else if (!this.prerelease.length && other.prerelease.length) {
        return 1
      } else if (!this.prerelease.length && !other.prerelease.length) {
        return 0
      }
      let i = 0
      do {
        const a = this.prerelease[i]
        const b = other.prerelease[i]
        debug("prerelease compare", i, a, b)
        if (a === void 0 && b === void 0) {
          return 0
        } else if (b === void 0) {
          return 1
        } else if (a === void 0) {
          return -1
        } else if (a === b) {
          continue
        } else {
          return compareIdentifiers(a, b)
        }
      } while (++i)
    }
    compareBuild(other) {
      if (!(other instanceof SemVer)) {
        other = new SemVer(other, this.options)
      }
      let i = 0
      do {
        const a = this.build[i]
        const b = other.build[i]
        debug("prerelease compare", i, a, b)
        if (a === void 0 && b === void 0) {
          return 0
        } else if (b === void 0) {
          return 1
        } else if (a === void 0) {
          return -1
        } else if (a === b) {
          continue
        } else {
          return compareIdentifiers(a, b)
        }
      } while (++i)
    }
    inc(release, identifier) {
      switch (release) {
        case "premajor":
          this.prerelease.length = 0
          this.patch = 0
          this.minor = 0
          this.major++
          this.inc("pre", identifier)
          break
        case "preminor":
          this.prerelease.length = 0
          this.patch = 0
          this.minor++
          this.inc("pre", identifier)
          break
        case "prepatch":
          this.prerelease.length = 0
          this.inc("patch", identifier)
          this.inc("pre", identifier)
          break
        case "prerelease":
          if (this.prerelease.length === 0) {
            this.inc("patch", identifier)
          }
          this.inc("pre", identifier)
          break
        case "major":
          if (
            this.minor !== 0 ||
            this.patch !== 0 ||
            this.prerelease.length === 0
          ) {
            this.major++
          }
          this.minor = 0
          this.patch = 0
          this.prerelease = []
          break
        case "minor":
          if (this.patch !== 0 || this.prerelease.length === 0) {
            this.minor++
          }
          this.patch = 0
          this.prerelease = []
          break
        case "patch":
          if (this.prerelease.length === 0) {
            this.patch++
          }
          this.prerelease = []
          break
        case "pre":
          if (this.prerelease.length === 0) {
            this.prerelease = [0]
          } else {
            let i = this.prerelease.length
            while (--i >= 0) {
              if (typeof this.prerelease[i] === "number") {
                this.prerelease[i]++
                i = -2
              }
            }
            if (i === -1) {
              this.prerelease.push(0)
            }
          }
          if (identifier) {
            if (this.prerelease[0] === identifier) {
              if (isNaN(this.prerelease[1])) {
                this.prerelease = [identifier, 0]
              }
            } else {
              this.prerelease = [identifier, 0]
            }
          }
          break
        default:
          throw new Error(`invalid increment argument: ${release}`)
      }
      this.format()
      this.raw = this.version
      return this
    }
  }
  module.exports = SemVer
})

// node_modules/meow/node_modules/semver/functions/parse.js
var require_parse2 = __commonJS((exports, module) => {
  var { MAX_LENGTH } = require_constants()
  var { re, t } = require_re()
  var SemVer = require_semver2()
  var parseOptions = require_parse_options()
  var parse = (version, options) => {
    options = parseOptions(options)
    if (version instanceof SemVer) {
      return version
    }
    if (typeof version !== "string") {
      return null
    }
    if (version.length > MAX_LENGTH) {
      return null
    }
    const r = options.loose ? re[t.LOOSE] : re[t.FULL]
    if (!r.test(version)) {
      return null
    }
    try {
      return new SemVer(version, options)
    } catch (er) {
      return null
    }
  }
  module.exports = parse
})

// node_modules/meow/node_modules/semver/functions/valid.js
var require_valid = __commonJS((exports, module) => {
  var parse = require_parse2()
  var valid = (version, options) => {
    const v = parse(version, options)
    return v ? v.version : null
  }
  module.exports = valid
})

// node_modules/meow/node_modules/semver/functions/clean.js
var require_clean = __commonJS((exports, module) => {
  var parse = require_parse2()
  var clean = (version, options) => {
    const s = parse(version.trim().replace(/^[=v]+/, ""), options)
    return s ? s.version : null
  }
  module.exports = clean
})

// node_modules/meow/node_modules/semver/functions/inc.js
var require_inc = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var inc = (version, release, options, identifier) => {
    if (typeof options === "string") {
      identifier = options
      options = void 0
    }
    try {
      return new SemVer(version, options).inc(release, identifier).version
    } catch (er) {
      return null
    }
  }
  module.exports = inc
})

// node_modules/meow/node_modules/semver/functions/compare.js
var require_compare = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var compare = (a, b, loose) =>
    new SemVer(a, loose).compare(new SemVer(b, loose))
  module.exports = compare
})

// node_modules/meow/node_modules/semver/functions/eq.js
var require_eq = __commonJS((exports, module) => {
  var compare = require_compare()
  var eq = (a, b, loose) => compare(a, b, loose) === 0
  module.exports = eq
})

// node_modules/meow/node_modules/semver/functions/diff.js
var require_diff = __commonJS((exports, module) => {
  var parse = require_parse2()
  var eq = require_eq()
  var diff = (version1, version2) => {
    if (eq(version1, version2)) {
      return null
    } else {
      const v1 = parse(version1)
      const v2 = parse(version2)
      const hasPre = v1.prerelease.length || v2.prerelease.length
      const prefix = hasPre ? "pre" : ""
      const defaultResult = hasPre ? "prerelease" : ""
      for (const key in v1) {
        if (key === "major" || key === "minor" || key === "patch") {
          if (v1[key] !== v2[key]) {
            return prefix + key
          }
        }
      }
      return defaultResult
    }
  }
  module.exports = diff
})

// node_modules/meow/node_modules/semver/functions/major.js
var require_major = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var major = (a, loose) => new SemVer(a, loose).major
  module.exports = major
})

// node_modules/meow/node_modules/semver/functions/minor.js
var require_minor = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var minor = (a, loose) => new SemVer(a, loose).minor
  module.exports = minor
})

// node_modules/meow/node_modules/semver/functions/patch.js
var require_patch = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var patch = (a, loose) => new SemVer(a, loose).patch
  module.exports = patch
})

// node_modules/meow/node_modules/semver/functions/prerelease.js
var require_prerelease = __commonJS((exports, module) => {
  var parse = require_parse2()
  var prerelease = (version, options) => {
    const parsed = parse(version, options)
    return parsed && parsed.prerelease.length ? parsed.prerelease : null
  }
  module.exports = prerelease
})

// node_modules/meow/node_modules/semver/functions/rcompare.js
var require_rcompare = __commonJS((exports, module) => {
  var compare = require_compare()
  var rcompare = (a, b, loose) => compare(b, a, loose)
  module.exports = rcompare
})

// node_modules/meow/node_modules/semver/functions/compare-loose.js
var require_compare_loose = __commonJS((exports, module) => {
  var compare = require_compare()
  var compareLoose = (a, b) => compare(a, b, true)
  module.exports = compareLoose
})

// node_modules/meow/node_modules/semver/functions/compare-build.js
var require_compare_build = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var compareBuild = (a, b, loose) => {
    const versionA = new SemVer(a, loose)
    const versionB = new SemVer(b, loose)
    return versionA.compare(versionB) || versionA.compareBuild(versionB)
  }
  module.exports = compareBuild
})

// node_modules/meow/node_modules/semver/functions/sort.js
var require_sort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build()
  var sort = (list, loose) => list.sort((a, b) => compareBuild(a, b, loose))
  module.exports = sort
})

// node_modules/meow/node_modules/semver/functions/rsort.js
var require_rsort = __commonJS((exports, module) => {
  var compareBuild = require_compare_build()
  var rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose))
  module.exports = rsort
})

// node_modules/meow/node_modules/semver/functions/gt.js
var require_gt = __commonJS((exports, module) => {
  var compare = require_compare()
  var gt = (a, b, loose) => compare(a, b, loose) > 0
  module.exports = gt
})

// node_modules/meow/node_modules/semver/functions/lt.js
var require_lt = __commonJS((exports, module) => {
  var compare = require_compare()
  var lt = (a, b, loose) => compare(a, b, loose) < 0
  module.exports = lt
})

// node_modules/meow/node_modules/semver/functions/neq.js
var require_neq = __commonJS((exports, module) => {
  var compare = require_compare()
  var neq = (a, b, loose) => compare(a, b, loose) !== 0
  module.exports = neq
})

// node_modules/meow/node_modules/semver/functions/gte.js
var require_gte = __commonJS((exports, module) => {
  var compare = require_compare()
  var gte = (a, b, loose) => compare(a, b, loose) >= 0
  module.exports = gte
})

// node_modules/meow/node_modules/semver/functions/lte.js
var require_lte = __commonJS((exports, module) => {
  var compare = require_compare()
  var lte = (a, b, loose) => compare(a, b, loose) <= 0
  module.exports = lte
})

// node_modules/meow/node_modules/semver/functions/cmp.js
var require_cmp = __commonJS((exports, module) => {
  var eq = require_eq()
  var neq = require_neq()
  var gt = require_gt()
  var gte = require_gte()
  var lt = require_lt()
  var lte = require_lte()
  var cmp = (a, op, b, loose) => {
    switch (op) {
      case "===":
        if (typeof a === "object") a = a.version
        if (typeof b === "object") b = b.version
        return a === b
      case "!==":
        if (typeof a === "object") a = a.version
        if (typeof b === "object") b = b.version
        return a !== b
      case "":
      case "=":
      case "==":
        return eq(a, b, loose)
      case "!=":
        return neq(a, b, loose)
      case ">":
        return gt(a, b, loose)
      case ">=":
        return gte(a, b, loose)
      case "<":
        return lt(a, b, loose)
      case "<=":
        return lte(a, b, loose)
      default:
        throw new TypeError(`Invalid operator: ${op}`)
    }
  }
  module.exports = cmp
})

// node_modules/meow/node_modules/semver/functions/coerce.js
var require_coerce = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var parse = require_parse2()
  var { re, t } = require_re()
  var coerce = (version, options) => {
    if (version instanceof SemVer) {
      return version
    }
    if (typeof version === "number") {
      version = String(version)
    }
    if (typeof version !== "string") {
      return null
    }
    options = options || {}
    let match = null
    if (!options.rtl) {
      match = version.match(re[t.COERCE])
    } else {
      let next
      while (
        (next = re[t.COERCERTL].exec(version)) &&
        (!match || match.index + match[0].length !== version.length)
      ) {
        if (
          !match ||
          next.index + next[0].length !== match.index + match[0].length
        ) {
          match = next
        }
        re[t.COERCERTL].lastIndex = next.index + next[1].length + next[2].length
      }
      re[t.COERCERTL].lastIndex = -1
    }
    if (match === null) return null
    return parse(`${match[2]}.${match[3] || "0"}.${match[4] || "0"}`, options)
  }
  module.exports = coerce
})

// node_modules/meow/node_modules/yallist/iterator.js
var require_iterator = __commonJS((exports, module) => {
  "use strict"
  module.exports = function (Yallist) {
    Yallist.prototype[Symbol.iterator] = function* () {
      for (let walker = this.head; walker; walker = walker.next) {
        yield walker.value
      }
    }
  }
})

// node_modules/meow/node_modules/yallist/yallist.js
var require_yallist = __commonJS((exports, module) => {
  "use strict"
  module.exports = Yallist
  Yallist.Node = Node
  Yallist.create = Yallist
  function Yallist(list) {
    var self = this
    if (!(self instanceof Yallist)) {
      self = new Yallist()
    }
    self.tail = null
    self.head = null
    self.length = 0
    if (list && typeof list.forEach === "function") {
      list.forEach(function (item) {
        self.push(item)
      })
    } else if (arguments.length > 0) {
      for (var i = 0, l = arguments.length; i < l; i++) {
        self.push(arguments[i])
      }
    }
    return self
  }
  Yallist.prototype.removeNode = function (node) {
    if (node.list !== this) {
      throw new Error("removing node which does not belong to this list")
    }
    var next = node.next
    var prev = node.prev
    if (next) {
      next.prev = prev
    }
    if (prev) {
      prev.next = next
    }
    if (node === this.head) {
      this.head = next
    }
    if (node === this.tail) {
      this.tail = prev
    }
    node.list.length--
    node.next = null
    node.prev = null
    node.list = null
    return next
  }
  Yallist.prototype.unshiftNode = function (node) {
    if (node === this.head) {
      return
    }
    if (node.list) {
      node.list.removeNode(node)
    }
    var head = this.head
    node.list = this
    node.next = head
    if (head) {
      head.prev = node
    }
    this.head = node
    if (!this.tail) {
      this.tail = node
    }
    this.length++
  }
  Yallist.prototype.pushNode = function (node) {
    if (node === this.tail) {
      return
    }
    if (node.list) {
      node.list.removeNode(node)
    }
    var tail = this.tail
    node.list = this
    node.prev = tail
    if (tail) {
      tail.next = node
    }
    this.tail = node
    if (!this.head) {
      this.head = node
    }
    this.length++
  }
  Yallist.prototype.push = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      push(this, arguments[i])
    }
    return this.length
  }
  Yallist.prototype.unshift = function () {
    for (var i = 0, l = arguments.length; i < l; i++) {
      unshift(this, arguments[i])
    }
    return this.length
  }
  Yallist.prototype.pop = function () {
    if (!this.tail) {
      return void 0
    }
    var res = this.tail.value
    this.tail = this.tail.prev
    if (this.tail) {
      this.tail.next = null
    } else {
      this.head = null
    }
    this.length--
    return res
  }
  Yallist.prototype.shift = function () {
    if (!this.head) {
      return void 0
    }
    var res = this.head.value
    this.head = this.head.next
    if (this.head) {
      this.head.prev = null
    } else {
      this.tail = null
    }
    this.length--
    return res
  }
  Yallist.prototype.forEach = function (fn, thisp) {
    thisp = thisp || this
    for (var walker = this.head, i = 0; walker !== null; i++) {
      fn.call(thisp, walker.value, i, this)
      walker = walker.next
    }
  }
  Yallist.prototype.forEachReverse = function (fn, thisp) {
    thisp = thisp || this
    for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
      fn.call(thisp, walker.value, i, this)
      walker = walker.prev
    }
  }
  Yallist.prototype.get = function (n) {
    for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
      walker = walker.next
    }
    if (i === n && walker !== null) {
      return walker.value
    }
  }
  Yallist.prototype.getReverse = function (n) {
    for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
      walker = walker.prev
    }
    if (i === n && walker !== null) {
      return walker.value
    }
  }
  Yallist.prototype.map = function (fn, thisp) {
    thisp = thisp || this
    var res = new Yallist()
    for (var walker = this.head; walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this))
      walker = walker.next
    }
    return res
  }
  Yallist.prototype.mapReverse = function (fn, thisp) {
    thisp = thisp || this
    var res = new Yallist()
    for (var walker = this.tail; walker !== null; ) {
      res.push(fn.call(thisp, walker.value, this))
      walker = walker.prev
    }
    return res
  }
  Yallist.prototype.reduce = function (fn, initial) {
    var acc
    var walker = this.head
    if (arguments.length > 1) {
      acc = initial
    } else if (this.head) {
      walker = this.head.next
      acc = this.head.value
    } else {
      throw new TypeError("Reduce of empty list with no initial value")
    }
    for (var i = 0; walker !== null; i++) {
      acc = fn(acc, walker.value, i)
      walker = walker.next
    }
    return acc
  }
  Yallist.prototype.reduceReverse = function (fn, initial) {
    var acc
    var walker = this.tail
    if (arguments.length > 1) {
      acc = initial
    } else if (this.tail) {
      walker = this.tail.prev
      acc = this.tail.value
    } else {
      throw new TypeError("Reduce of empty list with no initial value")
    }
    for (var i = this.length - 1; walker !== null; i--) {
      acc = fn(acc, walker.value, i)
      walker = walker.prev
    }
    return acc
  }
  Yallist.prototype.toArray = function () {
    var arr = new Array(this.length)
    for (var i = 0, walker = this.head; walker !== null; i++) {
      arr[i] = walker.value
      walker = walker.next
    }
    return arr
  }
  Yallist.prototype.toArrayReverse = function () {
    var arr = new Array(this.length)
    for (var i = 0, walker = this.tail; walker !== null; i++) {
      arr[i] = walker.value
      walker = walker.prev
    }
    return arr
  }
  Yallist.prototype.slice = function (from, to) {
    to = to || this.length
    if (to < 0) {
      to += this.length
    }
    from = from || 0
    if (from < 0) {
      from += this.length
    }
    var ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this.length) {
      to = this.length
    }
    for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
      walker = walker.next
    }
    for (; walker !== null && i < to; i++, walker = walker.next) {
      ret.push(walker.value)
    }
    return ret
  }
  Yallist.prototype.sliceReverse = function (from, to) {
    to = to || this.length
    if (to < 0) {
      to += this.length
    }
    from = from || 0
    if (from < 0) {
      from += this.length
    }
    var ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this.length) {
      to = this.length
    }
    for (
      var i = this.length, walker = this.tail;
      walker !== null && i > to;
      i--
    ) {
      walker = walker.prev
    }
    for (; walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value)
    }
    return ret
  }
  Yallist.prototype.splice = function (start, deleteCount, ...nodes) {
    if (start > this.length) {
      start = this.length - 1
    }
    if (start < 0) {
      start = this.length + start
    }
    for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
      walker = walker.next
    }
    var ret = []
    for (var i = 0; walker && i < deleteCount; i++) {
      ret.push(walker.value)
      walker = this.removeNode(walker)
    }
    if (walker === null) {
      walker = this.tail
    }
    if (walker !== this.head && walker !== this.tail) {
      walker = walker.prev
    }
    for (var i = 0; i < nodes.length; i++) {
      walker = insert(this, walker, nodes[i])
    }
    return ret
  }
  Yallist.prototype.reverse = function () {
    var head = this.head
    var tail = this.tail
    for (var walker = head; walker !== null; walker = walker.prev) {
      var p = walker.prev
      walker.prev = walker.next
      walker.next = p
    }
    this.head = tail
    this.tail = head
    return this
  }
  function insert(self, node, value) {
    var inserted =
      node === self.head
        ? new Node(value, null, node, self)
        : new Node(value, node, node.next, self)
    if (inserted.next === null) {
      self.tail = inserted
    }
    if (inserted.prev === null) {
      self.head = inserted
    }
    self.length++
    return inserted
  }
  function push(self, item) {
    self.tail = new Node(item, self.tail, null, self)
    if (!self.head) {
      self.head = self.tail
    }
    self.length++
  }
  function unshift(self, item) {
    self.head = new Node(item, null, self.head, self)
    if (!self.tail) {
      self.tail = self.head
    }
    self.length++
  }
  function Node(value, prev, next, list) {
    if (!(this instanceof Node)) {
      return new Node(value, prev, next, list)
    }
    this.list = list
    this.value = value
    if (prev) {
      prev.next = this
      this.prev = prev
    } else {
      this.prev = null
    }
    if (next) {
      next.prev = this
      this.next = next
    } else {
      this.next = null
    }
  }
  try {
    require_iterator()(Yallist)
  } catch (er) {}
})

// node_modules/meow/node_modules/lru-cache/index.js
var require_lru_cache = __commonJS((exports, module) => {
  "use strict"
  var Yallist = require_yallist()
  var MAX = Symbol("max")
  var LENGTH = Symbol("length")
  var LENGTH_CALCULATOR = Symbol("lengthCalculator")
  var ALLOW_STALE = Symbol("allowStale")
  var MAX_AGE = Symbol("maxAge")
  var DISPOSE = Symbol("dispose")
  var NO_DISPOSE_ON_SET = Symbol("noDisposeOnSet")
  var LRU_LIST = Symbol("lruList")
  var CACHE = Symbol("cache")
  var UPDATE_AGE_ON_GET = Symbol("updateAgeOnGet")
  var naiveLength = () => 1
  var LRUCache = class {
    constructor(options) {
      if (typeof options === "number") options = { max: options }
      if (!options) options = {}
      if (options.max && (typeof options.max !== "number" || options.max < 0))
        throw new TypeError("max must be a non-negative number")
      const max = (this[MAX] = options.max || Infinity)
      const lc = options.length || naiveLength
      this[LENGTH_CALCULATOR] = typeof lc !== "function" ? naiveLength : lc
      this[ALLOW_STALE] = options.stale || false
      if (options.maxAge && typeof options.maxAge !== "number")
        throw new TypeError("maxAge must be a number")
      this[MAX_AGE] = options.maxAge || 0
      this[DISPOSE] = options.dispose
      this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false
      this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false
      this.reset()
    }
    set max(mL) {
      if (typeof mL !== "number" || mL < 0)
        throw new TypeError("max must be a non-negative number")
      this[MAX] = mL || Infinity
      trim(this)
    }
    get max() {
      return this[MAX]
    }
    set allowStale(allowStale) {
      this[ALLOW_STALE] = !!allowStale
    }
    get allowStale() {
      return this[ALLOW_STALE]
    }
    set maxAge(mA) {
      if (typeof mA !== "number")
        throw new TypeError("maxAge must be a non-negative number")
      this[MAX_AGE] = mA
      trim(this)
    }
    get maxAge() {
      return this[MAX_AGE]
    }
    set lengthCalculator(lC) {
      if (typeof lC !== "function") lC = naiveLength
      if (lC !== this[LENGTH_CALCULATOR]) {
        this[LENGTH_CALCULATOR] = lC
        this[LENGTH] = 0
        this[LRU_LIST].forEach((hit) => {
          hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key)
          this[LENGTH] += hit.length
        })
      }
      trim(this)
    }
    get lengthCalculator() {
      return this[LENGTH_CALCULATOR]
    }
    get length() {
      return this[LENGTH]
    }
    get itemCount() {
      return this[LRU_LIST].length
    }
    rforEach(fn, thisp) {
      thisp = thisp || this
      for (let walker = this[LRU_LIST].tail; walker !== null; ) {
        const prev = walker.prev
        forEachStep(this, fn, walker, thisp)
        walker = prev
      }
    }
    forEach(fn, thisp) {
      thisp = thisp || this
      for (let walker = this[LRU_LIST].head; walker !== null; ) {
        const next = walker.next
        forEachStep(this, fn, walker, thisp)
        walker = next
      }
    }
    keys() {
      return this[LRU_LIST].toArray().map((k) => k.key)
    }
    values() {
      return this[LRU_LIST].toArray().map((k) => k.value)
    }
    reset() {
      if (this[DISPOSE] && this[LRU_LIST] && this[LRU_LIST].length) {
        this[LRU_LIST].forEach((hit) => this[DISPOSE](hit.key, hit.value))
      }
      this[CACHE] = new Map()
      this[LRU_LIST] = new Yallist()
      this[LENGTH] = 0
    }
    dump() {
      return this[LRU_LIST].map((hit) =>
        isStale(this, hit)
          ? false
          : {
              k: hit.key,
              v: hit.value,
              e: hit.now + (hit.maxAge || 0),
            },
      )
        .toArray()
        .filter((h) => h)
    }
    dumpLru() {
      return this[LRU_LIST]
    }
    set(key, value, maxAge) {
      maxAge = maxAge || this[MAX_AGE]
      if (maxAge && typeof maxAge !== "number")
        throw new TypeError("maxAge must be a number")
      const now = maxAge ? Date.now() : 0
      const len = this[LENGTH_CALCULATOR](value, key)
      if (this[CACHE].has(key)) {
        if (len > this[MAX]) {
          del(this, this[CACHE].get(key))
          return false
        }
        const node = this[CACHE].get(key)
        const item = node.value
        if (this[DISPOSE]) {
          if (!this[NO_DISPOSE_ON_SET]) this[DISPOSE](key, item.value)
        }
        item.now = now
        item.maxAge = maxAge
        item.value = value
        this[LENGTH] += len - item.length
        item.length = len
        this.get(key)
        trim(this)
        return true
      }
      const hit = new Entry(key, value, len, now, maxAge)
      if (hit.length > this[MAX]) {
        if (this[DISPOSE]) this[DISPOSE](key, value)
        return false
      }
      this[LENGTH] += hit.length
      this[LRU_LIST].unshift(hit)
      this[CACHE].set(key, this[LRU_LIST].head)
      trim(this)
      return true
    }
    has(key) {
      if (!this[CACHE].has(key)) return false
      const hit = this[CACHE].get(key).value
      return !isStale(this, hit)
    }
    get(key) {
      return get(this, key, true)
    }
    peek(key) {
      return get(this, key, false)
    }
    pop() {
      const node = this[LRU_LIST].tail
      if (!node) return null
      del(this, node)
      return node.value
    }
    del(key) {
      del(this, this[CACHE].get(key))
    }
    load(arr) {
      this.reset()
      const now = Date.now()
      for (let l = arr.length - 1; l >= 0; l--) {
        const hit = arr[l]
        const expiresAt = hit.e || 0
        if (expiresAt === 0) this.set(hit.k, hit.v)
        else {
          const maxAge = expiresAt - now
          if (maxAge > 0) {
            this.set(hit.k, hit.v, maxAge)
          }
        }
      }
    }
    prune() {
      this[CACHE].forEach((value, key) => get(this, key, false))
    }
  }
  var get = (self, key, doUse) => {
    const node = self[CACHE].get(key)
    if (node) {
      const hit = node.value
      if (isStale(self, hit)) {
        del(self, node)
        if (!self[ALLOW_STALE]) return void 0
      } else {
        if (doUse) {
          if (self[UPDATE_AGE_ON_GET]) node.value.now = Date.now()
          self[LRU_LIST].unshiftNode(node)
        }
      }
      return hit.value
    }
  }
  var isStale = (self, hit) => {
    if (!hit || (!hit.maxAge && !self[MAX_AGE])) return false
    const diff = Date.now() - hit.now
    return hit.maxAge
      ? diff > hit.maxAge
      : self[MAX_AGE] && diff > self[MAX_AGE]
  }
  var trim = (self) => {
    if (self[LENGTH] > self[MAX]) {
      for (
        let walker = self[LRU_LIST].tail;
        self[LENGTH] > self[MAX] && walker !== null;

      ) {
        const prev = walker.prev
        del(self, walker)
        walker = prev
      }
    }
  }
  var del = (self, node) => {
    if (node) {
      const hit = node.value
      if (self[DISPOSE]) self[DISPOSE](hit.key, hit.value)
      self[LENGTH] -= hit.length
      self[CACHE].delete(hit.key)
      self[LRU_LIST].removeNode(node)
    }
  }
  var Entry = class {
    constructor(key, value, length, now, maxAge) {
      this.key = key
      this.value = value
      this.length = length
      this.now = now
      this.maxAge = maxAge || 0
    }
  }
  var forEachStep = (self, fn, node, thisp) => {
    let hit = node.value
    if (isStale(self, hit)) {
      del(self, node)
      if (!self[ALLOW_STALE]) hit = void 0
    }
    if (hit) fn.call(thisp, hit.value, hit.key, self)
  }
  module.exports = LRUCache
})

// node_modules/meow/node_modules/semver/classes/range.js
var require_range = __commonJS((exports, module) => {
  var Range = class {
    constructor(range, options) {
      options = parseOptions(options)
      if (range instanceof Range) {
        if (
          range.loose === !!options.loose &&
          range.includePrerelease === !!options.includePrerelease
        ) {
          return range
        } else {
          return new Range(range.raw, options)
        }
      }
      if (range instanceof Comparator) {
        this.raw = range.value
        this.set = [[range]]
        this.format()
        return this
      }
      this.options = options
      this.loose = !!options.loose
      this.includePrerelease = !!options.includePrerelease
      this.raw = range
      this.set = range
        .split(/\s*\|\|\s*/)
        .map((range2) => this.parseRange(range2.trim()))
        .filter((c) => c.length)
      if (!this.set.length) {
        throw new TypeError(`Invalid SemVer Range: ${range}`)
      }
      if (this.set.length > 1) {
        const first = this.set[0]
        this.set = this.set.filter((c) => !isNullSet(c[0]))
        if (this.set.length === 0) this.set = [first]
        else if (this.set.length > 1) {
          for (const c of this.set) {
            if (c.length === 1 && isAny(c[0])) {
              this.set = [c]
              break
            }
          }
        }
      }
      this.format()
    }
    format() {
      this.range = this.set
        .map((comps) => {
          return comps.join(" ").trim()
        })
        .join("||")
        .trim()
      return this.range
    }
    toString() {
      return this.range
    }
    parseRange(range) {
      range = range.trim()
      const memoOpts = Object.keys(this.options).join(",")
      const memoKey = `parseRange:${memoOpts}:${range}`
      const cached = cache.get(memoKey)
      if (cached) return cached
      const loose = this.options.loose
      const hr = loose ? re[t.HYPHENRANGELOOSE] : re[t.HYPHENRANGE]
      range = range.replace(hr, hyphenReplace(this.options.includePrerelease))
      debug("hyphen replace", range)
      range = range.replace(re[t.COMPARATORTRIM], comparatorTrimReplace)
      debug("comparator trim", range, re[t.COMPARATORTRIM])
      range = range.replace(re[t.TILDETRIM], tildeTrimReplace)
      range = range.replace(re[t.CARETTRIM], caretTrimReplace)
      range = range.split(/\s+/).join(" ")
      const compRe = loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
      const rangeList = range
        .split(" ")
        .map((comp) => parseComparator(comp, this.options))
        .join(" ")
        .split(/\s+/)
        .map((comp) => replaceGTE0(comp, this.options))
        .filter(
          this.options.loose ? (comp) => !!comp.match(compRe) : () => true,
        )
        .map((comp) => new Comparator(comp, this.options))
      const l = rangeList.length
      const rangeMap = new Map()
      for (const comp of rangeList) {
        if (isNullSet(comp)) return [comp]
        rangeMap.set(comp.value, comp)
      }
      if (rangeMap.size > 1 && rangeMap.has("")) rangeMap.delete("")
      const result = [...rangeMap.values()]
      cache.set(memoKey, result)
      return result
    }
    intersects(range, options) {
      if (!(range instanceof Range)) {
        throw new TypeError("a Range is required")
      }
      return this.set.some((thisComparators) => {
        return (
          isSatisfiable(thisComparators, options) &&
          range.set.some((rangeComparators) => {
            return (
              isSatisfiable(rangeComparators, options) &&
              thisComparators.every((thisComparator) => {
                return rangeComparators.every((rangeComparator) => {
                  return thisComparator.intersects(rangeComparator, options)
                })
              })
            )
          })
        )
      })
    }
    test(version) {
      if (!version) {
        return false
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options)
        } catch (er) {
          return false
        }
      }
      for (let i = 0; i < this.set.length; i++) {
        if (testSet(this.set[i], version, this.options)) {
          return true
        }
      }
      return false
    }
  }
  module.exports = Range
  var LRU = require_lru_cache()
  var cache = new LRU({ max: 1e3 })
  var parseOptions = require_parse_options()
  var Comparator = require_comparator()
  var debug = require_debug()
  var SemVer = require_semver2()
  var {
    re,
    t,
    comparatorTrimReplace,
    tildeTrimReplace,
    caretTrimReplace,
  } = require_re()
  var isNullSet = (c) => c.value === "<0.0.0-0"
  var isAny = (c) => c.value === ""
  var isSatisfiable = (comparators, options) => {
    let result = true
    const remainingComparators = comparators.slice()
    let testComparator = remainingComparators.pop()
    while (result && remainingComparators.length) {
      result = remainingComparators.every((otherComparator) => {
        return testComparator.intersects(otherComparator, options)
      })
      testComparator = remainingComparators.pop()
    }
    return result
  }
  var parseComparator = (comp, options) => {
    debug("comp", comp, options)
    comp = replaceCarets(comp, options)
    debug("caret", comp)
    comp = replaceTildes(comp, options)
    debug("tildes", comp)
    comp = replaceXRanges(comp, options)
    debug("xrange", comp)
    comp = replaceStars(comp, options)
    debug("stars", comp)
    return comp
  }
  var isX = (id) => !id || id.toLowerCase() === "x" || id === "*"
  var replaceTildes = (comp, options) =>
    comp
      .trim()
      .split(/\s+/)
      .map((comp2) => {
        return replaceTilde(comp2, options)
      })
      .join(" ")
  var replaceTilde = (comp, options) => {
    const r = options.loose ? re[t.TILDELOOSE] : re[t.TILDE]
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("tilde", comp, _, M, m, p, pr)
      let ret
      if (isX(M)) {
        ret = ""
      } else if (isX(m)) {
        ret = `>=${M}.0.0 <${+M + 1}.0.0-0`
      } else if (isX(p)) {
        ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`
      } else if (pr) {
        debug("replaceTilde pr", pr)
        ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`
      } else {
        ret = `>=${M}.${m}.${p} <${M}.${+m + 1}.0-0`
      }
      debug("tilde return", ret)
      return ret
    })
  }
  var replaceCarets = (comp, options) =>
    comp
      .trim()
      .split(/\s+/)
      .map((comp2) => {
        return replaceCaret(comp2, options)
      })
      .join(" ")
  var replaceCaret = (comp, options) => {
    debug("caret", comp, options)
    const r = options.loose ? re[t.CARETLOOSE] : re[t.CARET]
    const z = options.includePrerelease ? "-0" : ""
    return comp.replace(r, (_, M, m, p, pr) => {
      debug("caret", comp, _, M, m, p, pr)
      let ret
      if (isX(M)) {
        ret = ""
      } else if (isX(m)) {
        ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`
      } else if (isX(p)) {
        if (M === "0") {
          ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`
        } else {
          ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`
        }
      } else if (pr) {
        debug("replaceCaret pr", pr)
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${m}.${+p + 1}-0`
          } else {
            ret = `>=${M}.${m}.${p}-${pr} <${M}.${+m + 1}.0-0`
          }
        } else {
          ret = `>=${M}.${m}.${p}-${pr} <${+M + 1}.0.0-0`
        }
      } else {
        debug("no pr")
        if (M === "0") {
          if (m === "0") {
            ret = `>=${M}.${m}.${p}${z} <${M}.${m}.${+p + 1}-0`
          } else {
            ret = `>=${M}.${m}.${p}${z} <${M}.${+m + 1}.0-0`
          }
        } else {
          ret = `>=${M}.${m}.${p} <${+M + 1}.0.0-0`
        }
      }
      debug("caret return", ret)
      return ret
    })
  }
  var replaceXRanges = (comp, options) => {
    debug("replaceXRanges", comp, options)
    return comp
      .split(/\s+/)
      .map((comp2) => {
        return replaceXRange(comp2, options)
      })
      .join(" ")
  }
  var replaceXRange = (comp, options) => {
    comp = comp.trim()
    const r = options.loose ? re[t.XRANGELOOSE] : re[t.XRANGE]
    return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
      debug("xRange", comp, ret, gtlt, M, m, p, pr)
      const xM = isX(M)
      const xm = xM || isX(m)
      const xp = xm || isX(p)
      const anyX = xp
      if (gtlt === "=" && anyX) {
        gtlt = ""
      }
      pr = options.includePrerelease ? "-0" : ""
      if (xM) {
        if (gtlt === ">" || gtlt === "<") {
          ret = "<0.0.0-0"
        } else {
          ret = "*"
        }
      } else if (gtlt && anyX) {
        if (xm) {
          m = 0
        }
        p = 0
        if (gtlt === ">") {
          gtlt = ">="
          if (xm) {
            M = +M + 1
            m = 0
            p = 0
          } else {
            m = +m + 1
            p = 0
          }
        } else if (gtlt === "<=") {
          gtlt = "<"
          if (xm) {
            M = +M + 1
          } else {
            m = +m + 1
          }
        }
        if (gtlt === "<") pr = "-0"
        ret = `${gtlt + M}.${m}.${p}${pr}`
      } else if (xm) {
        ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`
      } else if (xp) {
        ret = `>=${M}.${m}.0${pr} <${M}.${+m + 1}.0-0`
      }
      debug("xRange return", ret)
      return ret
    })
  }
  var replaceStars = (comp, options) => {
    debug("replaceStars", comp, options)
    return comp.trim().replace(re[t.STAR], "")
  }
  var replaceGTE0 = (comp, options) => {
    debug("replaceGTE0", comp, options)
    return comp
      .trim()
      .replace(re[options.includePrerelease ? t.GTE0PRE : t.GTE0], "")
  }
  var hyphenReplace = (incPr) => (
    $0,
    from,
    fM,
    fm,
    fp,
    fpr,
    fb,
    to,
    tM,
    tm,
    tp,
    tpr,
    tb,
  ) => {
    if (isX(fM)) {
      from = ""
    } else if (isX(fm)) {
      from = `>=${fM}.0.0${incPr ? "-0" : ""}`
    } else if (isX(fp)) {
      from = `>=${fM}.${fm}.0${incPr ? "-0" : ""}`
    } else if (fpr) {
      from = `>=${from}`
    } else {
      from = `>=${from}${incPr ? "-0" : ""}`
    }
    if (isX(tM)) {
      to = ""
    } else if (isX(tm)) {
      to = `<${+tM + 1}.0.0-0`
    } else if (isX(tp)) {
      to = `<${tM}.${+tm + 1}.0-0`
    } else if (tpr) {
      to = `<=${tM}.${tm}.${tp}-${tpr}`
    } else if (incPr) {
      to = `<${tM}.${tm}.${+tp + 1}-0`
    } else {
      to = `<=${to}`
    }
    return `${from} ${to}`.trim()
  }
  var testSet = (set, version, options) => {
    for (let i = 0; i < set.length; i++) {
      if (!set[i].test(version)) {
        return false
      }
    }
    if (version.prerelease.length && !options.includePrerelease) {
      for (let i = 0; i < set.length; i++) {
        debug(set[i].semver)
        if (set[i].semver === Comparator.ANY) {
          continue
        }
        if (set[i].semver.prerelease.length > 0) {
          const allowed = set[i].semver
          if (
            allowed.major === version.major &&
            allowed.minor === version.minor &&
            allowed.patch === version.patch
          ) {
            return true
          }
        }
      }
      return false
    }
    return true
  }
})

// node_modules/meow/node_modules/semver/classes/comparator.js
var require_comparator = __commonJS((exports, module) => {
  var ANY = Symbol("SemVer ANY")
  var Comparator = class {
    static get ANY() {
      return ANY
    }
    constructor(comp, options) {
      options = parseOptions(options)
      if (comp instanceof Comparator) {
        if (comp.loose === !!options.loose) {
          return comp
        } else {
          comp = comp.value
        }
      }
      debug("comparator", comp, options)
      this.options = options
      this.loose = !!options.loose
      this.parse(comp)
      if (this.semver === ANY) {
        this.value = ""
      } else {
        this.value = this.operator + this.semver.version
      }
      debug("comp", this)
    }
    parse(comp) {
      const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR]
      const m = comp.match(r)
      if (!m) {
        throw new TypeError(`Invalid comparator: ${comp}`)
      }
      this.operator = m[1] !== void 0 ? m[1] : ""
      if (this.operator === "=") {
        this.operator = ""
      }
      if (!m[2]) {
        this.semver = ANY
      } else {
        this.semver = new SemVer(m[2], this.options.loose)
      }
    }
    toString() {
      return this.value
    }
    test(version) {
      debug("Comparator.test", version, this.options.loose)
      if (this.semver === ANY || version === ANY) {
        return true
      }
      if (typeof version === "string") {
        try {
          version = new SemVer(version, this.options)
        } catch (er) {
          return false
        }
      }
      return cmp(version, this.operator, this.semver, this.options)
    }
    intersects(comp, options) {
      if (!(comp instanceof Comparator)) {
        throw new TypeError("a Comparator is required")
      }
      if (!options || typeof options !== "object") {
        options = {
          loose: !!options,
          includePrerelease: false,
        }
      }
      if (this.operator === "") {
        if (this.value === "") {
          return true
        }
        return new Range(comp.value, options).test(this.value)
      } else if (comp.operator === "") {
        if (comp.value === "") {
          return true
        }
        return new Range(this.value, options).test(comp.semver)
      }
      const sameDirectionIncreasing =
        (this.operator === ">=" || this.operator === ">") &&
        (comp.operator === ">=" || comp.operator === ">")
      const sameDirectionDecreasing =
        (this.operator === "<=" || this.operator === "<") &&
        (comp.operator === "<=" || comp.operator === "<")
      const sameSemVer = this.semver.version === comp.semver.version
      const differentDirectionsInclusive =
        (this.operator === ">=" || this.operator === "<=") &&
        (comp.operator === ">=" || comp.operator === "<=")
      const oppositeDirectionsLessThan =
        cmp(this.semver, "<", comp.semver, options) &&
        (this.operator === ">=" || this.operator === ">") &&
        (comp.operator === "<=" || comp.operator === "<")
      const oppositeDirectionsGreaterThan =
        cmp(this.semver, ">", comp.semver, options) &&
        (this.operator === "<=" || this.operator === "<") &&
        (comp.operator === ">=" || comp.operator === ">")
      return (
        sameDirectionIncreasing ||
        sameDirectionDecreasing ||
        (sameSemVer && differentDirectionsInclusive) ||
        oppositeDirectionsLessThan ||
        oppositeDirectionsGreaterThan
      )
    }
  }
  module.exports = Comparator
  var parseOptions = require_parse_options()
  var { re, t } = require_re()
  var cmp = require_cmp()
  var debug = require_debug()
  var SemVer = require_semver2()
  var Range = require_range()
})

// node_modules/meow/node_modules/semver/functions/satisfies.js
var require_satisfies = __commonJS((exports, module) => {
  var Range = require_range()
  var satisfies = (version, range, options) => {
    try {
      range = new Range(range, options)
    } catch (er) {
      return false
    }
    return range.test(version)
  }
  module.exports = satisfies
})

// node_modules/meow/node_modules/semver/ranges/to-comparators.js
var require_to_comparators = __commonJS((exports, module) => {
  var Range = require_range()
  var toComparators = (range, options) =>
    new Range(range, options).set.map((comp) =>
      comp
        .map((c) => c.value)
        .join(" ")
        .trim()
        .split(" "),
    )
  module.exports = toComparators
})

// node_modules/meow/node_modules/semver/ranges/max-satisfying.js
var require_max_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var Range = require_range()
  var maxSatisfying = (versions, range, options) => {
    let max = null
    let maxSV = null
    let rangeObj = null
    try {
      rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!max || maxSV.compare(v) === -1) {
          max = v
          maxSV = new SemVer(max, options)
        }
      }
    })
    return max
  }
  module.exports = maxSatisfying
})

// node_modules/meow/node_modules/semver/ranges/min-satisfying.js
var require_min_satisfying = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var Range = require_range()
  var minSatisfying = (versions, range, options) => {
    let min = null
    let minSV = null
    let rangeObj = null
    try {
      rangeObj = new Range(range, options)
    } catch (er) {
      return null
    }
    versions.forEach((v) => {
      if (rangeObj.test(v)) {
        if (!min || minSV.compare(v) === 1) {
          min = v
          minSV = new SemVer(min, options)
        }
      }
    })
    return min
  }
  module.exports = minSatisfying
})

// node_modules/meow/node_modules/semver/ranges/min-version.js
var require_min_version = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var Range = require_range()
  var gt = require_gt()
  var minVersion = (range, loose) => {
    range = new Range(range, loose)
    let minver = new SemVer("0.0.0")
    if (range.test(minver)) {
      return minver
    }
    minver = new SemVer("0.0.0-0")
    if (range.test(minver)) {
      return minver
    }
    minver = null
    for (let i = 0; i < range.set.length; ++i) {
      const comparators = range.set[i]
      let setMin = null
      comparators.forEach((comparator) => {
        const compver = new SemVer(comparator.semver.version)
        switch (comparator.operator) {
          case ">":
            if (compver.prerelease.length === 0) {
              compver.patch++
            } else {
              compver.prerelease.push(0)
            }
            compver.raw = compver.format()
          case "":
          case ">=":
            if (!setMin || gt(compver, setMin)) {
              setMin = compver
            }
            break
          case "<":
          case "<=":
            break
          default:
            throw new Error(`Unexpected operation: ${comparator.operator}`)
        }
      })
      if (setMin && (!minver || gt(minver, setMin))) minver = setMin
    }
    if (minver && range.test(minver)) {
      return minver
    }
    return null
  }
  module.exports = minVersion
})

// node_modules/meow/node_modules/semver/ranges/valid.js
var require_valid2 = __commonJS((exports, module) => {
  var Range = require_range()
  var validRange = (range, options) => {
    try {
      return new Range(range, options).range || "*"
    } catch (er) {
      return null
    }
  }
  module.exports = validRange
})

// node_modules/meow/node_modules/semver/ranges/outside.js
var require_outside = __commonJS((exports, module) => {
  var SemVer = require_semver2()
  var Comparator = require_comparator()
  var { ANY } = Comparator
  var Range = require_range()
  var satisfies = require_satisfies()
  var gt = require_gt()
  var lt = require_lt()
  var lte = require_lte()
  var gte = require_gte()
  var outside = (version, range, hilo, options) => {
    version = new SemVer(version, options)
    range = new Range(range, options)
    let gtfn, ltefn, ltfn, comp, ecomp
    switch (hilo) {
      case ">":
        gtfn = gt
        ltefn = lte
        ltfn = lt
        comp = ">"
        ecomp = ">="
        break
      case "<":
        gtfn = lt
        ltefn = gte
        ltfn = gt
        comp = "<"
        ecomp = "<="
        break
      default:
        throw new TypeError('Must provide a hilo val of "<" or ">"')
    }
    if (satisfies(version, range, options)) {
      return false
    }
    for (let i = 0; i < range.set.length; ++i) {
      const comparators = range.set[i]
      let high = null
      let low = null
      comparators.forEach((comparator) => {
        if (comparator.semver === ANY) {
          comparator = new Comparator(">=0.0.0")
        }
        high = high || comparator
        low = low || comparator
        if (gtfn(comparator.semver, high.semver, options)) {
          high = comparator
        } else if (ltfn(comparator.semver, low.semver, options)) {
          low = comparator
        }
      })
      if (high.operator === comp || high.operator === ecomp) {
        return false
      }
      if (
        (!low.operator || low.operator === comp) &&
        ltefn(version, low.semver)
      ) {
        return false
      } else if (low.operator === ecomp && ltfn(version, low.semver)) {
        return false
      }
    }
    return true
  }
  module.exports = outside
})

// node_modules/meow/node_modules/semver/ranges/gtr.js
var require_gtr = __commonJS((exports, module) => {
  var outside = require_outside()
  var gtr = (version, range, options) => outside(version, range, ">", options)
  module.exports = gtr
})

// node_modules/meow/node_modules/semver/ranges/ltr.js
var require_ltr = __commonJS((exports, module) => {
  var outside = require_outside()
  var ltr = (version, range, options) => outside(version, range, "<", options)
  module.exports = ltr
})

// node_modules/meow/node_modules/semver/ranges/intersects.js
var require_intersects = __commonJS((exports, module) => {
  var Range = require_range()
  var intersects = (r1, r2, options) => {
    r1 = new Range(r1, options)
    r2 = new Range(r2, options)
    return r1.intersects(r2)
  }
  module.exports = intersects
})

// node_modules/meow/node_modules/semver/ranges/simplify.js
var require_simplify = __commonJS((exports, module) => {
  var satisfies = require_satisfies()
  var compare = require_compare()
  module.exports = (versions, range, options) => {
    const set = []
    let min = null
    let prev = null
    const v = versions.sort((a, b) => compare(a, b, options))
    for (const version of v) {
      const included = satisfies(version, range, options)
      if (included) {
        prev = version
        if (!min) min = version
      } else {
        if (prev) {
          set.push([min, prev])
        }
        prev = null
        min = null
      }
    }
    if (min) set.push([min, null])
    const ranges = []
    for (const [min2, max] of set) {
      if (min2 === max) ranges.push(min2)
      else if (!max && min2 === v[0]) ranges.push("*")
      else if (!max) ranges.push(`>=${min2}`)
      else if (min2 === v[0]) ranges.push(`<=${max}`)
      else ranges.push(`${min2} - ${max}`)
    }
    const simplified = ranges.join(" || ")
    const original = typeof range.raw === "string" ? range.raw : String(range)
    return simplified.length < original.length ? simplified : range
  }
})

// node_modules/meow/node_modules/semver/ranges/subset.js
var require_subset = __commonJS((exports, module) => {
  var Range = require_range()
  var { ANY } = require_comparator()
  var satisfies = require_satisfies()
  var compare = require_compare()
  var subset = (sub, dom, options) => {
    if (sub === dom) return true
    sub = new Range(sub, options)
    dom = new Range(dom, options)
    let sawNonNull = false
    OUTER: for (const simpleSub of sub.set) {
      for (const simpleDom of dom.set) {
        const isSub = simpleSubset(simpleSub, simpleDom, options)
        sawNonNull = sawNonNull || isSub !== null
        if (isSub) continue OUTER
      }
      if (sawNonNull) return false
    }
    return true
  }
  var simpleSubset = (sub, dom, options) => {
    if (sub === dom) return true
    if (sub.length === 1 && sub[0].semver === ANY)
      return dom.length === 1 && dom[0].semver === ANY
    const eqSet = new Set()
    let gt, lt
    for (const c of sub) {
      if (c.operator === ">" || c.operator === ">=")
        gt = higherGT(gt, c, options)
      else if (c.operator === "<" || c.operator === "<=")
        lt = lowerLT(lt, c, options)
      else eqSet.add(c.semver)
    }
    if (eqSet.size > 1) return null
    let gtltComp
    if (gt && lt) {
      gtltComp = compare(gt.semver, lt.semver, options)
      if (gtltComp > 0) return null
      else if (gtltComp === 0 && (gt.operator !== ">=" || lt.operator !== "<="))
        return null
    }
    for (const eq of eqSet) {
      if (gt && !satisfies(eq, String(gt), options)) return null
      if (lt && !satisfies(eq, String(lt), options)) return null
      for (const c of dom) {
        if (!satisfies(eq, String(c), options)) return false
      }
      return true
    }
    let higher, lower
    let hasDomLT, hasDomGT
    for (const c of dom) {
      hasDomGT = hasDomGT || c.operator === ">" || c.operator === ">="
      hasDomLT = hasDomLT || c.operator === "<" || c.operator === "<="
      if (gt) {
        if (c.operator === ">" || c.operator === ">=") {
          higher = higherGT(gt, c, options)
          if (higher === c && higher !== gt) return false
        } else if (
          gt.operator === ">=" &&
          !satisfies(gt.semver, String(c), options)
        )
          return false
      }
      if (lt) {
        if (c.operator === "<" || c.operator === "<=") {
          lower = lowerLT(lt, c, options)
          if (lower === c && lower !== lt) return false
        } else if (
          lt.operator === "<=" &&
          !satisfies(lt.semver, String(c), options)
        )
          return false
      }
      if (!c.operator && (lt || gt) && gtltComp !== 0) return false
    }
    if (gt && hasDomLT && !lt && gtltComp !== 0) return false
    if (lt && hasDomGT && !gt && gtltComp !== 0) return false
    return true
  }
  var higherGT = (a, b, options) => {
    if (!a) return b
    const comp = compare(a.semver, b.semver, options)
    return comp > 0
      ? a
      : comp < 0
      ? b
      : b.operator === ">" && a.operator === ">="
      ? b
      : a
  }
  var lowerLT = (a, b, options) => {
    if (!a) return b
    const comp = compare(a.semver, b.semver, options)
    return comp < 0
      ? a
      : comp > 0
      ? b
      : b.operator === "<" && a.operator === "<="
      ? b
      : a
  }
  module.exports = subset
})

// node_modules/meow/node_modules/semver/index.js
var require_semver3 = __commonJS((exports, module) => {
  var internalRe = require_re()
  module.exports = {
    re: internalRe.re,
    src: internalRe.src,
    tokens: internalRe.t,
    SEMVER_SPEC_VERSION: require_constants().SEMVER_SPEC_VERSION,
    SemVer: require_semver2(),
    compareIdentifiers: require_identifiers().compareIdentifiers,
    rcompareIdentifiers: require_identifiers().rcompareIdentifiers,
    parse: require_parse2(),
    valid: require_valid(),
    clean: require_clean(),
    inc: require_inc(),
    diff: require_diff(),
    major: require_major(),
    minor: require_minor(),
    patch: require_patch(),
    prerelease: require_prerelease(),
    compare: require_compare(),
    rcompare: require_rcompare(),
    compareLoose: require_compare_loose(),
    compareBuild: require_compare_build(),
    sort: require_sort(),
    rsort: require_rsort(),
    gt: require_gt(),
    lt: require_lt(),
    eq: require_eq(),
    neq: require_neq(),
    gte: require_gte(),
    lte: require_lte(),
    cmp: require_cmp(),
    coerce: require_coerce(),
    Comparator: require_comparator(),
    Range: require_range(),
    satisfies: require_satisfies(),
    toComparators: require_to_comparators(),
    maxSatisfying: require_max_satisfying(),
    minSatisfying: require_min_satisfying(),
    minVersion: require_min_version(),
    validRange: require_valid2(),
    outside: require_outside(),
    gtr: require_gtr(),
    ltr: require_ltr(),
    intersects: require_intersects(),
    simplifyRange: require_simplify(),
    subset: require_subset(),
  }
})

// node_modules/meow/node_modules/hosted-git-info/git-host-info.js
var require_git_host_info2 = __commonJS((exports, module) => {
  "use strict"
  var gitHosts = (module.exports = {
    github: {
      protocols: ["git", "http", "git+ssh", "git+https", "ssh", "https"],
      domain: "github.com",
      treepath: "tree",
      filetemplate:
        "https://{auth@}raw.githubusercontent.com/{user}/{project}/{committish}/{path}",
      bugstemplate: "https://{domain}/{user}/{project}/issues",
      gittemplate: "git://{auth@}{domain}/{user}/{project}.git{#committish}",
      tarballtemplate:
        "https://codeload.{domain}/{user}/{project}/tar.gz/{committish}",
    },
    bitbucket: {
      protocols: ["git+ssh", "git+https", "ssh", "https"],
      domain: "bitbucket.org",
      treepath: "src",
      tarballtemplate:
        "https://{domain}/{user}/{project}/get/{committish}.tar.gz",
    },
    gitlab: {
      protocols: ["git+ssh", "git+https", "ssh", "https"],
      domain: "gitlab.com",
      treepath: "tree",
      bugstemplate: "https://{domain}/{user}/{project}/issues",
      httpstemplate:
        "git+https://{auth@}{domain}/{user}/{projectPath}.git{#committish}",
      tarballtemplate:
        "https://{domain}/{user}/{project}/repository/archive.tar.gz?ref={committish}",
      pathmatch: /^\/([^/]+)\/((?!.*(\/-\/|\/repository(\/[^/]+)?\/archive\.tar\.gz)).*?)(?:\.git|\/)?$/,
    },
    gist: {
      protocols: ["git", "git+ssh", "git+https", "ssh", "https"],
      domain: "gist.github.com",
      pathmatch: /^[/](?:([^/]+)[/])?([a-z0-9]{7,})(?:[.]git)?$/,
      filetemplate:
        "https://gist.githubusercontent.com/{user}/{project}/raw{/committish}/{path}",
      bugstemplate: "https://{domain}/{project}",
      gittemplate: "git://{domain}/{project}.git{#committish}",
      sshtemplate: "git@{domain}:/{project}.git{#committish}",
      sshurltemplate: "git+ssh://git@{domain}/{project}.git{#committish}",
      browsetemplate: "https://{domain}/{project}{/committish}",
      browsefiletemplate: "https://{domain}/{project}{/committish}{#path}",
      docstemplate: "https://{domain}/{project}{/committish}",
      httpstemplate: "git+https://{domain}/{project}.git{#committish}",
      shortcuttemplate: "{type}:{project}{#committish}",
      pathtemplate: "{project}{#committish}",
      tarballtemplate:
        "https://codeload.github.com/gist/{project}/tar.gz/{committish}",
      hashformat: function (fragment) {
        return "file-" + formatHashFragment(fragment)
      },
    },
  })
  var gitHostDefaults = {
    sshtemplate: "git@{domain}:{user}/{project}.git{#committish}",
    sshurltemplate: "git+ssh://git@{domain}/{user}/{project}.git{#committish}",
    browsetemplate: "https://{domain}/{user}/{project}{/tree/committish}",
    browsefiletemplate:
      "https://{domain}/{user}/{project}/{treepath}/{committish}/{path}{#fragment}",
    docstemplate: "https://{domain}/{user}/{project}{/tree/committish}#readme",
    httpstemplate:
      "git+https://{auth@}{domain}/{user}/{project}.git{#committish}",
    filetemplate: "https://{domain}/{user}/{project}/raw/{committish}/{path}",
    shortcuttemplate: "{type}:{user}/{project}{#committish}",
    pathtemplate: "{user}/{project}{#committish}",
    pathmatch: /^[/]([^/]+)[/]([^/]+?)(?:[.]git|[/])?$/,
    hashformat: formatHashFragment,
  }
  Object.keys(gitHosts).forEach(function (name) {
    Object.keys(gitHostDefaults).forEach(function (key) {
      if (gitHosts[name][key]) return
      gitHosts[name][key] = gitHostDefaults[key]
    })
    gitHosts[name].protocols_re = RegExp(
      "^(" +
        gitHosts[name].protocols
          .map(function (protocol) {
            return protocol.replace(/([\\+*{}()[\]$^|])/g, "\\$1")
          })
          .join("|") +
        "):$",
    )
  })
  function formatHashFragment(fragment) {
    return fragment
      .toLowerCase()
      .replace(/^\W+|\/|\W+$/g, "")
      .replace(/\W+/g, "-")
  }
})

// node_modules/meow/node_modules/hosted-git-info/git-host.js
var require_git_host2 = __commonJS((exports, module) => {
  "use strict"
  var gitHosts = require_git_host_info2()
  var extend =
    Object.assign ||
    function _extend(target, source) {
      if (source === null || typeof source !== "object") return target
      const keys = Object.keys(source)
      let i = keys.length
      while (i--) {
        target[keys[i]] = source[keys[i]]
      }
      return target
    }
  module.exports = GitHost
  function GitHost(
    type,
    user,
    auth,
    project,
    committish,
    defaultRepresentation,
    opts,
  ) {
    var gitHostInfo = this
    gitHostInfo.type = type
    Object.keys(gitHosts[type]).forEach(function (key) {
      gitHostInfo[key] = gitHosts[type][key]
    })
    gitHostInfo.user = user
    gitHostInfo.auth = auth
    gitHostInfo.project = project
    gitHostInfo.committish = committish
    gitHostInfo.default = defaultRepresentation
    gitHostInfo.opts = opts || {}
  }
  GitHost.prototype.hash = function () {
    return this.committish ? "#" + this.committish : ""
  }
  GitHost.prototype._fill = function (template, opts) {
    if (!template) return
    var vars = extend({}, opts)
    vars.path = vars.path ? vars.path.replace(/^[/]+/g, "") : ""
    opts = extend(extend({}, this.opts), opts)
    var self = this
    Object.keys(this).forEach(function (key) {
      if (self[key] != null && vars[key] == null) vars[key] = self[key]
    })
    var rawAuth = vars.auth
    var rawcommittish = vars.committish
    var rawFragment = vars.fragment
    var rawPath = vars.path
    var rawProject = vars.project
    Object.keys(vars).forEach(function (key) {
      var value = vars[key]
      if ((key === "path" || key === "project") && typeof value === "string") {
        vars[key] = value
          .split("/")
          .map(function (pathComponent) {
            return encodeURIComponent(pathComponent)
          })
          .join("/")
      } else if (key !== "domain") {
        vars[key] = encodeURIComponent(value)
      }
    })
    vars["auth@"] = rawAuth ? rawAuth + "@" : ""
    vars["#fragment"] = rawFragment ? "#" + this.hashformat(rawFragment) : ""
    vars.fragment = vars.fragment ? vars.fragment : ""
    vars["#path"] = rawPath ? "#" + this.hashformat(rawPath) : ""
    vars["/path"] = vars.path ? "/" + vars.path : ""
    vars.projectPath = rawProject.split("/").map(encodeURIComponent).join("/")
    if (opts.noCommittish) {
      vars["#committish"] = ""
      vars["/tree/committish"] = ""
      vars["/committish"] = ""
      vars.committish = ""
    } else {
      vars["#committish"] = rawcommittish ? "#" + rawcommittish : ""
      vars["/tree/committish"] = vars.committish
        ? "/" + vars.treepath + "/" + vars.committish
        : ""
      vars["/committish"] = vars.committish ? "/" + vars.committish : ""
      vars.committish = vars.committish || "master"
    }
    var res = template
    Object.keys(vars).forEach(function (key) {
      res = res.replace(new RegExp("[{]" + key + "[}]", "g"), vars[key])
    })
    if (opts.noGitPlus) {
      return res.replace(/^git[+]/, "")
    } else {
      return res
    }
  }
  GitHost.prototype.ssh = function (opts) {
    return this._fill(this.sshtemplate, opts)
  }
  GitHost.prototype.sshurl = function (opts) {
    return this._fill(this.sshurltemplate, opts)
  }
  GitHost.prototype.browse = function (P, F, opts) {
    if (typeof P === "string") {
      if (typeof F !== "string") {
        opts = F
        F = null
      }
      return this._fill(
        this.browsefiletemplate,
        extend(
          {
            fragment: F,
            path: P,
          },
          opts,
        ),
      )
    } else {
      return this._fill(this.browsetemplate, P)
    }
  }
  GitHost.prototype.docs = function (opts) {
    return this._fill(this.docstemplate, opts)
  }
  GitHost.prototype.bugs = function (opts) {
    return this._fill(this.bugstemplate, opts)
  }
  GitHost.prototype.https = function (opts) {
    return this._fill(this.httpstemplate, opts)
  }
  GitHost.prototype.git = function (opts) {
    return this._fill(this.gittemplate, opts)
  }
  GitHost.prototype.shortcut = function (opts) {
    return this._fill(this.shortcuttemplate, opts)
  }
  GitHost.prototype.path = function (opts) {
    return this._fill(this.pathtemplate, opts)
  }
  GitHost.prototype.tarball = function (opts_) {
    var opts = extend({}, opts_, { noCommittish: false })
    return this._fill(this.tarballtemplate, opts)
  }
  GitHost.prototype.file = function (P, opts) {
    return this._fill(this.filetemplate, extend({ path: P }, opts))
  }
  GitHost.prototype.getDefaultRepresentation = function () {
    return this.default
  }
  GitHost.prototype.toString = function (opts) {
    if (this.default && typeof this[this.default] === "function")
      return this[this.default](opts)
    return this.sshurl(opts)
  }
})

// node_modules/meow/node_modules/hosted-git-info/index.js
var require_hosted_git_info2 = __commonJS((exports, module) => {
  "use strict"
  var url = require("url")
  var gitHosts = require_git_host_info2()
  var GitHost = (module.exports = require_git_host2())
  var LRU = require_lru_cache()
  var cache = new LRU({ max: 1e3 })
  var protocolToRepresentationMap = {
    "git+ssh:": "sshurl",
    "git+https:": "https",
    "ssh:": "sshurl",
    "git:": "git",
  }
  function protocolToRepresentation(protocol) {
    return protocolToRepresentationMap[protocol] || protocol.slice(0, -1)
  }
  var authProtocols = {
    "git:": true,
    "https:": true,
    "git+https:": true,
    "http:": true,
    "git+http:": true,
  }
  module.exports.fromUrl = function (giturl, opts) {
    if (typeof giturl !== "string") return
    var key = giturl + JSON.stringify(opts || {})
    if (!cache.has(key)) {
      cache.set(key, fromUrl(giturl, opts))
    }
    return cache.get(key)
  }
  function fromUrl(giturl, opts) {
    if (giturl == null || giturl === "") return
    var url2 = fixupUnqualifiedGist(
      isGitHubShorthand(giturl) ? "github:" + giturl : giturl,
    )
    var parsed = parseGitUrl(url2)
    var shortcutMatch = url2.match(
      new RegExp(
        "^([^:]+):(?:(?:[^@:]+(?:[^@]+)?@)?([^/]*))[/](.+?)(?:[.]git)?($|#)",
      ),
    )
    var matches = Object.keys(gitHosts)
      .map(function (gitHostName) {
        try {
          var gitHostInfo = gitHosts[gitHostName]
          var auth = null
          if (parsed.auth && authProtocols[parsed.protocol]) {
            auth = parsed.auth
          }
          var committish = parsed.hash
            ? decodeURIComponent(parsed.hash.substr(1))
            : null
          var user = null
          var project = null
          var defaultRepresentation = null
          if (shortcutMatch && shortcutMatch[1] === gitHostName) {
            user = shortcutMatch[2] && decodeURIComponent(shortcutMatch[2])
            project = decodeURIComponent(shortcutMatch[3])
            defaultRepresentation = "shortcut"
          } else {
            if (
              parsed.host &&
              parsed.host !== gitHostInfo.domain &&
              parsed.host.replace(/^www[.]/, "") !== gitHostInfo.domain
            )
              return
            if (!gitHostInfo.protocols_re.test(parsed.protocol)) return
            if (!parsed.path) return
            var pathmatch = gitHostInfo.pathmatch
            var matched = parsed.path.match(pathmatch)
            if (!matched) return
            if (matched[1] !== null && matched[1] !== void 0) {
              user = decodeURIComponent(matched[1].replace(/^:/, ""))
            }
            project = decodeURIComponent(matched[2])
            defaultRepresentation = protocolToRepresentation(parsed.protocol)
          }
          return new GitHost(
            gitHostName,
            user,
            auth,
            project,
            committish,
            defaultRepresentation,
            opts,
          )
        } catch (ex) {
          if (ex instanceof URIError) {
          } else throw ex
        }
      })
      .filter(function (gitHostInfo) {
        return gitHostInfo
      })
    if (matches.length !== 1) return
    return matches[0]
  }
  function isGitHubShorthand(arg) {
    return /^[^:@%/\s.-][^:@%/\s]*[/][^:@\s/%]+(?:#.*)?$/.test(arg)
  }
  function fixupUnqualifiedGist(giturl) {
    var parsed = url.parse(giturl)
    if (parsed.protocol === "gist:" && parsed.host && !parsed.path) {
      return parsed.protocol + "/" + parsed.host
    } else {
      return giturl
    }
  }
  function parseGitUrl(giturl) {
    var matched = giturl.match(
      /^([^@]+)@([^:/]+):[/]?((?:[^/]+[/])?[^/]+?)(?:[.]git)?(#.*)?$/,
    )
    if (!matched) {
      var legacy = url.parse(giturl)
      if (legacy.auth) {
        const authmatch = giturl.match(/[^@]+@[^:/]+/)
        if (authmatch) {
          var whatwg = new url.URL(authmatch[0])
          legacy.auth = whatwg.username || ""
          if (whatwg.password) legacy.auth += ":" + whatwg.password
        }
      }
      return legacy
    }
    return {
      protocol: "git+ssh:",
      slashes: true,
      auth: matched[1],
      host: matched[2],
      port: null,
      hostname: matched[2],
      hash: matched[4],
      search: null,
      query: null,
      pathname: "/" + matched[3],
      path: "/" + matched[3],
      href:
        "git+ssh://" +
        matched[1] +
        "@" +
        matched[2] +
        "/" +
        matched[3] +
        (matched[4] || ""),
    }
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/extract_description.js
var require_extract_description2 = __commonJS((exports, module) => {
  module.exports = extractDescription
  function extractDescription(d) {
    if (!d) return
    if (d === "ERROR: No README data found!") return
    d = d.trim().split("\n")
    for (var s = 0; d[s] && d[s].trim().match(/^(#|$)/); s++);
    var l = d.length
    for (var e = s + 1; e < l && d[e].trim(); e++);
    return d.slice(s, e).join(" ").trim()
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/typos.json
var require_typos2 = __commonJS((exports, module) => {
  module.exports = {
    topLevel: {
      dependancies: "dependencies",
      dependecies: "dependencies",
      depdenencies: "dependencies",
      devEependencies: "devDependencies",
      depends: "dependencies",
      "dev-dependencies": "devDependencies",
      devDependences: "devDependencies",
      devDepenencies: "devDependencies",
      devdependencies: "devDependencies",
      repostitory: "repository",
      repo: "repository",
      prefereGlobal: "preferGlobal",
      hompage: "homepage",
      hampage: "homepage",
      autohr: "author",
      autor: "author",
      contributers: "contributors",
      publicationConfig: "publishConfig",
      script: "scripts",
    },
    bugs: { web: "url", name: "url" },
    script: { server: "start", tests: "test" },
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/fixer.js
var require_fixer2 = __commonJS((exports, module) => {
  var semver = require_semver3()
  var validateLicense = require_validate_npm_package_license()
  var hostedGitInfo = require_hosted_git_info2()
  var isBuiltinModule = require_resolve().isCore
  var depTypes = ["dependencies", "devDependencies", "optionalDependencies"]
  var extractDescription = require_extract_description2()
  var url = require("url")
  var typos = require_typos2()
  var fixer = (module.exports = {
    warn: function () {},
    fixRepositoryField: function (data) {
      if (data.repositories) {
        this.warn("repositories")
        data.repository = data.repositories[0]
      }
      if (!data.repository) return this.warn("missingRepository")
      if (typeof data.repository === "string") {
        data.repository = {
          type: "git",
          url: data.repository,
        }
      }
      var r = data.repository.url || ""
      if (r) {
        var hosted = hostedGitInfo.fromUrl(r)
        if (hosted) {
          r = data.repository.url =
            hosted.getDefaultRepresentation() == "shortcut"
              ? hosted.https()
              : hosted.toString()
        }
      }
      if (r.match(/github.com\/[^\/]+\/[^\/]+\.git\.git$/)) {
        this.warn("brokenGitUrl", r)
      }
    },
    fixTypos: function (data) {
      Object.keys(typos.topLevel).forEach(function (d) {
        if (data.hasOwnProperty(d)) {
          this.warn("typo", d, typos.topLevel[d])
        }
      }, this)
    },
    fixScriptsField: function (data) {
      if (!data.scripts) return
      if (typeof data.scripts !== "object") {
        this.warn("nonObjectScripts")
        delete data.scripts
        return
      }
      Object.keys(data.scripts).forEach(function (k) {
        if (typeof data.scripts[k] !== "string") {
          this.warn("nonStringScript")
          delete data.scripts[k]
        } else if (typos.script[k] && !data.scripts[typos.script[k]]) {
          this.warn("typo", k, typos.script[k], "scripts")
        }
      }, this)
    },
    fixFilesField: function (data) {
      var files = data.files
      if (files && !Array.isArray(files)) {
        this.warn("nonArrayFiles")
        delete data.files
      } else if (data.files) {
        data.files = data.files.filter(function (file) {
          if (!file || typeof file !== "string") {
            this.warn("invalidFilename", file)
            return false
          } else {
            return true
          }
        }, this)
      }
    },
    fixBinField: function (data) {
      if (!data.bin) return
      if (typeof data.bin === "string") {
        var b = {}
        var match
        if ((match = data.name.match(/^@[^/]+[/](.*)$/))) {
          b[match[1]] = data.bin
        } else {
          b[data.name] = data.bin
        }
        data.bin = b
      }
    },
    fixManField: function (data) {
      if (!data.man) return
      if (typeof data.man === "string") {
        data.man = [data.man]
      }
    },
    fixBundleDependenciesField: function (data) {
      var bdd = "bundledDependencies"
      var bd = "bundleDependencies"
      if (data[bdd] && !data[bd]) {
        data[bd] = data[bdd]
        delete data[bdd]
      }
      if (data[bd] && !Array.isArray(data[bd])) {
        this.warn("nonArrayBundleDependencies")
        delete data[bd]
      } else if (data[bd]) {
        data[bd] = data[bd].filter(function (bd2) {
          if (!bd2 || typeof bd2 !== "string") {
            this.warn("nonStringBundleDependency", bd2)
            return false
          } else {
            if (!data.dependencies) {
              data.dependencies = {}
            }
            if (!data.dependencies.hasOwnProperty(bd2)) {
              this.warn("nonDependencyBundleDependency", bd2)
              data.dependencies[bd2] = "*"
            }
            return true
          }
        }, this)
      }
    },
    fixDependencies: function (data, strict) {
      var loose = !strict
      objectifyDeps(data, this.warn)
      addOptionalDepsToDeps(data, this.warn)
      this.fixBundleDependenciesField(data)
      ;["dependencies", "devDependencies"].forEach(function (deps) {
        if (!(deps in data)) return
        if (!data[deps] || typeof data[deps] !== "object") {
          this.warn("nonObjectDependencies", deps)
          delete data[deps]
          return
        }
        Object.keys(data[deps]).forEach(function (d) {
          var r = data[deps][d]
          if (typeof r !== "string") {
            this.warn("nonStringDependency", d, JSON.stringify(r))
            delete data[deps][d]
          }
          var hosted = hostedGitInfo.fromUrl(data[deps][d])
          if (hosted) data[deps][d] = hosted.toString()
        }, this)
      }, this)
    },
    fixModulesField: function (data) {
      if (data.modules) {
        this.warn("deprecatedModules")
        delete data.modules
      }
    },
    fixKeywordsField: function (data) {
      if (typeof data.keywords === "string") {
        data.keywords = data.keywords.split(/,\s+/)
      }
      if (data.keywords && !Array.isArray(data.keywords)) {
        delete data.keywords
        this.warn("nonArrayKeywords")
      } else if (data.keywords) {
        data.keywords = data.keywords.filter(function (kw) {
          if (typeof kw !== "string" || !kw) {
            this.warn("nonStringKeyword")
            return false
          } else {
            return true
          }
        }, this)
      }
    },
    fixVersionField: function (data, strict) {
      var loose = !strict
      if (!data.version) {
        data.version = ""
        return true
      }
      if (!semver.valid(data.version, loose)) {
        throw new Error('Invalid version: "' + data.version + '"')
      }
      data.version = semver.clean(data.version, loose)
      return true
    },
    fixPeople: function (data) {
      modifyPeople(data, unParsePerson)
      modifyPeople(data, parsePerson)
    },
    fixNameField: function (data, options) {
      if (typeof options === "boolean") options = { strict: options }
      else if (typeof options === "undefined") options = {}
      var strict = options.strict
      if (!data.name && !strict) {
        data.name = ""
        return
      }
      if (typeof data.name !== "string") {
        throw new Error("name field must be a string.")
      }
      if (!strict) data.name = data.name.trim()
      ensureValidName(data.name, strict, options.allowLegacyCase)
      if (isBuiltinModule(data.name)) this.warn("conflictingName", data.name)
    },
    fixDescriptionField: function (data) {
      if (data.description && typeof data.description !== "string") {
        this.warn("nonStringDescription")
        delete data.description
      }
      if (data.readme && !data.description)
        data.description = extractDescription(data.readme)
      if (data.description === void 0) delete data.description
      if (!data.description) this.warn("missingDescription")
    },
    fixReadmeField: function (data) {
      if (!data.readme) {
        this.warn("missingReadme")
        data.readme = "ERROR: No README data found!"
      }
    },
    fixBugsField: function (data) {
      if (!data.bugs && data.repository && data.repository.url) {
        var hosted = hostedGitInfo.fromUrl(data.repository.url)
        if (hosted && hosted.bugs()) {
          data.bugs = { url: hosted.bugs() }
        }
      } else if (data.bugs) {
        var emailRe = /^.+@.*\..+$/
        if (typeof data.bugs == "string") {
          if (emailRe.test(data.bugs)) data.bugs = { email: data.bugs }
          else if (url.parse(data.bugs).protocol) data.bugs = { url: data.bugs }
          else this.warn("nonEmailUrlBugsString")
        } else {
          bugsTypos(data.bugs, this.warn)
          var oldBugs = data.bugs
          data.bugs = {}
          if (oldBugs.url) {
            if (
              typeof oldBugs.url == "string" &&
              url.parse(oldBugs.url).protocol
            )
              data.bugs.url = oldBugs.url
            else this.warn("nonUrlBugsUrlField")
          }
          if (oldBugs.email) {
            if (typeof oldBugs.email == "string" && emailRe.test(oldBugs.email))
              data.bugs.email = oldBugs.email
            else this.warn("nonEmailBugsEmailField")
          }
        }
        if (!data.bugs.email && !data.bugs.url) {
          delete data.bugs
          this.warn("emptyNormalizedBugs")
        }
      }
    },
    fixHomepageField: function (data) {
      if (!data.homepage && data.repository && data.repository.url) {
        var hosted = hostedGitInfo.fromUrl(data.repository.url)
        if (hosted && hosted.docs()) data.homepage = hosted.docs()
      }
      if (!data.homepage) return
      if (typeof data.homepage !== "string") {
        this.warn("nonUrlHomepage")
        return delete data.homepage
      }
      if (!url.parse(data.homepage).protocol) {
        data.homepage = "http://" + data.homepage
      }
    },
    fixLicenseField: function (data) {
      if (!data.license) {
        return this.warn("missingLicense")
      } else {
        if (
          typeof data.license !== "string" ||
          data.license.length < 1 ||
          data.license.trim() === ""
        ) {
          this.warn("invalidLicense")
        } else {
          if (!validateLicense(data.license).validForNewPackages)
            this.warn("invalidLicense")
        }
      }
    },
  })
  function isValidScopedPackageName(spec) {
    if (spec.charAt(0) !== "@") return false
    var rest = spec.slice(1).split("/")
    if (rest.length !== 2) return false
    return (
      rest[0] &&
      rest[1] &&
      rest[0] === encodeURIComponent(rest[0]) &&
      rest[1] === encodeURIComponent(rest[1])
    )
  }
  function isCorrectlyEncodedName(spec) {
    return !spec.match(/[\/@\s\+%:]/) && spec === encodeURIComponent(spec)
  }
  function ensureValidName(name, strict, allowLegacyCase) {
    if (
      name.charAt(0) === "." ||
      !(isValidScopedPackageName(name) || isCorrectlyEncodedName(name)) ||
      (strict && !allowLegacyCase && name !== name.toLowerCase()) ||
      name.toLowerCase() === "node_modules" ||
      name.toLowerCase() === "favicon.ico"
    ) {
      throw new Error("Invalid name: " + JSON.stringify(name))
    }
  }
  function modifyPeople(data, fn) {
    if (data.author) data.author = fn(data.author)
    ;["maintainers", "contributors"].forEach(function (set) {
      if (!Array.isArray(data[set])) return
      data[set] = data[set].map(fn)
    })
    return data
  }
  function unParsePerson(person) {
    if (typeof person === "string") return person
    var name = person.name || ""
    var u = person.url || person.web
    var url2 = u ? " (" + u + ")" : ""
    var e = person.email || person.mail
    var email = e ? " <" + e + ">" : ""
    return name + email + url2
  }
  function parsePerson(person) {
    if (typeof person !== "string") return person
    var name = person.match(/^([^\(<]+)/)
    var url2 = person.match(/\(([^\)]+)\)/)
    var email = person.match(/<([^>]+)>/)
    var obj = {}
    if (name && name[0].trim()) obj.name = name[0].trim()
    if (email) obj.email = email[1]
    if (url2) obj.url = url2[1]
    return obj
  }
  function addOptionalDepsToDeps(data, warn) {
    var o = data.optionalDependencies
    if (!o) return
    var d = data.dependencies || {}
    Object.keys(o).forEach(function (k) {
      d[k] = o[k]
    })
    data.dependencies = d
  }
  function depObjectify(deps, type, warn) {
    if (!deps) return {}
    if (typeof deps === "string") {
      deps = deps.trim().split(/[\n\r\s\t ,]+/)
    }
    if (!Array.isArray(deps)) return deps
    warn("deprecatedArrayDependencies", type)
    var o = {}
    deps
      .filter(function (d) {
        return typeof d === "string"
      })
      .forEach(function (d) {
        d = d.trim().split(/(:?[@\s><=])/)
        var dn = d.shift()
        var dv = d.join("")
        dv = dv.trim()
        dv = dv.replace(/^@/, "")
        o[dn] = dv
      })
    return o
  }
  function objectifyDeps(data, warn) {
    depTypes.forEach(function (type) {
      if (!data[type]) return
      data[type] = depObjectify(data[type], type, warn)
    })
  }
  function bugsTypos(bugs, warn) {
    if (!bugs) return
    Object.keys(bugs).forEach(function (k) {
      if (typos.bugs[k]) {
        warn("typo", k, typos.bugs[k], "bugs")
        bugs[typos.bugs[k]] = bugs[k]
        delete bugs[k]
      }
    })
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/warning_messages.json
var require_warning_messages2 = __commonJS((exports, module) => {
  module.exports = {
    repositories:
      "'repositories' (plural) Not supported. Please pick one as the 'repository' field",
    missingRepository: "No repository field.",
    brokenGitUrl: "Probably broken git url: %s",
    nonObjectScripts: "scripts must be an object",
    nonStringScript: "script values must be string commands",
    nonArrayFiles: "Invalid 'files' member",
    invalidFilename: "Invalid filename in 'files' list: %s",
    nonArrayBundleDependencies:
      "Invalid 'bundleDependencies' list. Must be array of package names",
    nonStringBundleDependency: "Invalid bundleDependencies member: %s",
    nonDependencyBundleDependency: "Non-dependency in bundleDependencies: %s",
    nonObjectDependencies: "%s field must be an object",
    nonStringDependency: "Invalid dependency: %s %s",
    deprecatedArrayDependencies: "specifying %s as array is deprecated",
    deprecatedModules: "modules field is deprecated",
    nonArrayKeywords: "keywords should be an array of strings",
    nonStringKeyword: "keywords should be an array of strings",
    conflictingName: "%s is also the name of a node core module.",
    nonStringDescription: "'description' field should be a string",
    missingDescription: "No description",
    missingReadme: "No README data",
    missingLicense: "No license field.",
    nonEmailUrlBugsString:
      "Bug string field must be url, email, or {email,url}",
    nonUrlBugsUrlField: "bugs.url field must be a string url. Deleted.",
    nonEmailBugsEmailField: "bugs.email field must be a string email. Deleted.",
    emptyNormalizedBugs:
      "Normalized value of bugs field is an empty object. Deleted.",
    nonUrlHomepage: "homepage field must be a string url. Deleted.",
    invalidLicense: "license should be a valid SPDX license expression",
    typo: "%s should probably be %s.",
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/make_warning.js
var require_make_warning2 = __commonJS((exports, module) => {
  var util = require("util")
  var messages = require_warning_messages2()
  module.exports = function () {
    var args = Array.prototype.slice.call(arguments, 0)
    var warningName = args.shift()
    if (warningName == "typo") {
      return makeTypoWarning.apply(null, args)
    } else {
      var msgTemplate = messages[warningName]
        ? messages[warningName]
        : warningName + ": '%s'"
      args.unshift(msgTemplate)
      return util.format.apply(null, args)
    }
  }
  function makeTypoWarning(providedName, probableName, field) {
    if (field) {
      providedName = field + "['" + providedName + "']"
      probableName = field + "['" + probableName + "']"
    }
    return util.format(messages.typo, providedName, probableName)
  }
})

// node_modules/meow/node_modules/normalize-package-data/lib/normalize.js
var require_normalize2 = __commonJS((exports, module) => {
  module.exports = normalize
  var fixer = require_fixer2()
  normalize.fixer = fixer
  var makeWarning = require_make_warning2()
  var fieldsToFix = [
    "name",
    "version",
    "description",
    "repository",
    "modules",
    "scripts",
    "files",
    "bin",
    "man",
    "bugs",
    "keywords",
    "readme",
    "homepage",
    "license",
  ]
  var otherThingsToFix = ["dependencies", "people", "typos"]
  var thingsToFix = fieldsToFix.map(function (fieldName) {
    return ucFirst(fieldName) + "Field"
  })
  thingsToFix = thingsToFix.concat(otherThingsToFix)
  function normalize(data, warn, strict) {
    if (warn === true) (warn = null), (strict = true)
    if (!strict) strict = false
    if (!warn || data.private) warn = function (msg) {}
    if (
      data.scripts &&
      data.scripts.install === "node-gyp rebuild" &&
      !data.scripts.preinstall
    ) {
      data.gypfile = true
    }
    fixer.warn = function () {
      warn(makeWarning.apply(null, arguments))
    }
    thingsToFix.forEach(function (thingName) {
      fixer["fix" + ucFirst(thingName)](data, strict)
    })
    data._id = data.name + "@" + data.version
  }
  function ucFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }
})

// node_modules/meow/index.js
var require_meow = __commonJS((exports, module) => {
  "use strict"
  var path = require("path")
  var buildParserOptions = require_minimist_options()
  var parseArguments = require_build()
  var camelCaseKeys = require_camelcase_keys()
  var decamelizeKeys = require_decamelize_keys()
  var trimNewlines = require_trim_newlines()
  var redent = require_redent()
  var readPkgUp = require_read_pkg_up()
  var hardRejection = require_hard_rejection()
  var normalizePackageData = require_normalize2()
  delete require.cache[__filename]
  var parentDir = path.dirname(
    module.parent && module.parent.filename ? module.parent.filename : ".",
  )
  var isFlagMissing = (flagName, definedFlags, receivedFlags, input) => {
    const flag = definedFlags[flagName]
    let isFlagRequired = true
    if (typeof flag.isRequired === "function") {
      isFlagRequired = flag.isRequired(receivedFlags, input)
      if (typeof isFlagRequired !== "boolean") {
        throw new TypeError(
          `Return value for isRequired callback should be of type boolean, but ${typeof isFlagRequired} was returned.`,
        )
      }
    }
    if (typeof receivedFlags[flagName] === "undefined") {
      return isFlagRequired
    }
    return flag.isMultiple && receivedFlags[flagName].length === 0
  }
  var getMissingRequiredFlags = (flags, receivedFlags, input) => {
    const missingRequiredFlags = []
    if (typeof flags === "undefined") {
      return []
    }
    for (const flagName of Object.keys(flags)) {
      if (
        flags[flagName].isRequired &&
        isFlagMissing(flagName, flags, receivedFlags, input)
      ) {
        missingRequiredFlags.push({ key: flagName, ...flags[flagName] })
      }
    }
    return missingRequiredFlags
  }
  var reportMissingRequiredFlags = (missingRequiredFlags) => {
    console.error(
      `Missing required flag${missingRequiredFlags.length > 1 ? "s" : ""}`,
    )
    for (const flag of missingRequiredFlags) {
      console.error(`	--${flag.key}${flag.alias ? `, -${flag.alias}` : ""}`)
    }
  }
  var reportUnknownFlags = (unknownFlags) => {
    console.error(
      [
        `Unknown flag${unknownFlags.length > 1 ? "s" : ""}`,
        ...unknownFlags,
      ].join("\n"),
    )
  }
  var buildParserFlags = ({ flags, booleanDefault }) => {
    const parserFlags = {}
    for (const [flagKey, flagValue] of Object.entries(flags)) {
      const flag = { ...flagValue }
      if (
        typeof booleanDefault !== "undefined" &&
        flag.type === "boolean" &&
        !Object.prototype.hasOwnProperty.call(flag, "default")
      ) {
        flag.default = flag.isMultiple ? [booleanDefault] : booleanDefault
      }
      if (flag.isMultiple) {
        flag.type = flag.type ? `${flag.type}-array` : "array"
        flag.default = flag.default || []
        delete flag.isMultiple
      }
      parserFlags[flagKey] = flag
    }
    return parserFlags
  }
  var validateFlags = (flags, options) => {
    for (const [flagKey, flagValue] of Object.entries(options.flags)) {
      if (
        flagKey !== "--" &&
        !flagValue.isMultiple &&
        Array.isArray(flags[flagKey])
      ) {
        throw new Error(`The flag --${flagKey} can only be set once.`)
      }
    }
  }
  var meow3 = (helpText, options) => {
    if (typeof helpText !== "string") {
      options = helpText
      helpText = ""
    }
    const foundPkg = readPkgUp.sync({
      cwd: parentDir,
      normalize: false,
    })
    options = {
      pkg: foundPkg ? foundPkg.packageJson : {},
      argv: process.argv.slice(2),
      flags: {},
      inferType: false,
      input: "string",
      help: helpText,
      autoHelp: true,
      autoVersion: true,
      booleanDefault: false,
      hardRejection: true,
      allowUnknownFlags: true,
      ...options,
    }
    if (options.hardRejection) {
      hardRejection()
    }
    let parserOptions = {
      arguments: options.input,
      ...buildParserFlags(options),
    }
    parserOptions = decamelizeKeys(parserOptions, "-", {
      exclude: ["stopEarly", "--"],
    })
    if (options.inferType) {
      delete parserOptions.arguments
    }
    parserOptions = buildParserOptions(parserOptions)
    parserOptions.configuration = {
      ...parserOptions.configuration,
      "greedy-arrays": false,
    }
    if (parserOptions["--"]) {
      parserOptions.configuration["populate--"] = true
    }
    if (!options.allowUnknownFlags) {
      parserOptions.configuration["unknown-options-as-args"] = true
    }
    const { pkg } = options
    const argv = parseArguments(options.argv, parserOptions)
    let help = redent(
      trimNewlines((options.help || "").replace(/\t+\n*$/, "")),
      2,
    )
    normalizePackageData(pkg)
    process.title = pkg.bin ? Object.keys(pkg.bin)[0] : pkg.name
    let { description } = options
    if (!description && description !== false) {
      ;({ description } = pkg)
    }
    help =
      (description
        ? `
  ${description}
`
        : "") +
      (help
        ? `
${help}
`
        : "\n")
    const showHelp = (code) => {
      console.log(help)
      process.exit(typeof code === "number" ? code : 2)
    }
    const showVersion = () => {
      console.log(
        typeof options.version === "string" ? options.version : pkg.version,
      )
      process.exit(0)
    }
    if (argv._.length === 0 && options.argv.length === 1) {
      if (argv.version === true && options.autoVersion) {
        showVersion()
      }
      if (argv.help === true && options.autoHelp) {
        showHelp(0)
      }
    }
    const input = argv._
    delete argv._
    if (!options.allowUnknownFlags) {
      const unknownFlags = input.filter(
        (item) => typeof item === "string" && item.startsWith("-"),
      )
      if (unknownFlags.length > 0) {
        reportUnknownFlags(unknownFlags)
        process.exit(2)
      }
    }
    const flags = camelCaseKeys(argv, { exclude: ["--", /^\w$/] })
    const unnormalizedFlags = { ...flags }
    validateFlags(flags, options)
    for (const flagValue of Object.values(options.flags)) {
      delete flags[flagValue.alias]
    }
    const missingRequiredFlags = getMissingRequiredFlags(
      options.flags,
      flags,
      input,
    )
    if (missingRequiredFlags.length > 0) {
      reportMissingRequiredFlags(missingRequiredFlags)
      process.exit(2)
    }
    return {
      input,
      flags,
      unnormalizedFlags,
      pkg,
      help,
      showHelp,
      showVersion,
    }
  }
  module.exports = meow3
})

// node_modules/reghex/dist/reghex-core.mjs
var require_reghex_core = __commonJS((exports) => {
  __export(exports, {
    _exec: () => _exec,
    _pattern: () => _pattern,
    _substr: () => _substr,
    match: () => match,
    parse: () => parse,
    tag: () => tag,
  })
  var isStickySupported = typeof /./g.sticky === "boolean"
  var _pattern = function (input) {
    if (typeof input === "function") {
      return input
    }
    var source = typeof input !== "string" ? input.source : input
    return isStickySupported
      ? new RegExp(source, "y")
      : new RegExp("^(?:" + source + ")", "g")
  }
  var _substr = function (state, pattern) {
    var end = state.index + pattern.length
    var sub = state.input.slice(state.index, end)
    if (sub === pattern) {
      state.index = end
      return sub
    }
  }
  var _exec = function (state, pattern) {
    if (typeof pattern === "function") {
      return pattern()
    }
    var match2
    if (isStickySupported) {
      pattern.lastIndex = state.index
      match2 = pattern.exec(state.input)
      state.index = pattern.lastIndex
    } else {
      pattern.lastIndex = 0
      match2 = pattern.exec(state.input.slice(state.input))
      state.index += pattern.lastIndex
    }
    return match2 && match2[0]
  }
  var tag = function (array, tag2) {
    array.tag = tag2
    return array
  }
  var parse = function (pattern) {
    return function (input) {
      var state = {
        input,
        index: 0,
      }
      return pattern(state)
    }
  }
  var match = function (_name) {
    throw new TypeError(
      "This match() function was not transformed. Ensure that the Babel plugin is set up correctly and try again.",
    )
  }
})

// node_modules/shellac/lib/parser.js
var require_parser = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", {
    value: true,
  })
  exports["default"] = void 0
  var _reghex = require_reghex_core()
  var _ignored_expression = (0, _reghex._pattern)(/([\s,]|#[^\n\r]+)+/)
  var ignored = function _ignored(state) {
    var last_index = state.index
    var match,
      node = []
    if ((match = (0, _reghex._exec)(state, _ignored_expression))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "ignored")
  }
  var _comment_line_expression = (0, _reghex._pattern)(/\/\/\s+/)
  var _comment_line_expression2 = (0, _reghex._pattern)(/[^\n\r]*/)
  var comment_line = function _comment_line(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _comment_line_expression)) {
      state.index = last_index
      return
    }
    if ((match = (0, _reghex._exec)(state, _comment_line_expression2))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    return (0, _reghex.tag)(node, "comment_line")
  }
  var _command_line_expression = (0, _reghex._pattern)(/\$\s+/)
  var _command_line_expression2 = (0, _reghex._pattern)(/.*/)
  var command_line = function _command_line(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _command_line_expression)) {
      state.index = last_index
      return
    }
    if ((match = (0, _reghex._exec)(state, _command_line_expression2))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "command_line")
  }
  var _logged_command_expression = (0, _reghex._pattern)(/\$\$\s+/)
  var _logged_command_expression2 = (0, _reghex._pattern)(/.*/)
  var logged_command = function _logged_command(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _logged_command_expression)) {
      state.index = last_index
      return
    }
    if ((match = (0, _reghex._exec)(state, _logged_command_expression2))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "logged_command")
  }
  var _identifier_expression = (0, _reghex._pattern)(/VALUE|FUNCTION/)
  var _identifier_expression2 = (0, _reghex._pattern)(/\d+/)
  var identifier = function _identifier(state) {
    var last_index = state.index
    var match,
      node = []
    if (!(0, _reghex._substr)(state, "#__")) {
      state.index = last_index
      return
    }
    if ((match = (0, _reghex._exec)(state, _identifier_expression))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    if (!(0, _reghex._substr)(state, "_")) {
      state.index = last_index
      return
    }
    if ((match = (0, _reghex._exec)(state, _identifier_expression2))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    if (!(0, _reghex._substr)(state, "__#")) {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "identifier")
  }
  var _variable_name_expression = (0, _reghex._pattern)(/\S+/)
  var variable_name = function _variable_name(state) {
    var last_index = state.index
    var match,
      node = []
    if ((match = (0, _reghex._exec)(state, _variable_name_expression))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "variable_name")
  }
  var _if_statement_expression = (0, _reghex._pattern)(/if\s+/)
  var if_statement = function _if_statement(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _if_statement_expression)) {
      state.index = last_index
      return
    }
    if ((match = identifier(state))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._substr)(state, "{")) {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if ((match = grammar(state))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._substr)(state, "}")) {
      state.index = last_index
      return
    }
    var index_0 = state.index
    var length_0 = node.length
    var index_2 = state.index
    if (!ignored(state)) {
      state.index = index_2
    }
    if (!(0, _reghex._substr)(state, "else")) {
      state.index = index_0
    }
    var index_2 = state.index
    if (!ignored(state)) {
      state.index = index_2
    }
    if (!(0, _reghex._substr)(state, "{")) {
      state.index = index_0
    }
    var index_2 = state.index
    if (!ignored(state)) {
      state.index = index_2
    }
    if ((match = grammar(state))) {
      node.push(match)
    } else {
      state.index = index_0
    }
    var index_2 = state.index
    if (!ignored(state)) {
      state.index = index_2
    }
    if (!(0, _reghex._substr)(state, "}")) {
      state.index = index_0
    }
    return (0, _reghex.tag)(node, "if_statement")
  }
  var _in_statement_expression = (0, _reghex._pattern)(/in\s+/)
  var in_statement = function _in_statement(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _in_statement_expression)) {
      state.index = last_index
      return
    }
    if ((match = identifier(state))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._substr)(state, "{")) {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if ((match = grammar(state))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._substr)(state, "}")) {
      state.index = last_index
      return
    }
    return (0, _reghex.tag)(node, "in_statement")
  }
  var _await_statement_expression = (0, _reghex._pattern)(/await\s+/)
  var await_statement = function _await_statement(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if (!(0, _reghex._exec)(state, _await_statement_expression)) {
      state.index = last_index
      return
    }
    if ((match = identifier(state))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    return (0, _reghex.tag)(node, "await_statement")
  }
  var _stdout_statement_expression = (0, _reghex._pattern)(/std(out|err)/)
  var _stdout_statement_expression2 = (0, _reghex._pattern)(/\s+>>\s+/)
  var stdout_statement = function _stdout_statement(state) {
    var last_index = state.index
    var match,
      node = []
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    if ((match = (0, _reghex._exec)(state, _stdout_statement_expression))) {
      node.push(match)
    } else {
      state.index = last_index
      return
    }
    if (!(0, _reghex._exec)(state, _stdout_statement_expression2)) {
      state.index = last_index
      return
    }
    var length_0 = node.length
    alternation_1: {
      block_1: {
        var index_1 = state.index
        if ((match = identifier(state))) {
          node.push(match)
        } else {
          node.length = length_0
          state.index = index_1
          break block_1
        }
        break alternation_1
      }
      if ((match = variable_name(state))) {
        node.push(match)
      } else {
        node.length = length_0
        state.index = last_index
        return
      }
    }
    var index_1 = state.index
    if (!ignored(state)) {
      state.index = index_1
    }
    return (0, _reghex.tag)(node, "stdout_statement")
  }
  var grammar = function _grammar(state) {
    var last_index = state.index
    var match,
      node = []
    loop_0: for (var iter_0 = 0; true; iter_0++) {
      var index_0 = state.index
      var length_0 = node.length
      alternation_1: {
        block_1: {
          var index_1 = state.index
          if (!ignored(state)) {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = comment_line(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = command_line(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = logged_command(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = if_statement(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = in_statement(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        block_1: {
          var index_1 = state.index
          if ((match = await_statement(state))) {
            node.push(match)
          } else {
            node.length = length_0
            state.index = index_1
            break block_1
          }
          break alternation_1
        }
        if ((match = stdout_statement(state))) {
          node.push(match)
        } else {
          if (iter_0) {
            state.index = index_0
            break loop_0
          }
          node.length = length_0
          state.index = last_index
          return
        }
      }
    }
    return (0, _reghex.tag)(node, "grammar")
  }
  var _default = (0, _reghex.parse)(grammar)
  exports["default"] = _default
})

// node_modules/shellac/lib/child-subshell/utils.js
var require_utils = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", { value: true })
  exports.trimFinalNewline = void 0
  var LF = "\n"
  var CR = "\r"
  var trimFinalNewline = (input) => {
    if (input[input.length - 1] === LF) {
      input = input.slice(0, input.length - 1)
    }
    if (input[input.length - 1] === CR) {
      input = input.slice(0, input.length - 1)
    }
    return input
  }
  exports.trimFinalNewline = trimFinalNewline
})

// node_modules/shellac/lib/child-subshell/command.js
var require_command = __commonJS((exports) => {
  "use strict"
  Object.defineProperty(exports, "__esModule", { value: true })
  var utils_1 = require_utils()
  var RUNNING_STATE
  ;(function (RUNNING_STATE2) {
    RUNNING_STATE2[(RUNNING_STATE2["INIT"] = 0)] = "INIT"
    RUNNING_STATE2[(RUNNING_STATE2["START"] = 1)] = "START"
    RUNNING_STATE2[(RUNNING_STATE2["END"] = 2)] = "END"
  })(RUNNING_STATE || (RUNNING_STATE = {}))
  var Command = class {
    constructor({ cwd, shell, cmd, interactive, pipe_logs = false }) {
      this.handleStdoutData = (data) => {
        const lines = utils_1.trimFinalNewline(data).split(/\r?\n/)
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i]
          const match = line.match(/__END_OF_COMMAND_\[(\d+)\]__/)
          if (match) {
            this.retCode = parseInt(match[1])
            setImmediate(this.finish)
            return
          } else {
            if (this.pipe_logs) process.stdout.write(line + "\n")
            this.stdout += line + "\n"
          }
          if (this.interactive) {
            this.interactive(line, this.handleStdinData)
          }
        }
      }
      this.handleStderrData = (data) => {
        if (this.pipe_logs) process.stderr.write(data)
        this.stderr += data
      }
      this.handleStdinData = (data) => {
        this.shell.getStdin().write(`${data}
`)
      }
      this.run = () => {
        let promiseResolve, promiseReject
        const promise = new Promise((resolve, reject) => {
          promiseResolve = resolve
          promiseReject = reject
        })
        this.promiseResolve = promiseResolve
        this.promiseReject = promiseReject
        this.promise = promise
        this.runningState = RUNNING_STATE.START
        this.shell.getStdin().write(this.exec)
        this.timer = setTimeout(() => {
          if (this.runningState !== RUNNING_STATE.END) {
            const obj = {
              retCode: -1,
              cmd: this.cmd,
            }
            this.promiseReject(obj)
          }
        }, 864e5)
        return promise.then(
          () => this,
          (e) => {
            process.stdout.write(`

SHELLAC COMMAND FAILED!
Executing: ${this.cmd} in ${this.cwd}

STDOUT:

`)
            process.stdout.write(`${this.stdout}

`)
            process.stdout.write(`STDERR:

${this.stderr}

`)
            this.shell.exit()
            throw e
          },
        )
      }
      this.finish = () => {
        this.runningState = RUNNING_STATE.END
        clearTimeout(this.timer)
        this.shell.getStdout().removeListener("data", this.handleStdoutData)
        this.shell.getStderr().removeListener("data", this.handleStderrData)
        const obj = {
          retCode: this.retCode,
          cmd: this.cmd,
        }
        if (this.retCode) {
          return this.promiseReject(obj)
        }
        return this.promiseResolve(obj)
      }
      this.shell = shell
      this.cmd = cmd
      this.cwd = cwd
      this.interactive = interactive
      this.exec = `cd ${cwd};
${this.cmd};echo __END_OF_COMMAND_[$?]__
`
      this.shell.getStdout().on("data", this.handleStdoutData)
      this.shell.getStderr().on("data", this.handleStderrData)
      this.runningState = RUNNING_STATE.INIT
      this.pipe_logs = pipe_logs
      this.stdout = ""
      this.stderr = ""
    }
  }
  exports.default = Command
})

// node_modules/shellac/lib/execute.js
var require_execute = __commonJS((exports) => {
  "use strict"
  var __importDefault =
    (exports && exports.__importDefault) ||
    function (mod) {
      return mod && mod.__esModule ? mod : { default: mod }
    }
  Object.defineProperty(exports, "__esModule", { value: true })
  exports.execute = void 0
  var command_1 = __importDefault(require_command())
  var utils_1 = require_utils()
  function IfStatement(chunk, context) {
    const { interps, last_cmd } = context
    const [[val_type, val_id], if_clause, else_clause] = chunk
    if (val_type !== "VALUE")
      throw new Error(
        "If statements only accept value interpolations, not functions.",
      )
    if (interps[val_id]) {
      return exports.execute(if_clause, context)
    } else if (else_clause) {
      return exports.execute(else_clause, context)
    } else {
      return last_cmd
    }
  }
  function Command(chunk, context) {
    const { interps, cwd, shell } = context
    const [str] = chunk
    const cmd = str.replace(/#__VALUE_(\d+)__#/g, (_, i) => interps[i])
    const command = new command_1.default({
      cwd,
      shell,
      cmd,
      pipe_logs: chunk.tag === "logged_command",
    })
    return command.run()
  }
  function InStatement(chunk, context) {
    const { interps } = context
    const [[val_type, val_id], in_clause] = chunk
    if (val_type !== "VALUE")
      throw new Error(
        "IN statements only accept value interpolations, not functions.",
      )
    const new_cwd = interps[val_id]
    if (!new_cwd || typeof new_cwd !== "string")
      throw new Error(
        `IN statements need a string value to set as the current working dir`,
      )
    return exports.execute(in_clause, {
      ...context,
      cwd: new_cwd,
    })
  }
  async function Grammar(chunk, context) {
    const { last_cmd } = context
    let new_last_cmd = last_cmd
    for (const sub of chunk) {
      new_last_cmd = await exports.execute(sub, {
        ...context,
        last_cmd: new_last_cmd,
      })
    }
    return new_last_cmd
  }
  async function Await(chunk, context) {
    const { interps, last_cmd } = context
    const [[val_type, val_id]] = chunk
    if (val_type !== "FUNCTION")
      throw new Error(
        "IN statements only accept function interpolations, not values.",
      )
    await interps[val_id]()
    return last_cmd
  }
  async function Stdout(chunk, context) {
    const { interps, last_cmd, captures } = context
    const [out_or_err, second] = chunk
    if (!(out_or_err === "stdout" || out_or_err === "stderr"))
      throw new Error(`Expected only 'stdout' or 'stderr', got: ${out_or_err}`)
    const capture = utils_1.trimFinalNewline(
      _optionalChain([last_cmd, "optionalAccess", (_2) => _2[out_or_err]]) ||
        "",
    )
    const tag = second.tag
    if (tag === "identifier") {
      const [val_type, val_id] = second
      if (val_type !== "FUNCTION")
        throw new Error(
          "STDOUT/STDERR statements only accept function interpolations, not values.",
        )
      await interps[val_id](capture)
    } else if (tag === "variable_name") {
      captures[second[0]] = capture
    } else {
      throw new Error(
        "STDOUT/STDERR statements expect a variable name or an interpolation function.",
      )
    }
    return last_cmd
  }
  var execute = async (chunk, context) => {
    if (Array.isArray(chunk)) {
      if (chunk.tag === "command_line" || chunk.tag === "logged_command") {
        return Command(chunk, context)
      } else if (chunk.tag === "if_statement") {
        return IfStatement(chunk, context)
      } else if (chunk.tag === "in_statement") {
        return InStatement(chunk, context)
      } else if (chunk.tag === "grammar") {
        return await Grammar(chunk, context)
      } else if (chunk.tag === "await_statement") {
        return await Await(chunk, context)
      } else if (chunk.tag === "stdout_statement") {
        return await Stdout(chunk, context)
      } else {
        return context.last_cmd
      }
    }
    return null
  }
  exports.execute = execute
})

// node_modules/shellac/lib/child-subshell/shell.js
var require_shell = __commonJS((exports) => {
  "use strict"
  var __importDefault =
    (exports && exports.__importDefault) ||
    function (mod) {
      return mod && mod.__esModule ? mod : { default: mod }
    }
  Object.defineProperty(exports, "__esModule", { value: true })
  var child_process_1 = __importDefault(require("child_process"))
  var Shell = class {
    constructor(env_passthrough = ["PATH"]) {
      const env = { PS1: "" }
      env_passthrough.forEach((key) => {
        env[key] = process.env[key]
      })
      this.process = child_process_1.default.spawn(
        "bash",
        ["--noprofile", "--norc"],
        {
          env,
        },
      )
      this.process.stdout.setEncoding("utf8")
      this.logger = (line) => {}
    }
    setLogger(logger) {
      this.logger = logger
    }
    getLogger() {
      return this.logger
    }
    getStdin() {
      return this.process.stdin
    }
    getStdout() {
      return this.process.stdout
    }
    getStderr() {
      return this.process.stderr
    }
    exit() {
      this.process.kill("SIGINT")
    }
  }
  exports.default = Shell
})

// node_modules/shellac/lib/index.js
var require_lib4 = __commonJS((exports) => {
  "use strict"
  var __importDefault =
    (exports && exports.__importDefault) ||
    function (mod) {
      return mod && mod.__esModule ? mod : { default: mod }
    }
  Object.defineProperty(exports, "__esModule", { value: true })
  exports.log_parse_result = exports.parser = void 0
  var parser_1 = __importDefault(require_parser())
  var execute_1 = require_execute()
  var shell_1 = __importDefault(require_shell())
  var utils_1 = require_utils()
  var parser = (str) => parser_1.default(str.trim())
  exports.parser = parser
  var log_parse_result = (chunk, depth = 0, solo = false) => {
    if (!chunk) return ""
    if (Array.isArray(chunk) && chunk.tag) {
      const indent = `${" ".repeat(depth)}`
      const newline = `${depth === 0 ? "" : "\n"}`
      return `${newline}${indent}${chunk.tag + ":"}${chunk
        .map((each) =>
          exports.log_parse_result(each, depth + 2, chunk.length === 1),
        )
        .join("")}`
    } else {
      const indent = solo ? "" : "\n" + " ".repeat(depth)
      return `${indent} ${chunk.trim()}`
    }
  }
  exports.log_parse_result = log_parse_result
  var _shellac = (cwd) => async (s, ...interps) => {
    let str = s[0]
    for (let i = 0; i < interps.length; i++) {
      const is_fn = typeof interps[i] === "function"
      const interp_placeholder = `#__${is_fn ? "FUNCTION_" : "VALUE_"}${i}__#`
      str += interp_placeholder + s[i + 1]
    }
    if (str.length === 0) throw new Error("Must provide statements")
    const parsed = exports.parser(str)
    if (!parsed || typeof parsed === "string") throw new Error("Parsing error!")
    const captures = {}
    const shell = new shell_1.default()
    const last_cmd = await execute_1.execute(parsed, {
      interps,
      last_cmd: null,
      cwd,
      captures,
      shell,
    })
    shell.exit()
    return {
      stdout: utils_1.trimFinalNewline(
        _optionalChain([last_cmd, "optionalAccess", (_3) => _3.stdout]) || "",
      ),
      stderr: utils_1.trimFinalNewline(
        _optionalChain([last_cmd, "optionalAccess", (_4) => _4.stderr]) || "",
      ),
      ...captures,
    }
  }
  var shellac3 = Object.assign(_shellac(process.cwd()), {
    in: (cwd) => _shellac(cwd),
  })
  exports.default = shellac3
})

// scripts.ts
var meow = __toModule(require_meow())
var shellac = __toModule(require_lib4())

// build-languages.ts
var build_languages_default = {
  abap: "abap/abap.contribution",
  apex: "apex/apex.contribution",
  azcli: "azcli/azcli.contribution",
  bat: "bat/bat.contribution",
  cameligo: "cameligo/cameligo.contribution",
  clojure: "clojure/clojure.contribution",
  coffee: "coffee/coffee.contribution",
  cpp: "cpp/cpp.contribution",
  csharp: "csharp/csharp.contribution",
  csp: "csp/csp.contribution",
  css: "css/css.contribution",
  dart: "dart/dart.contribution",
  dockerfile: "dockerfile/dockerfile.contribution",
  fsharp: "fsharp/fsharp.contribution",
  go: "go/go.contribution",
  graphql: "graphql/graphql.contribution",
  handlebars: "handlebars/handlebars.contribution",
  hcl: "hcl/hcl.contribution",
  html: "html/html.contribution",
  ini: "ini/ini.contribution",
  java: "java/java.contribution",
  javascript: "javascript/javascript.contribution",
  julia: "julia/julia.contribution",
  kotlin: "kotlin/kotlin.contribution",
  less: "less/less.contribution",
  lexon: "lexon/lexon.contribution",
  lua: "lua/lua.contribution",
  markdown: "markdown/markdown.contribution",
  mips: "mips/mips.contribution",
  msdax: "msdax/msdax.contribution",
  mysql: "mysql/mysql.contribution",
  "objective-c": "objective-c/objective-c.contribution",
  pascal: "pascal/pascal.contribution",
  pascaligo: "pascaligo/pascaligo.contribution",
  perl: "perl/perl.contribution",
  pgsql: "pgsql/pgsql.contribution",
  php: "php/php.contribution",
  postiats: "postiats/postiats.contribution",
  powerquery: "powerquery/powerquery.contribution",
  powershell: "powershell/powershell.contribution",
  pug: "pug/pug.contribution",
  python: "python/python.contribution",
  r: "r/r.contribution",
  razor: "razor/razor.contribution",
  redis: "redis/redis.contribution",
  redshift: "redshift/redshift.contribution",
  restructuredtext: "restructuredtext/restructuredtext.contribution",
  ruby: "ruby/ruby.contribution",
  rust: "rust/rust.contribution",
  sb: "sb/sb.contribution",
  scala: "scala/scala.contribution",
  scheme: "scheme/scheme.contribution",
  scss: "scss/scss.contribution",
  shell: "shell/shell.contribution",
  solidity: "solidity/solidity.contribution",
  sophia: "sophia/sophia.contribution",
  sql: "sql/sql.contribution",
  st: "st/st.contribution",
  swift: "swift/swift.contribution",
  systemverilog: "systemverilog/systemverilog.contribution",
  tcl: "tcl/tcl.contribution",
  twig: "twig/twig.contribution",
  typescript: "typescript/typescript.contribution",
  vb: "vb/vb.contribution",
  xml: "xml/xml.contribution",
  yaml: "yaml/yaml.contribution",
}

// scripts.ts
var cli = meow.default({})
var services = ["typescript", "css", "json", "html"]
switch (cli.input[0]) {
  case "copy-workers":
    shellac.default`
      $ git restore worker/package.json themes/package.json package.json
      $ mkdir -p dist/workers
      $ mkdir -p public/workers
      $ mkdir -p dist/css
      $ cp public/style.css dist/css/style.css
      $ for x in .next/static/workers/*.monaco.worker.js;do cp $x "dist/workers/\${x##.next/static/workers/}";done
      $ for x in .next/static/workers/*.monaco.worker.js;do cp $x "public/workers/\${x##.next/static/workers/}";done
    `
    break
  case "clean":
    shellac.default`
        $ rm -rf dist
      `
    break
  case "build":
    shellac.default`
      $$ rm -rf src/monaco/version.ts
      $$ echo "export default '${cli.pkg.version}'" > src/monaco/utils/version.ts
      $$ yarn script clean
      $$ yarn next build
      $$ yarn pkger build
      $$ yarn script build:languages
      $$ yarn script copy-workers
    `
    break
  case "build:plugins":
    shellac.default`
      $$ rm -rf .garage
      $$ yarn tsup ${services
        .map(
          (languageService) =>
            `./node_modules/monaco-${languageService}/release/esm/monaco.contribution.js`,
        )
        .join(" ")} ${Object.keys(build_languages_default)
      .map(
        (lang) =>
          `./node_modules/monaco-languages/release/esm/${build_languages_default[lang]}.js`,
      )
      .join(
        " ",
      )} --format iife --out-dir ./.garage/languages --external monaco-editor-core --external monaco-editor --legacy-output --minify
    `
  case "build:languages":
    shellac.default`
      $$ yarn patch-package
      $$ rm -rf .garage
      $$ mkdir -p .garage
      $$ yarn tsup ${services
        .map(
          (languageService) =>
            `./node_modules/monaco-${languageService}/release/esm/monaco.contribution.js`,
        )
        .join(" ")} ${Object.keys(build_languages_default)
      .map(
        (lang) =>
          `./node_modules/monaco-languages/release/esm/${build_languages_default[lang]}.js`,
      )
      .join(
        " ",
      )} --format iife --out-dir ./.garage/languages --external monaco-editor-core --external monaco-editor --legacy-output --minify
      $$ rm -rf public/languages
      $$ mkdir -p public/languages
      $$ rm -rf dist/languages
      $$ mkdir -p dist/languages
      $$ ${Object.keys(build_languages_default)
        .map(
          (lang) =>
            `cp .garage/languages/iife/monaco-languages/release/esm/${
              build_languages_default[lang]
            }.js public/languages/${build_languages_default[lang]
              .split("/")[1]
              .replace(".contribution", ".basic")}.js`,
        )
        .join(" && ")}
      $$ ${services
        .map(
          (languageService) =>
            `cp .garage/languages/iife/monaco-${languageService}/release/esm/monaco.contribution.js public/languages/${languageService}.service.js`,
        )
        .join(" && ")}

      $$ ${Object.keys(build_languages_default)
        .map(
          (lang) =>
            `cp .garage/languages/iife/monaco-languages/release/esm/${
              build_languages_default[lang]
            }.js dist/languages/${build_languages_default[lang]
              .split("/")[1]
              .replace(".contribution", ".basic")}.js`,
        )
        .join(" && ")}

      $$ ${services
        .map(
          (languageService) =>
            `cp .garage/languages/iife/monaco-${languageService}/release/esm/monaco.contribution.js dist/languages/${languageService}.service.js`,
        )
        .join(" && ")}`
}
