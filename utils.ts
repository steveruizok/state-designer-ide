import { S } from "@state-designer/react"

export function single<T>(item: T | T[]) {
  return Array.isArray(item) ? item[0] : item
}

export function findTransitionTargets<G extends S.DesignedState<any, any>>(
  state: S.State<G>,
  path: string,
): S.State<G>[] {
  const acc: S.State<G>[] = []

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

export function findFirstTransitionTarget<G extends S.DesignedState<any, any>>(
  rootState: S.State<G>,
  path: string,
): S.State<G> {
  return findTransitionTargets(rootState, path)[0]
}

export function getNodeEvents(node: S.State<any>) {
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

export function getFlatStates(state: S.State<any>): S.State<any>[] {
  return [state, ...Object.values(state.states).flatMap(getFlatStates)]
}
