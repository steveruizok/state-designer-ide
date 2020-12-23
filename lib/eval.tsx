import * as Utils from "components/static/utils"
import Colors from "components/static/colors"
import { createState } from "@state-designer/react"
import { consoleState } from "components/project/console"

const regex = /:(.*):/g

function printFromState(...messages: any[]) {
  let message = messages
    .map((m) => (typeof m !== "string" ? JSON.stringify(m) : m))
    .join(", ")

  consoleState.send("LOGGED", { source: "state", message })
}

function printFromStatic(...messages: any[]) {
  let message = messages
    .map((m) => (typeof m !== "string" ? JSON.stringify(m) : m))
    .join(", ")

  consoleState.send("LOGGED", { source: "static", message })
}

function fakePrint(message: string | number | any) {}

/* --------------------- Values --------------------- */

export function getStaticValues(code: string, print = printFromStatic) {
  try {
    return Function(
      "Colors",
      "Utils",
      "print",
      `${code}\n\nreturn getStatic()`,
    )(Colors, Utils, print)
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
      "print",
      `return ${stateCode}`,
    )(createState, staticCode, Colors, Utils, print)
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
