import { S } from "@state-designer/react"

export function single<T>(item: T | T[]) {
  return Array.isArray(item) ? item[0] : item
}

export function findTransitionTargets<D = any>(
  state: S.State<D, any>,
  path: string,
): S.State<D, any>[] {
  const acc: S.State<D, any>[] = []

  let safePath = path.startsWith(".") ? path : "." + path

  if (path.endsWith(".previous")) {
    safePath = path.split(".previous")[0]
  }

  if (path.endsWith(".restore")) {
    safePath = path.split(".restore")[0]
  }

  if (state.path.endsWith(safePath)) {
    acc.push(state)
  }

  for (let childState of Object.values(state.states)) {
    acc.push(...findTransitionTargets(childState, path))
  }

  return acc
}

export function findFirstTransitionTarget<D = any>(
  rootState: S.State<D, any>,
  path: string,
): S.State<D, any> {
  return findTransitionTargets(rootState, path)[0]
}

export function getNodeEvents(node: S.State<any, any>) {
  const events = Object.entries(node.on)

  if (node.onEvent) {
    events.unshift(["onEvent", node.onEvent])
  }

  if (node.onExit) {
    events.unshift(["onExit", node.onExit])
  }

  if (node.onEnter) {
    events.unshift(["onEnter", node.onEnter])
  }

  return events
}
