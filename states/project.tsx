import { S, createState } from "@state-designer/react"
import { getCaptiveState, getStaticValues } from "lib/eval"

import { EventDetails } from "types"
import codePanelState from "./code-panel"
import consoleState from "./console"
import { findFirstTransitionTarget } from "utils"
import liveViewState from "./live-view"

const projectState = createState({
  data: {
    oid: "",
    pid: "",
    name: "",
    code: {
      state: "",
      view: "",
      static: "",
    },
    static: undefined as any,
    captive: createState({ id: "loading" }),
    eventMap: {} as Record<string, EventDetails>,
  },
  initial: "loading",
  states: {
    loading: {
      on: {
        SOURCE_UPDATED: [
          { unless: "hasSource", break: true },
          {
            do: [
              "updateFromDatabase",
              "updateCodePanelState",
              "createStatic",
              "createCaptiveState",
              "setEventMap",
            ],
          },
          { wait: 1, to: "ready" },
        ],
      },
    },
    ready: {
      on: {
        RESET_STATE: {
          do: ["createStatic", "resetCaptiveState", "resetView"],
        },
        SOURCE_UPDATED: [
          {
            ifAny: ["captiveHasChanged", "staticHasChanged"],
            do: [
              "updateFromDatabase",
              "updateCodePanelState",
              "createStatic",
              "createCaptiveState",
              "setEventMap",
            ],
          },
        ],
        UNLOADED: { to: "loading" },
        CHANGED_SOURCE: { to: "loading" },
      },
    },
  },
  conditions: {
    hasSource(data, { source }) {
      return !!source
    },
    captiveHasChanged(data, { source }) {
      const { code } = data
      return code.state !== source.code.state
    },
    staticHasChanged(data, { source }) {
      const { code } = data
      return code.static !== source.code.static
    },
  },
  actions: {
    updateFromDatabase(data, { source, oid, pid }) {
      const name = source.name
      const stateCode = source.code.state
      const viewCode = source.code.view
      const staticCode = source.code.static

      data.code.state = stateCode
      data.code.view = viewCode
      data.code.static = staticCode
      data.name = name
      data.oid = oid
      data.pid = pid

      codePanelState.send("SOURCE_UPDATED", {
        state: stateCode,
        view: viewCode,
        static: staticCode,
      })
    },
    updateCodePanelState(data) {
      codePanelState.send("SOURCE_UPDATED", {
        state: data.code.state,
        view: data.code.view,
        static: data.code.static,
      })
    },
    createStatic(data) {
      try {
        data.static = getStaticValues(data.code.static)
      } catch (err) {
        console.error("Error building statics!", err.message)
      }
    },
    createCaptiveState(data) {
      try {
        data.captive = getCaptiveState(data.code.state, data.code.static)
      } catch (err) {
        console.error("Error building captive state!", err.message)
      }
    },
    resetConsole(data) {
      consoleState.send("RESET")
    },
    setEventMap(data) {
      data.eventMap = collectEventsFromState(data.captive.stateTree, data)
    },
    resetCaptiveState(data) {
      data.captive.reset()
    },
    resetView(data) {
      liveViewState.send("RESET_VIEW")
    },
  },
})

export default projectState

function processEventFromState(
  state: S.State<any, any>,
  data: any,
  eventName: string,
  event: S.EventHandler<any>,
  acc: Record<string, EventDetails> = {},
) {
  let isSecondary = false

  for (let handler of event) {
    if (acc[eventName] === undefined) {
      acc[eventName] = {
        eventName,
        states: new Set([]),
        targets: [],
      }
    }

    acc[eventName].states.add(state)

    if (handler.to.length > 0) {
      // As soon as a handler includes a condition,
      // then we know that transition might not run.
      const isConditional = !(
        handler.if.length > 0 ||
        handler.unless.length > 0 ||
        handler.ifAny.length > 0 ||
        handler.unlessAny.length > 0
      )

      for (let target of handler.to) {
        try {
          acc[eventName].targets.push({
            from: state,
            to: findFirstTransitionTarget(data.captive.stateTree, target(data)),
            isConditional,
            isSecondary,
          })
        } catch (e) {
          // console.log("Error processing targets", e.message)
        }
      }

      // Once we've added a transition to this event,
      // all further events will be secondary: they'll only run if all
      // the event's prior transitions are conditional and fail to run.
      isSecondary = true
    }
  }
}

export function collectEventsFromState(
  state: S.State<any, any>,
  data: any,
  acc: Record<string, EventDetails> = {},
) {
  for (let eventName in state.on) {
    processEventFromState(state, data, eventName, state.on[eventName], acc)
  }

  for (let autoEventName of ["onEnter", "onExit", "onEvent"]) {
    if (state[autoEventName] === undefined) continue
    processEventFromState(state, data, autoEventName, state[autoEventName], acc)
  }

  for (let child of Object.values(state.states)) {
    collectEventsFromState(child, data, acc)
  }

  return acc
}

// projectState.onUpdate((d) => console.log(d.active, d.log[0]))
