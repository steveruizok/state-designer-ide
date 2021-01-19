import { IconButton } from "components/theme"
import { styled } from "components/theme"
import {
  MotionProps,
  MotionValue,
  motion,
  useAnimation,
  useMotionValue,
} from "framer-motion"
import usePreventZooming from "hooks/usePreventZooming"
import useScaleZooming from "hooks/useScaleZooming"
import * as React from "react"
import { Compass } from "react-feather"

interface CanvasProps extends MotionProps {
  mvScale?: MotionValue<number>
  fixed?: React.ReactNode
}

const Canvas = React.forwardRef<HTMLDivElement, CanvasProps>(
  ({ children, fixed, mvScale }, ref) => {
    const mvX = useMotionValue(0)
    const mvY = useMotionValue(0)
    const animation = useAnimation()

    usePreventZooming(ref as any)

    const { bind } = useScaleZooming(true, true, 0.25, 3, mvScale)

    function resetScrollPosition() {
      animation.start({ x: 0, y: 0, scale: 1 })
    }

    return (
      <CanvasContainer
        ref={ref}
        whileTap={{ userSelect: "none" }}
        onPan={(e, info) => {
          mvX.set(mvX.get() + info.delta.x)
          mvY.set(mvY.get() + info.delta.y)
        }}
        onDoubleClick={resetScrollPosition}
        {...bind()}
      >
        <CanvasInnerContainer
          style={{
            x: mvX,
            y: mvY,
            scale: mvScale,
          }}
          animate={animation}
          onDoubleClick={(e) => e.stopPropagation()}
        >
          {children}
        </CanvasInnerContainer>
        {fixed}
        <IconButton
          data-hidey="true"
          style={{ position: "absolute", bottom: 0, right: 0 }}
          title="Reset Canvas"
          onClick={() => resetScrollPosition()}
        >
          <Compass />
        </IconButton>
      </CanvasContainer>
    )
  },
)

export default Canvas

const CanvasContainer = styled(motion.div, {
  position: "relative",
  overflow: "hidden",
  height: "100%",
  width: "100%",
  cursor: "grab",
  userSelect: "none",
})

const CanvasInnerContainer = styled(motion.div, {
  height: "100%",
  width: "100%",
  display: "flex",
  placeContent: "center",
  placeItems: "center",
  position: "relative",
})
