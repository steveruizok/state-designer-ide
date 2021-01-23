import scopeEval from "scope-eval"
import * as Comlink from "comlink"
import * as React from "react"

type Module = { exports: { [key: string]: any } }
type Folder = { [key: string]: Module | Folder }

import { WorkerApi } from "../workers/transpile.worker"

export default function useCodePreview<
  Files extends Record<string, string>,
  Entry extends keyof Files
>({
  files,
  entry,
  scope = {},
  dependencies = {},
  inline = false,
  onChange,
  transform,
  onError,
  deps = [],
}: {
  files: Files
  entry: string
  dependencies?: Record<string, any>
  scope?: Record<string, any>
  inline?: boolean
  transform?: (code: string) => string
  onChange?: () => void
  onError?: (error: string) => void
  deps?: any[]
}) {
  const previewRef = React.useRef<HTMLDivElement>()
  const rWorker = React.useRef<Worker>()
  const rWorkerAPI = React.useRef<Comlink.Remote<WorkerApi>>()
  const [error, setError] = React.useState<string | null>(null)
  const [code, setCode] = React.useState<string | null>(null)

  React.useEffect(() => {
    rWorker.current = new Worker("../workers/transpile.worker", {
      type: "module",
    })
    rWorkerAPI.current = Comlink.wrap<WorkerApi>(rWorker.current)
    rWorkerAPI.current?.start()

    return () => {
      rWorkerAPI.current?.stop()
      rWorker.current?.terminate()
    }
  }, [])

  React.useEffect(() => {
    setError(null)
    const elm = previewRef.current

    Promise.all(
      Object.entries(files).map(async ([name, code]) => {
        const transformResult = await rWorkerAPI.current?.transpile(code)
        return [name, transformResult.code] as const
      }),
    )
      .then((transformResults) => {
        const tFiles = Object.fromEntries(transformResults)
        const evaluated: Folder = {}

        const require = (path: string) => {
          if (path.startsWith("./")) {
            let mod = traverseWithPath(evaluated, path)

            if (mod === undefined) {
              const exports = {}
              const module: Module = { exports }
              const code = traverseWithPath(tFiles, path)

              scopeEval(code, {
                module,
                exports,
                require,
                elm,
                ...scope,
              })

              mod = module
              setWithPath(evaluated, path, mod)
            }

            return mod.exports
          } else {
            console.log(dependencies)
            return dependencies[path]
          }
        }

        const exports = {}
        const module = { exports }
        scopeEval(tFiles[entry], {
          module,
          exports,
          require,
          elm,
          ...scope,
        })

        setCode(tFiles[entry])
      })
      .catch((e) => {
        setError(e.message)
        onError && onError(e.message)
      })
  }, [files, scope, ...deps])

  return { previewRef, error, code }
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

// console.log(
//   setWithPath(
//     {
//       animals: {
//         cat: {
//           cute: true,
//         },
//       },
//     },
//     "./animals/cat",
//     false,
//   ),
// )
