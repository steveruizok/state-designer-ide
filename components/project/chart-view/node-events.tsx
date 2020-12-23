import * as React from "react"
import { S, useStateDesigner } from "@state-designer/react"
import ProjectState from "../state"
import { Highlights } from "../highlights"
import { styled, Button } from "components/theme"

const NodeEvents: React.FC<{ node: S.State<any, any> }> = ({ node }) => {
  const local = useStateDesigner(ProjectState)
  const captiveData = local.data.captive.data

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

  return (
    <NodeEventsContainer type={node.type}>
      {events.map(([name, handlers], i) => {
        const payloadStringValue = "nothing" //local.data.code.payloads[name]

        let payload: any

        if (!!payloadStringValue) {
          try {
            const fn = Function("Static", `return ${payloadStringValue}`)
            payload = fn(local.data.code.static)
          } catch (e) {}
        }

        const isActive = node.active

        let canHandleEvent = true

        try {
          canHandleEvent = local.data.captive.can(name, payload)
        } catch (e) {
          throw new Error("error while testing event")
        }

        const isDisabled = !isActive || !canHandleEvent

        let targets: string[] = []

        for (let handler of handlers) {
          if (handler.to.length > 0) {
            for (let transition of handler.to) {
              targets.push(transition(captiveData, payload, undefined))
            }
          }
        }

        return (
          <EventButton
            key={i}
            name={name}
            node={node}
            payload={payload}
            targets={targets}
            isDisabled={isDisabled}
            isActive={isActive}
          />
        )
      })}
    </NodeEventsContainer>
  )
}
export default NodeEvents

const EventButton: React.FC<{
  name: string
  node: S.State<any, any>
  payload: any
  targets: any
  isDisabled: boolean
  isActive: boolean
}> = ({ name, node, payload, targets, isDisabled, isActive }) => {
  const rButton = React.useRef<HTMLButtonElement>(null)
  const { captive } = ProjectState.data

  React.useEffect(() => {
    Highlights.send("MOUNTED_EVENT_BUTTON", {
      name,
      ref: rButton,
      path: node.path,
    })
  }, [])

  return (
    <Button
      ref={rButton}
      variant="nodeEvent"
      title={
        !isDisabled
          ? `Click to send the ${name} event`
          : !isActive
          ? "The state cannot handle events while it is inactive."
          : "The state cannot handle this event due to its current payload."
      }
      disabled={isDisabled}
      onClick={() => {
        captive.send(name, payload)
        captive.getUpdate(({ active }) =>
          Highlights.send("CHANGED_ACTIVE_STATES", { active }),
        )
      }}
      onMouseEnter={(e) => {
        e.stopPropagation()
        Highlights.send("HIGHLIT_EVENT", {
          eventName: name,
          shiftKey: e.shiftKey,
          targets,
        })
      }}
      onMouseLeave={() =>
        Highlights.send("CLEARED_EVENT_HIGHLIGHT", {
          eventName: name,
        })
      }
    >
      {name}
    </Button>
  )
}

const NodeEventsContainer = styled.div({
  px: "$0",
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  maxWidth: 400,
  gap: 1,
  variants: {
    type: {
      leaf: {
        pb: "$0",
      },
      branch: {},
      parallel: {},
    },
  },
})
