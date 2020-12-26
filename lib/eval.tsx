import { createState } from "@state-designer/react"
import { consoleState } from "components/project/console-panel"
import Colors from "components/static/colors"
import * as Utils from "components/static/utils"

function printFrom(source: string, ...messages: any[]) {
  let message = messages
    .map((m) => (typeof m === "string" ? m : JSON.stringify(m)))
    .join(", ")

  consoleState.send("LOGGED", { source, message })
}

export function printFromState(...messages: any[]) {
  return printFrom("state", ...messages)
}

export function printFromView(...messages: any[]) {
  return printFrom("view", ...messages)
}

export function printFromStatic(...messages: any[]) {
  return printFrom("static", ...messages)
}

function fakePrint(message: string | number | any) {}

/* --------------------- Values --------------------- */

export function getStaticValues(code: string, print = printFromStatic) {
  try {
    return Function(
      "Colors",
      "Utils",
      "log",
      "print",
      `${code}\n\nreturn getStatic()`,
    )(Colors, Utils, print, print)
  } catch (err) {
    throw new Error(err.message)
  }
}

export function getCaptiveState(
  stateCode: string,
  staticCode: string,
  print = printFromState,
) {
  try {
    return Function(
      "createState",
      "Static",
      "Colors",
      "Utils",
      "log",
      "print",
      `return ${stateCode.slice("export default ".length)}`,
    )(createState, staticCode, Colors, Utils, print, print)
  } catch (err) {
    throw new Error(err.message)
  }
}

/* --------------------- Errors --------------------- */

export function validateStaticCode(staticCode: string) {
  let error = ""
  try {
    getStaticValues(staticCode, fakePrint)
  } catch (err) {
    error = err.message
  }

  return error
}

export function validateStateCode(stateCode: string, staticCode: string) {
  let error = ""
  try {
    getCaptiveState(stateCode, staticCode, fakePrint)
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
  return !!code.match(/^export default createState\(\{\n.*?\n\}\)\n?$/gs)
}

export function validateStaticCodeFormat(code: string) {
  return !!code.match(/function getStatic\(\) \{\n.*?\}\n\}(\n?)$/gs)
}

export function validateViewCodeFormat(code: string) {
  return !!code.match(
    /(\n|^)import state from \"\.\/state\"\n\nfunction Component\(\) \{\n.*?\n\}\n?$/gs,
  )
}

export const codeFormatValidators = {
  state: validateStateCodeFormat,
  view: validateViewCodeFormat,
  static: validateStaticCodeFormat,
}
