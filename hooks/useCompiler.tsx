import * as React from "react"
import * as Comlink from "comlink"
import { Transform } from "sucrase-browser"
import { WorkerApi } from "../workers/transpile.worker"

type Module = { exports: { [key: string]: any } }
type Folder<T> = { [key: string]: T | Folder<T> }
type Status = "loading" | "transpiling" | "ready"

export default function useCompiler<
  T = any,
  Files extends Record<string, string> = { index: string },
  Entry extends string & keyof Files = "index"
>({
  files,
  entry,
  scope = {},
  dependencies = {},
  onChange,
  onError,
  transforms = ["typescript", "jsx", "imports"],
  deps = [],
}: {
  files: Files
  entry: Entry
  dependencies?: Record<string, any>
  scope?: Record<string, any>
  onChange?: (result: T) => void
  onError?: (error: Error) => void
  deps?: any[]
  transforms?: Transform[]
}) {
  const rWorker = React.useRef<Worker>()
  const rWorkerAPI = React.useRef<Comlink.Remote<WorkerApi>>()
  const rSafeModules = React.useRef<Record<string, string> | null>(null)
  const rError = React.useRef<string>("")
  const [result, setResult] = React.useState<T>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [status, setStatus] = React.useState<Status>("loading")

  // Load the worker.
  React.useEffect(() => {
    setStatus("loading")

    rWorker.current = new Worker("../workers/transpile.worker", {
      type: "module",
    })
    rWorkerAPI.current = Comlink.wrap<WorkerApi>(rWorker.current)
    rWorkerAPI.current?.start().then(() => setStatus("transpiling"))

    return () => {
      rWorkerAPI.current?.stop()
      rWorker.current?.terminate()
    }
  }, [])

  // Handle changes.
  React.useEffect(() => {
    if (status === "loading") return

    // Transpile all of the files.
    Promise.all(
      Object.entries(files).map(
        async ([name, code]) =>
          [
            name,
            (await rWorkerAPI.current?.transpile(code, transforms)).code,
          ] as const,
      ),
    )
      .then((transformResult) => {
        // Form the results into an object.
        const modules = Object.fromEntries(transformResult)

        // Evaluate the modules, starting with the entry file.
        const result = evalModules(modules, entry, scope, dependencies)

        // Clear error, if we have one.
        if (rError.current) {
          rError.current = null
          onError && onError(null)
          setError(null)
        }

        // Set the result.
        setResult(result)

        // Save transformed modules as a backup.
        rSafeModules.current = modules

        // Update status.
        if (status === "transpiling") setStatus("ready")

        onChange && onChange(result)
      })
      .catch((e) => {
        // Get clean error message.
        let err = e.message
        const match = err.match(/(.*) \(/)
        if (match) err = match[1] + "."

        // If we have an (most likely thrown from the evalModules function)
        // update the error state -- but only if it is a new error.
        if (err !== rError.current) {
          setError(err)
          rError.current = err
          onError && onError(err)
        }

        // If we have modules that worked before, eval them again.
        if (rSafeModules.current) {
          evalModules(rSafeModules.current, entry, scope, dependencies)
        }
      })
  }, [files, entry, status, scope, dependencies, ...deps])

  return { error, status, result, modules: rSafeModules.current || {} }
}

function traverseWithPath(obj: { [key: string]: any }, path: string) {
  return path
    .replace("./", "")
    .split("/")
    .reduce((acc, cur) => acc[cur], obj)
}

function setWithPath(obj: { [key: string]: any }, path: string, value: any) {
  let cur = obj
  const steps = path.replace("./", "").split("/")
  for (let i = 0; i < steps.length; i++) {
    if (i === steps.length - 1) {
      cur[steps[i]] = value
    } else {
      cur = cur[steps[i]]
    }
  }
  return obj
}

function evalWithScope(code: string, scope: { [key: string]: any }) {
  return Function(...Object.keys(scope), code).call(
    null,
    ...Object.values(scope),
  )
}

function getModule(code: string, scope: { [key: string]: any }) {
  const exports = {}
  const module = { exports }

  const result = evalWithScope(code, {
    module,
    exports,
    ...scope,
  })

  return { result, module }
}

function evalModules(
  modules: Record<string, string>,
  entry: string,
  scope: Record<string, any> = {},
  dependencies: Record<string, any> = {},
) {
  const evaluated: Folder<Module> = {}

  const require = (path: string) => {
    if (path.startsWith("./")) {
      let module = traverseWithPath(evaluated, path)

      if (module === undefined) {
        const code = traverseWithPath(modules, path)
        const result = getModule(code, { require, ...scope })
        module = result.module
        setWithPath(evaluated, path, module)
      }

      return module.exports
    } else {
      return dependencies[path]
    }
  }

  return getModule(traverseWithPath(modules, entry), { require, ...scope })
    .result
}
