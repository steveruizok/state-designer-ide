import { S, createState } from "@state-designer/react"
import last from "lodash/last"
import projectState from "states/project"
import { EventDetails, HighlightData } from "types"

const initialData: HighlightData = {
  event: null,
  states: {},
  scrollToLine: false,
  eventButtonRefs: new Map([]),
  stateNodeRefs: new Map([]),
}

const highlightsState = createState({
  data: initialData,
  on: {
    CHANGED_ACTIVE_STATES: {
      do: ["clearEventHighlight"],
    },
    CLEARED_HIGHLIGHTS: {
      do: ["clearEventHighlight", "clearStateHighlight"],
    },
    CLEARED_EVENT_HIGHLIGHT: {
      if: "eventIsHighlit",
      do: "clearEventHighlight",
    },
    CLEARED_STATE_HIGHLIGHT: {
      if: "stateIsHighlit",
      do: "clearStateHighlight",
    },
    HIGHLIT_EVENT: {
      unless: "eventIsHighlit",
      do: ["clearEventHighlight", "setEventHighlight"],
    },
    HIGHLIT_STATE: {
      wait: 0.01,
      unless: "stateIsHighlit",
      do: ["clearStateHighlight", "setStateHighlight"],
    },
    MOUNTED_NODE: "addStateNodeRef",
    UNMOUNTED_NODE: "deleteNodeRef",
    MOUNTED_EVENT_BUTTON: "addEventButtonRef",
    UNMOUNTED_EVENT_BUTTON: "deleteEventButtonRef",
  },
  conditions: {
    isHighlightingDifferentEvent(data, { eventName }) {
      return data.event?.eventName !== eventName
    },
    eventIsHighlit(data, { eventName }) {
      return data.event?.eventName === eventName
    },
    stateIsHighlit(data, { path }) {
      return data.states[path] !== undefined
    },
  },
  actions: {
    setEventHighlight(
      data,
      {
        eventName,
        statePaths,
        targets,
        shiftKey,
      }: {
        eventName: string
        statePaths: string[]
        targets: {
          from: string
          to: string
        }[]

        shiftKey: boolean
      },
    ) {
      const { eventButtonRefs, stateNodeRefs } = data

      data.event = {
        eventName,
        statePaths,
        targets: targets.map((target) => ({
          from: eventButtonRefs.get(target.from + "_" + eventName),
          to: stateNodeRefs.get(target.to),
        })),
      }

      data.scrollToLine = shiftKey
    },
    setStateHighlight(data, { path, stateName, shiftKey }) {
      data.states[path] = { path, name: stateName }
      data.scrollToLine = shiftKey
    },
    clearStateHighlight(data, { path }) {
      delete data.states[path]
    },
    clearEventHighlight(data) {
      data.event = null
      data.scrollToLine = false
    },
    deleteNodeRef(data, { path }) {
      data.stateNodeRefs.delete(path)
    },
    addStateNodeRef(data, { path, ref }) {
      data.stateNodeRefs.set(path, ref)
    },
    addEventButtonRef(
      data,
      { id, ref }: { id: string; ref: React.RefObject<HTMLDivElement> },
    ) {
      data.eventButtonRefs.set(id, ref)
    },
    deleteEventButtonRef(data, { id }) {
      data.eventButtonRefs.delete(id)
    },
  },
  values: {
    highlitEventName(data) {
      if (data.event) {
        return data.event.eventName
      }
    },
    highlitStates(data) {
      return Object.values(data.states).map((state) => {
        return {
          ...state,
          ref: data.stateNodeRefs.get(state.path),
        }
      })
    },
    highlitStateRef(data) {
      // const current = data.nodeRefs.get(data.path)?.current
      // if (!current) return null
      // return current
    },
    highlitEventRef(data) {
      // const { path, event, eventButtonRefs } = data
      // if (path && event) {
      //   return eventButtonRefs.get(path + "_" + event)?.current
      // }
    },
    targets(data) {
      return []
      // const { targets, path, event, eventButtonRefs } = data
      // const nodes = targets
      //   .map((path) =>
      //     last(
      //       findTransitionTargets(projectState.data.captive.stateTree, path),
      //     ),
      //   )
      //   .filter(Boolean)
      // return nodes.map((node) => ({
      //   node,
      //   fromRef: eventButtonRefs.get(path + "_" + event)?.current,
      //   toRef: data.nodeRefs.get(node.path)?.current,
      // }))
    },
  },
})

// Helper (copied from @state-designer/core)

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

export default highlightsState
