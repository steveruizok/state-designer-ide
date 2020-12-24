import * as React from "react"
import { LayoutOffset } from "types"
import { motion, animate, MotionValue } from "framer-motion"
import { ui, resetOffsets } from "lib/local-data"
import router from "next/router"
import { styled } from "components/theme"

interface DragHandleProps {
  motionValue: MotionValue<number>
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
  motionValue,
  width,
  left,
  right,
  align,
  offset,
  onMove,
}: DragHandleHorizontalProps) {
  const [initial, setInitial] = React.useState(motionValue.get())

  React.useEffect(() => {
    setInitial(ui.panelOffsets[offset])
  }, [offset])

  // When at full width, double tap to return to normal
  // When at normal width, double tap to reach max
  function togglePosition(e: React.MouseEvent) {
    if (e.shiftKey) {
      resetOffsets()
      router.reload()
      return
    }

    const y = motionValue.get()

    if (align === "left" && y + initial === 0) {
      animate(motionValue, right + -initial, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else if (align === "right" && y + initial === 0) {
      animate(motionValue, -(left + initial), {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else {
      animate(motionValue, -initial, {
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
        x: motionValue,
        [align]: align === "left" ? width + initial - 3 : width - initial - 3,
      }}
      drag="x"
      dragConstraints={{
        left: -left - initial,
        right: right - initial,
      }}
      dragElastic={0.1}
      dragMomentum={false}
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
  motionValue,
  height,
  top,
  bottom,
  align,
  offset,
  onMove,
}: DragHandleVerticalProps) {
  const [initial, setInitial] = React.useState(motionValue.get())

  React.useEffect(() => {
    setInitial(ui.panelOffsets[offset])
  }, [offset])

  // When at full height, double tap to return to normal
  // When at normal height, double tap to reach max
  function togglePosition() {
    const y = motionValue.get()

    if (align === "top" && y + initial === 0) {
      animate(motionValue, bottom - initial, {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else if (align === "bottom" && y + initial === 0) {
      animate(motionValue, -(top + initial), {
        type: "spring",
        stiffness: 200,
        damping: 20,
      })
    } else {
      animate(motionValue, -initial, {
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
        y: motionValue,
        [align]: align === "top" ? height + initial - 3 : height - initial - 3,
      }}
      drag="y"
      dragConstraints={{
        top: -top - initial,
        bottom: bottom - initial,
      }}
      dragElastic={0.1}
      dragMomentum={false}
      onDoubleClick={togglePosition}
    />
  )
}

interface DragHandleHorizontalRelativeProps extends DragHandleProps {
  containerRef: React.RefObject<HTMLDivElement>
}

export function DragHandleHorizontalRelative({
  motionValue,
  containerRef,
  offset,
  onMove,
}: DragHandleHorizontalRelativeProps) {
  const [initial, setInitial] = React.useState(ui.panelOffsets[offset])

  React.useEffect(() => {
    setInitial(ui.panelOffsets[offset])
  }, [offset])

  // When at full width, double tap to return to normal
  // When at normal width, double tap to reach max
  function togglePosition() {
    animate(motionValue, -initial, {
      type: "spring",
      stiffness: 200,
      damping: 20,
    })
  }

  return (
    <DragHandle
      direction="horizontal"
      style={{
        x: motionValue,
        left: `calc(50% + ${initial - 2}px)`,
        position: "absolute",
        backgroundColor: "transparent",
        height: "100%",
        width: 4,
        cursor: "ew-resize",
        zIndex: 999,
      }}
      drag="x"
      dragConstraints={containerRef}
      dragElastic={0.1}
      dragMomentum={false}
      onDoubleClick={togglePosition}
    />
  )
}
