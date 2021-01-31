import { createState } from "@state-designer/react"
import Colors from "components/static/colors"
import * as Utils from "components/static/utils"
import consoleState from "states/console"

export const printFrom = function printFrom(
  source: string,
  ...messages: any[]
) {
  let message = messages
    .map((m) => (typeof m === "string" ? m : JSON.stringify(m, null, 2)))
    .join(", ")

  console.log(...messages)
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

export function fakePrint(...messages: any[]) {}

/* --------------------- Values --------------------- */

export function getStaticValues(staticCode: string, print = printFromStatic) {
  const code = staticCode.replace("export default ", "")
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
    let Static = getStaticValues(staticCode)
    const code = stateCode.replace("export default ", "")
    const scope = { createState, Static, Colors, Utils, print, log: print }
    return Function(...Object.keys(scope), `return ${code}`).call(
      null,
      ...Object.values(scope),
    )
  } catch (err) {
    throw new Error(err.message)
  }
}

/* --------------------- Errors --------------------- */

export function validateStaticCode(staticCode: string) {
  try {
    getStaticValues(staticCode, fakePrint)
  } catch (err) {
    return err.message
  }

  return ""
}

export function validateStateCode(stateCode: string, staticCode: string) {
  try {
    getCaptiveState(stateCode, staticCode, fakePrint)
  } catch (err) {
    return err.message
  }
  return ""
}

export const codeValidators = {
  state: validateStateCode,
  static: validateStaticCode,
}

/* --------------------- Format --------------------- */

export function validateStateCodeFormat(code: string) {
  return !!code.match(/^export default createState\(\{\n.*?\n\}\);\n$/gs)
}

export function validateViewCodeFormat(code: string) {
  // return true
  return !!code.match(
    /^import state from \'\.\/state\';\n(.*)export default function App\(\) \{\n.*?\n\}\n$/gs,
  )
}

export function validateStaticCodeFormat(code: string) {
  return !!code.match(/.*function getStatic\(\) \{\n.*?\};\n\}\n$/gs)
}

export const codeFormatValidators = {
  state: validateStateCodeFormat,
  view: validateViewCodeFormat,
  static: validateStaticCodeFormat,
}
