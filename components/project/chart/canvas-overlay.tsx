import { useStateDesigner } from "@state-designer/react"
import { styled } from "components/theme"
import { MotionValue, motion } from "framer-motion"
import { getBoxToBoxArrow } from "perfect-arrows"
import * as React from "react"
import highlightsState from "states/highlights"

const CanvasOverlay: React.FC<{
  scale: MotionValue<number>
  offsetX: MotionValue<number>
  offsetY: MotionValue<number>
  width: MotionValue<number>
  height: MotionValue<number>
  resizeRef: React.RefObject<any>
}> = ({ scale, resizeRef, offsetX, offsetY, width, height }) => {
  const local = useStateDesigner(highlightsState)

  const rCanvas = React.useRef<HTMLCanvasElement>()
  const rCtx = React.useRef<CanvasRenderingContext2D>()

  const { event } = local.data

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

  const isDirty = React.useRef(false)

  React.useEffect(() => {
    const cvs = rCanvas.current
    const ctx = rCtx.current
    if (!ctx) return

    ctx.clearRect(0, 0, cvs.width, cvs.height)

    if (!event) return
    const { targets } = event

    if (targets.length > 0) {
      ctx.clearRect(0, 0, cvs.width, cvs.height)

      const sc = scale.get()
      const cFrame = getFrame(cvs, sc, 0, 0)

      for (let { from, to } of targets) {
        if (!(from && to)) return

        const fElm = from.current
        const tElm = to.current

        if (!(fElm && tElm)) return

        drawLineFromEventButtonToStateNode(
          ctx,
          getFrame(fElm, sc, cFrame.x, cFrame.y),
          getFrame(tElm, sc, cFrame.x, cFrame.y),
        )
      }
      isDirty.current = true
    } else if (isDirty.current) {
      ctx.clearRect(0, 0, cvs.width, cvs.height)
      isDirty.current = false
    }
  }, [event])

  return <CanvasContainer ref={rCanvas} />
}

const CanvasContainer = styled(motion.canvas, {
  position: "absolute",
  top: 0,
  left: 0,
  pointerEvents: "none",
})

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
