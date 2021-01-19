import { useGesture } from "react-use-gesture"
import { useMotionValue, MotionValue } from "framer-motion"

export default function useScaleZooming(
  wheel: boolean = true,
  pinch: boolean = true,
  minZoom: number = 0.25,
  maxZoom: number = 2.5,
  mvScale: MotionValue<number>,
) {
  const bind = useGesture({
    onPinch: ({ delta }) => {
      const mv = mvScale
      const scale = mv.get()
      pinch &&
        mv.set(Math.max(minZoom, Math.min(maxZoom, scale - delta[1] / 60)))
    },
    onWheel: ({ vxvy: [, vy] }) => {
      const mv = mvScale
      const scale = mv.get()
      wheel && mv.set(Math.max(minZoom, Math.min(maxZoom, scale + vy / 30)))
    },
  })

  return { bind }
}
