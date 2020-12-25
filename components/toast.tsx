import * as React from "react"
import { X } from "react-feather"
import { styled, Text, IconButton } from "components/theme"
import { useStateDesigner } from "@state-designer/react"
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion"
import { ToastMessage } from "types"
import toastState from "states/toast"

export default function Toast() {
  const local = useStateDesigner(toastState)

  return (
    <AnimateSharedLayout>
      <ToastContainer layout>
        <AnimatePresence>
          {Object.values(local.data.toasts).map((toast) => (
            <Message key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
      </ToastContainer>
    </AnimateSharedLayout>
  )
}

function Message({ id, message, autohide = true }: ToastMessage) {
  React.useEffect(() => {
    if (!autohide) return

    const timeout = setTimeout(
      () => toastState.send("DISMISSED_TOAST", { id }),
      3000,
    )
    return () => clearTimeout(timeout)
  }, [autohide])

  return (
    <MessageContainer
      layoutId={id}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        x: 16,
        transition: {
          type: "spring",
          damping: 20,
          stiffness: 300,
        },
      }}
      transition={{
        type: "spring",
        damping: 24,
        stiffness: 200,
      }}
    >
      <Text>{message}</Text>
      <IconButton onClick={() => toastState.send("DISMISSED_TOAST", { id })}>
        <X />
      </IconButton>
    </MessageContainer>
  )
}

const ToastContainer = styled(motion.div, {
  position: "fixed",
  bottom: 24,
  width: "100%",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  pointerEvents: "none",
  flexDirection: "column-reverse",
  variants: {
    type: {
      warn: {},
      success: {},
      action: {},
    },
  },
})

const MessageContainer = styled(motion.div, {
  pointerEvents: "all",
  display: "flex",
  alignItems: "center",
  bg: "$toastBg",
  color: "$text",
  width: "fit-content",
  borderRadius: 8,
  fontSize: "$0",
  border: "1px solid $shadow",
  boxShadow: "0 6px 24px $shadow",
  pl: "$2",
  pr: "$0",
  py: "$0",
  mt: "$1",
  [`${IconButton}`]: {
    ml: "$1",
  },
})
