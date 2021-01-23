import scopeEval from "scope-eval"
import * as React from "react"
import { render } from "react-dom"
import * as Comlink from "comlink"
import {
  TransformFailure,
  TransformResult,
} from "node_modules/esbuild-wasm/esm/browser.js"

import { WorkerApi } from "../workers/transpile.worker"

const worker = new Worker("../workers/transpile.worker", {
  type: "module",
})

const workerApi = Comlink.wrap<WorkerApi>(worker)
workerApi.start()

async function getConcatenatedCodeFromWorker(...args: any[]) {
  return "..."
}

async function getRunnableBundle<
  Files extends Record<string, string>,
  Entry extends keyof Files,
  Dependencies extends Record<string, any>
>({
  files,
  entry,
  scope,
  dependencies,
}: {
  files: Files
  entry: Entry
  scope: Record<string, any>
  dependencies: Dependencies
}) {
  const require = (path: keyof Dependencies) => dependencies[path]
  const exports = {}
  const modules = { exports }

  const concatenatedCode = await getConcatenatedCodeFromWorker(files, entry)
  const args = Object.keys(scope)
  const vargs = Object.values(scope)

  return () => Function(...args)(...vargs, concatenatedCode)
}

// const bundle = getRunnableBundle({
//   files: {
//     "name.ts": ` export const name = "Steve"`,
//     "index.ts": `import * as React from "reacy"
// 		 import { name } from "./
// 		 function App() {
// 		 	return <div>Hello {name}!</div>
// 		}

// 		 render(<App/>, elm)`,
//   },
//   entry: "index.ts",
//   scope: {
//     React,
//     render,
//     elm: document.getElementById("root"),
//   },
// })

// bundle.then((b) => b())
