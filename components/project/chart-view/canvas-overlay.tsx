import * as React from "react"
import { MotionValue, motion } from "framer-motion"
import { S, useStateDesigner } from "@state-designer/react"
import ProjectState from "../state"
import { Highlights } from "../highlights"
import { quadrant, theta, normal, gradient } from "./helpers"
import { getBoxToBoxArrow } from "perfect-arrows"

const CanvasOverlay: React.FC<{
  scale: MotionValue<number>
  offsetX: MotionValue<number>
  offsetY: MotionValue<number>
  width: MotionValue<number>
  height: MotionValue<number>
  resizeRef: React.RefObject<any>
}> = ({ scale, resizeRef, offsetX, offsetY, width, height }) => {
  // const captive = useStateDesigner(ProjectState.data.captive)
  const local = useStateDesigner(Highlights)

  const rCanvas = React.useRef<HTMLCanvasElement>()
  const rCtx = React.useRef<CanvasRenderingContext2D>()

  React.useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = rCanvas.current
      if (!canvas) return
      const w = width.get()
      const h = height.get()
      var dpr = window.devicePixelRatio || 1
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.setProperty("transform-origin", `top left`)
      canvas.style.setProperty("transform", `scale(${1 / dpr})`)
      rCtx.current = canvas.getContext("2d") as CanvasRenderingContext2D
      rCtx.current.scale(dpr, dpr)
    }

    updateCanvasSize()

    const unsubs = [
      width.onChange(updateCanvasSize),
      height.onChange(updateCanvasSize),
    ]

    return () => unsubs.forEach((fn) => fn())
  }, [])

  React.useEffect(() => {
    const cvs = rCanvas.current
    const ctx = rCtx.current
    if (!ctx) return

    const sc = scale.get()

    ctx.clearRect(0, 0, cvs.width, cvs.height)

    const { highlitStateRef: hl, targets } = local.values

    if (hl) {
      const cFrame = getFrame(cvs, sc, 0, 0)

      const hFrame = getFrame(hl, sc, cFrame.x, cFrame.y)

      if (local.data.event) {
        const eventButtons = local.data.eventButtonRefs
        if (!eventButtons) {
          return
        }
        const pathEvents = eventButtons.get(local.data.path)
        if (!pathEvents) {
          return
        }
        const buttonRef = pathEvents.get(local.data.event)

        if (!buttonRef) return

        const button = buttonRef.current

        if (!button) return

        const bFrame = getFrame(button, sc, cFrame.x, cFrame.y)

        // fillRectWithScale(ctx, bFrame, sc)

        if (targets) {
          for (let target of targets) {
            const targ = target.ref.current
            if (!targ) continue

            const tFrame = getFrame(targ, sc, cFrame.x, cFrame.y)

            // fillRectWithScale(ctx, tFrame, sc)
            drawLineFromEventButtonToStateNode(ctx, bFrame, tFrame)
          }
        }
      }
    }
  }, [local.values.highlitStateRef, local.values.targets])

  // React.useEffect(() => {
  //   console.log("Targets", local.values.targets)
  // }, [local.values.targets])

  return (
    <motion.canvas
      ref={rCanvas}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      }}
    />
  )
}

export default CanvasOverlay

// Helpers

interface Point {
  x: number
  y: number
}

interface Rect extends Point {
  width: number
  height: number
}

interface Frame extends Rect {
  midX: number
  midY: number
  maxX: number
  maxY: number
  center: Point
}

function getFrame(
  el: HTMLElement,
  scale: number,
  offsetX: number,
  offsetY: number,
): Frame {
  const rect = el.getBoundingClientRect()
  let x = rect.left
  let y = rect.top
  let w = rect.right - rect.left
  let h = rect.bottom - rect.top

  x /= scale
  y /= scale
  w /= scale
  h /= scale

  x -= offsetX
  y -= offsetY

  return {
    x: x,
    y: y,
    width: w,
    height: h,
    midX: x + w / 2,
    midY: y + h / 2,
    maxX: x + w,
    maxY: y + h,
    center: {
      x: x + w / 2,
      y: y + h / 2,
    },
  }
}

function fillRectWithScale(
  ctx: CanvasRenderingContext2D,
  frame: Frame,
  scale: number,
) {
  ctx.save()
  ctx.fillStyle = "rgba(0, 121, 242, .08)"
  ctx.fillRect(frame.x, frame.y, frame.width, frame.height)
  ctx.restore()
}

function drawLineFromEventButtonToStateNode(
  ctx: CanvasRenderingContext2D,
  a: Frame,
  b: Frame,
) {
  const arrow = getBoxToBoxArrow(
    a.x,
    a.y,
    a.width,
    a.height,
    b.x,
    b.y,
    b.width,
    b.height,
    {
      padStart: 0,
      padEnd: 0,
      bow: 0.12,
      stretch: 0,
    },
  )

  const [sx, sy, cx, cy, ex, ey, ae] = arrow

  ctx.save()
  ctx.beginPath()

  ctx.moveTo(sx, sy)
  ctx.quadraticCurveTo(cx, cy, ex, ey)

  ctx.strokeStyle = "rgba(0,0,0,1)"
  ctx.lineWidth = 6
  ctx.stroke()

  ctx.beginPath()
  drawDot(ctx, sx, sy, 5)
  drawArrowhead(ctx, ex, ey, ae)

  ctx.strokeStyle = "rgba(0,0,0,1)"
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.fillStyle = "red"
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(sx, sy)
  ctx.quadraticCurveTo(cx, cy, ex, ey)

  ctx.strokeStyle = "red"
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.restore()
}

function drawArrowhead(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  angle: number,
  color = "#000",
) {
  var dpr = window.devicePixelRatio || 1
  ctx.translate(x, y)
  ctx.rotate(angle)
  ctx.moveTo(0, 0)
  ctx.lineTo(0, 0 + 6)
  ctx.lineTo(0 + 12, 0)
  ctx.lineTo(0, 0 - 6)
  ctx.lineTo(0, 0)
  ctx.resetTransform()
  ctx.scale(dpr, dpr)
}

function drawDot(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r = 4,
  color = "#000",
) {
  ctx.moveTo(x + r, y)
  ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2)
}
