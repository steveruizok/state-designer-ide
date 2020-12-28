import { S, createState } from "@state-designer/react"
import { getCaptiveState, getStaticValues } from "lib/eval"
import { EventDetails } from "types"
import { findFirstTransitionTarget } from "utils"

import codePanelState from "./code-panel"
import consoleState from "./console"

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
    captive: createState({}),
    eventMap: {} as Record<string, EventDetails>,
  },
  initial: "loading",
  states: {
    loading: {
      on: {
        SOURCE_UPDATED: [
          {
            do: [
              "updateFromDatabase",
              "updateCodePanelState",
              "resetConsole",
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
        SOURCE_UPDATED: [
          "updateFromDatabase",
          "updateCodePanelState",
          "resetConsole",
          "createStatic",
          "createCaptiveState",
          "setEventMap",
        ],
        UNLOADED: { to: "loading" },
      },
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

      consoleState.send("RESET")
      codePanelState.send("SOURCE_LOADED", {
        state: stateCode,
        view: viewCode,
        static: staticCode,
      })
    },
    updateCodePanelState(data) {
      consoleState.send("RESET")
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
  },
})

export default projectState

export function collectEventsFromState(
  state: S.State<any, any>,
  data: any,
  acc: Record<string, EventDetails> = {},
) {
  for (let eventName in state.on) {
    let isSecondary = false
    for (let handler of state.on[eventName]) {
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
              to: findFirstTransitionTarget(
                data.captive.stateTree,
                target(data),
              ),
              isConditional,
              isSecondary,
            })
          } catch (e) {
            console.log("Error processing targets", e.message)
          }
        }

        // Once we've added a transition to this event,
        // all further events will be secondary: they'll only run if all
        // the event's prior transitions are conditional and fail to run.
        isSecondary = true
      }
    }
  }

  for (let child of Object.values(state.states)) {
    collectEventsFromState(child, data, acc)
  }

  return acc
}
