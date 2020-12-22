import * as React from "react"
import { LayoutOffset } from "types"
import { motion, useMotionValue, animate } from "framer-motion"
import { panelOffsets, setPanelOffset } from "lib/local-data"
import { styled } from "components/theme"

interface DragHandleProps {
  offset: LayoutOffset
  onMove?: (size: number) => void
}

interface DragHandleHorizontalProps extends DragHandleProps {
  width: number
  left: number
  right: number
  align: "left" | "right"
}

const DragHandle = styled(motion.div, {
  position: "absolute",
  backgroundColor: "transparent",
  zIndex: 999,
  "&:hover": {
    bg: "$hover",
  },
  variants: {
    direction: {
      horizontal: {
        width: "100%",
        height: 4,
        cursor: "ns-resize",
      },
      vertical: {
        width: 4,
        height: "100%",
        cursor: "ew-resize",
      },
    },
  },
})

export function DragHandleHorizontal({
  width,
  left,
  right,
  align,
  offset,
  onMove,
}: DragHandleHorizontalProps) {
  const rMotionX = useMotionValue(0)
  const [distance, setDistance] = React.useState(panelOffsets[offset])

  React.useEffect(() => {
    setDistance(panelOffsets[offset])
  }, [offset])

  React.useEffect(() => {
    return rMotionX.onChange((v) => {
      onMove && onMove(distance - v)
      setPanelOffset(offset, distance + v)
    })
  }, [distance, offset, rMotionX])

  // When at full width, double tap to return to normal
  // When at normal width, double tap to reach max
  function togglePosition() {
    const y = rMotionX.get()

    if (align === "left" && y + distance === 0) {
      animate(rMotionX, right + -distance, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else if (align === "right" && y + distance === 0) {
      animate(rMotionX, -(left + distance), {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else {
      animate(rMotionX, -distance, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    }
  }

  return (
    <DragHandle
      direction="vertical"
      style={{
        x: rMotionX,
        [align]: align === "left" ? width + distance - 3 : width - distance - 3,
      }}
      drag="x"
      dragConstraints={{
        left: -left - distance,
        right: right - distance,
      }}
      dragElastic={0.1}
      onDoubleClick={togglePosition}
    />
  )
}

interface DragHandleVerticalProps extends DragHandleProps {
  height: number
  top: number
  bottom: number
  align: "top" | "bottom"
}

export function DragHandleVertical({
  height,
  top,
  bottom,
  align,
  offset,
  onMove,
}: DragHandleVerticalProps) {
  const [distance, setDistance] = React.useState(panelOffsets[offset])

  React.useEffect(() => {
    setDistance(panelOffsets[offset])
  }, [offset])

  const rMotionY = useMotionValue(0)

  React.useEffect(() => {
    return rMotionY.onChange((v) => {
      onMove && onMove(distance - v)
      setPanelOffset(offset, distance + v)
    })
  }, [distance, offset, rMotionY])

  // When at full height, double tap to return to normal
  // When at normal height, double tap to reach max
  function togglePosition() {
    const y = rMotionY.get()

    if (align === "top" && y + distance === 0) {
      animate(rMotionY, bottom - distance, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else if (align === "bottom" && y + distance === 0) {
      animate(rMotionY, -(top + distance), {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else {
      animate(rMotionY, -distance, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    }
  }

  return (
    <DragHandle
      direction="horizontal"
      style={{
        [align]:
          align === "top" ? height + distance - 3 : height - distance - 3,
        y: rMotionY,
      }}
      drag="y"
      dragConstraints={{
        top: -top - distance,
        bottom: bottom - distance,
      }}
      dragElastic={0.1}
      onDoubleClick={togglePosition}
    />
  )
}

interface DragHandleHorizontalRelativeProps extends DragHandleProps {
  containerRef: React.RefObject<HTMLDivElement>
}

export function DragHandleHorizontalRelative({
  containerRef,
  offset,
  onMove,
}: DragHandleHorizontalRelativeProps) {
  const rMotionX = useMotionValue(0)
  const [distance, setDistance] = React.useState(panelOffsets[offset])

  React.useEffect(() => {
    setDistance(panelOffsets[offset])
  }, [offset])

  React.useEffect(() => {
    return rMotionX.onChange((v) => {
      onMove && onMove(distance - v)
      setPanelOffset(offset, distance + v)
    })
  }, [distance, offset, rMotionX])

  // When at full width, double tap to return to normal
  // When at normal width, double tap to reach max
  function togglePosition() {
    animate(rMotionX, -distance, {
      type: "spring",
      stiffness: 200,
      damping: 20,
    })
  }

  return (
    <DragHandle
      direction="horizontal"
      style={{
        x: rMotionX,
        left: `calc(50% + ${distance - 2}px)`,
        position: "absolute",
        backgroundColor: "transparent",
        height: "100%",
        width: 4,
        cursor: "ew-resize",
      }}
      drag="x"
      dragConstraints={containerRef}
      dragElastic={0.1}
      onDoubleClick={togglePosition}
    />
  )
}
