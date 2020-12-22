import * as Utils from "components/static/utils"
import Colors from "components/static/colors"
import { createState } from "@state-designer/react"

/* --------------------- Values --------------------- */

export function getStaticValues(code: string) {
  try {
    return Function(
      "Colors",
      "Utils",
      `${code}\n\nreturn getStatic()`,
    )(Colors, Utils)
  } catch (err) {
    throw new Error(err.message)
  }
}

export function getCaptiveState(stateCode: string, staticCode: string) {
  try {
    return Function(
      "createState",
      "Static",
      "Colors",
      "Utils",
      `return ${stateCode}`,
    )(createState, staticCode, Colors, Utils)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* --------------------- Errors --------------------- */

export function validateStaticCode(staticCode: string) {
  let error = ""
  try {
    getStaticValues(staticCode)
  } catch (err) {
    error = err.message
  }

  return error
}

export function validateStateCode(stateCode: string, staticCode: string) {
  let error = ""
  try {
    getCaptiveState(stateCode, staticCode)
  } catch (err) {
    error = err.message
  }

  return error
}

export const codeValidators = {
  state: validateStateCode,
  static: validateStaticCode,
}

/* --------------------- Format --------------------- */

export function validateStateCodeFormat(code: string) {
  return !!code.match(/^createState\(\{\n.*?\n\}\)\n?$/gs)
}

export function validateStaticCodeFormat(code: string) {
  return !!code.match(/function getStatic\(\) \{\n.*?\}\n\}(\n?)$/gs)
}

export function validateViewCodeFormat(code: string) {
  return !!code.match(/(\n|^)function Component\(\) \{\n.*?\n\}\n?$/gs)
}

export const codeFormatValidators = {
  state: validateStateCodeFormat,
  view: validateViewCodeFormat,
  static: validateStaticCodeFormat,
}
