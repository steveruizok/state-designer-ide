import * as React from "react"
import { S, useStateDesigner } from "@state-designer/react"
import ProjectState from "../state"
import Highlights from "../highlights"
import { styled, Button } from "components/theme"

const NodeEvents: React.FC<{ node: S.State<any, any> }> = ({ node }) => {
  const local = useStateDesigner(ProjectState)
  const events = Object.entries(node.on)
  const captiveData = local.data.captive.data

  return (
    <NodeEventsContainer>
      {events.map(([name, handlers], i) => {
        const payloadStringValue = "nothing" //local.data.code.payloads[name]

        let payload: any

        if (!!payloadStringValue) {
          try {
            const fn = Function("Static", `return ${payloadStringValue}`)
            payload = fn(local.data.code.static)
          } catch (e) {
            // suppress
          }
        }

        const isActive = node.active
        const canHandleEvent = local.data.captive.can(name, payload)
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

  React.useEffect(() => {
    Highlights.send("MOUNTED_EVENT_BUTTON", {
      name,
      ref: rButton,
      path: node.path,
    })
  })

  return (
    <Button
      ref={rButton}
      variant="nodeEvent"
      title={
        !isDisabled
          ? `Send ${name} event`
          : !isActive
          ? "Cannot send events when state is inactive."
          : "The state cannot handle this event due to its current payload."
      }
      // variant={"nodeEvent"}
      disabled={isDisabled}
      onClick={() => {
        ProjectState.data.captive.send(name)
        ProjectState.data.captive.getUpdate(({ active }) => {
          Highlights.send("CHANGED_ACTIVE_STATES", { active })
        })
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
  // py: 0,
  // px: 1,
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  maxWidth: 400,
  gap: 1,
})
