import { S, createState } from "@state-designer/react"
import last from "lodash/last"
import projectState from "states/project"
import { HighlightData } from "types"

const initialData: HighlightData = {
  event: null,
  state: null,
  path: null,
  scrollToLine: false,
  targets: [],
  eventButtonRefs: new Map([]),
  nodeRefs: new Map([]),
}

const highlightsState = createState({
  data: initialData,
  initial: "idle",
  states: {
    idle: {
      on: {
        HIGHLIT_EVENT: { do: "setEventHighlight", to: "highlit" },
        HIGHLIT_STATE: { do: "setStateHighlight", to: "highlit" },
      },
    },
    highlit: {
      on: {
        CHANGED_ACTIVE_STATES: {
          unless: "highlitStateIsActive",
          do: ["clearEventHighlight", "clearStateHighlight"],
          to: "idle",
        },
        CLEARED_HIGHLIGHTS: {
          do: ["clearEventHighlight", "clearStateHighlight"],
          to: "idle",
        },
        CLEARED_EVENT_HIGHLIGHT: {
          if: "eventIsAlreadyHighlit",
          do: "clearEventHighlight",
          to: "idle",
        },
        CLEARED_STATE_HIGHLIGHT: {
          if: "stateIsAlreadyHighlit",
          do: "clearStateHighlight",
          to: "idle",
        },
        HIGHLIT_EVENT: {
          unless: "eventIsAlreadyHighlit",
          do: ["clearEventHighlight", "setEventHighlight"],
        },
        HIGHLIT_STATE: {
          unless: "stateIsAlreadyHighlit",
          do: ["clearStateHighlight", "setStateHighlight"],
        },
      },
    },
  },
  on: {
    MOUNTED_NODE: "addNodeRef",
    UNMOUNTED_NODE: "deleteNodeRef",
    MOUNTED_EVENT_BUTTON: "addEventButtonRef",
    UNMOUNTED_EVENT_BUTTON: "deleteEventButtonRef",
  },
  conditions: {
    highlitStateIsActive(data, { active }) {
      return active.includes(data.state)
    },
    eventIsAlreadyHighlit(data, { eventName }) {
      return data.event === eventName
    },
    stateIsAlreadyHighlit(data, { path }) {
      return data.path === path
    },
  },
  actions: {
    setEventHighlight(data, { eventName, shiftKey, targets }) {
      data.state = null
      data.event = eventName
      data.targets = targets || []
      data.scrollToLine = shiftKey
    },
    setStateHighlight(data, { path, stateName, shiftKey }) {
      data.state = stateName
      data.path = path
      data.scrollToLine = shiftKey
    },
    clearStateHighlight(data) {
      data.state = null
      data.path = null
      data.scrollToLine = false
    },
    clearEventHighlight(data) {
      data.event = null
      data.targets = []
      data.scrollToLine = false
    },
    deleteNodeRef(data, { path, ref }) {
      data.nodeRefs.delete(path)
    },
    addNodeRef(data, { path, ref }) {
      data.nodeRefs.set(path, ref)
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
    highlitStateRef(data) {
      const current = data.nodeRefs.get(data.path)?.current
      if (!current) return null
      return current
    },
    highlitEventRef(data) {
      const { path, event, eventButtonRefs } = data
      if (path && event) {
        return eventButtonRefs.get(path + "_" + event)?.current
      }
    },
    targets(data) {
      const { targets, path, event, eventButtonRefs } = data

      const nodes = targets
        .map((path) =>
          last(
            findTransitionTargets(projectState.data.captive.stateTree, path),
          ),
        )
        .filter(Boolean)

      return nodes.map((node) => ({
        node,
        fromRef: eventButtonRefs.get(path + "_" + event)?.current,
        toRef: data.nodeRefs.get(node.path)?.current,
      }))
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
