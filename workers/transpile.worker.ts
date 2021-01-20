import * as Comlink from "comlink"

import {
  Service,
  TransformResult,
  startService,
} from "node_modules/esbuild-wasm/esm/browser.js"

let service: Service

async function start() {
  if (service) return

  await startService({
    wasmURL: "/esbuild.wasm",
  }).then((s) => (service = s))
}

async function transpile(code: string) {
  await start()

  let transformed: TransformResult

  transformed = await service
    .transform(code, {
      loader: "jsx",
      minify: false,
    })
    .catch((e) => (transformed = { ...e }))

  return transformed
}

async function stop() {
  service?.stop()
}

export interface WorkerApi {
  transpile: typeof transpile
  start: typeof start
  stop: typeof stop
}

const workerApi: WorkerApi = {
  transpile,
  start,
  stop,
}

Comlink.expose(workerApi)
