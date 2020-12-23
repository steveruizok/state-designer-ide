import * as React from "react"
import uniqueId from "lodash/uniqueId"
import { X } from "react-feather"
import { styled, Text, IconButton } from "components/theme"
import { createState, useStateDesigner } from "@state-designer/react"
import { motion, AnimateSharedLayout, AnimatePresence } from "framer-motion"

interface ToastMessage {
  id: string
  message: string
  autohide?: boolean
}

export const toastState = createState({
  data: {
    toasts: {} as Record<string, ToastMessage>,
  },
  on: {
    ADDED_TOAST: "showToast",
    DISMISSED_TOAST: "dismissToast",
  },
  actions: {
    showToast(data, payload: { message: string }) {
      const { message } = payload
      const id = uniqueId()
      data.toasts[id] = { id, message }
    },
    dismissToast(data, payload: { id: string }) {
      const { id } = payload
      delete data.toasts[id]
    },
  },
})

export default function Toast() {
  const local = useStateDesigner(toastState)

  React.useEffect(() => {
    toastState.send("ADDED_TOAST", {
      message: "Hello world!" + Math.random().toFixed(2),
    })
  }, [])

  return (
    <AnimateSharedLayout>
      <ToastContainer layout>
        <AnimatePresence>
          {Object.values(local.data.toasts).map((toast) => (
            <Message key={toast.id} {...toast} />
          ))}
        </AnimatePresence>
        <button
          style={{ pointerEvents: "all" }}
          onClick={() =>
            toastState.send("ADDED_TOAST", {
              message: "Hello world!" + Math.random().toFixed(2),
            })
          }
        >
          Add Toast
        </button>
      </ToastContainer>
    </AnimateSharedLayout>
  )
}

function Message({ id, message, autohide = true }: ToastMessage) {
  React.useEffect(() => {
    if (!autohide) return

    const timeout = setTimeout(
      () => toastState.send("DISMISSED_TOAST", { id }),
      5000,
    )
    return () => clearTimeout(timeout)
  }, [autohide])

  return (
    <ToastMessage
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
    </ToastMessage>
  )
}

const ToastContainer = styled(motion.div, {
  position: "absolute",
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

const ToastMessage = styled(motion.div, {
  pointerEvents: "all",
  display: "flex",
  alignItems: "center",
  bg: "$background",
  color: "$text",
  width: "fit-content",
  borderRadius: 8,
  border: "2px solid $message",
  boxShadow: "0 6px 24px $shadow",
  pl: "$2",
  pr: "$1",
  py: "$1",
  mt: "$1",
  [`${IconButton}`]: {
    ml: "$1",
  },
})
