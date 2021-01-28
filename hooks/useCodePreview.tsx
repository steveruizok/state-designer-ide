import * as Comlink from "comlink"
import * as React from "react"

import { WorkerApi } from "../workers/transpile.worker"
import { render } from "react-dom"

interface Props {
  code: string
  inline?: boolean
  scope?: Record<string, any>
  transform?: (code: string) => string
  onChange?: () => void
  onError?: (error: string) => void
  deps?: any[]
}

export default function useCodePreview({
  code,
  scope = {},
  inline = false,
  onChange,
  transform,
  onError,
  deps = [],
}: Props) {
  const previewRef = React.useRef<HTMLDivElement>()
  const rWorker = React.useRef<Worker>()
  const rWorkerAPI = React.useRef<Comlink.Remote<WorkerApi>>()
  const [error, setError] = React.useState<string | null>(null)

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
    const elm = previewRef.current
    setError(null)

    if (!elm) {
      setError("No container element found.")
      return
    }

    let transformed = code

    if (transform) {
      transformed = transform(code)
    }

    if (inline) {
      transformed = `function App() { return ${transformed} }`
    } else {
      if (!/App/.test(transformed)) {
        setError("Your code must include a component named App.")
        return
      }
    }

    transformed += `; render(<App/>, elm);`

    rWorkerAPI.current
      ?.transpile(transformed, ["jsx"])
      .then((result) => {
        if (result.code) {
          try {
            const args = ["React", "render", "elm", ...Object.keys(scope)]
            const vArgs = [React, render, elm, ...Object.values(scope)]

            const fn = new Function(...args, result.code)

            fn.call(null, ...vArgs)

            onChange && onChange()
          } catch (e) {
            setError(e.message)
            onError && onError(e.message)
          }
        } else {
          setError("Encountered an error")
        }
      })
      .catch((e: Error) => {
        setError(e.message)
        onError && onError(e.message)
      })
  }, [code, inline, ...deps])

  return { previewRef, error }
}
