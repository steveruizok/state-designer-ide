import * as Comlink from "comlink"
import { transform } from "sucrase-browser"

// The start and stop functions are left over API from esbuild,
// I'm keeping it for now so that I don't have to change the
// useCode hook.

async function start() {}

async function transpile(code: string, transforms = []) {
  return transform(code, { transforms })
}

async function stop() {}

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
