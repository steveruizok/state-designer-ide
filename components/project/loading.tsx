import { motion } from "framer-motion"
import { styled } from "components/theme"
import { Loader } from "react-feather"

export default function Loading() {
  return (
    <LoadingContainer>
      <Spinner
        animate={{
          rotate: 360,
          transition: {
            type: "tween",
            ease: "linear",
            duration: 2,
            repeat: Infinity,
          },
        }}
      >
        <Loader />
      </Spinner>
    </LoadingContainer>
  )
}

const LoadingContainer = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
  width: "100%",
})

const Spinner = styled(motion.div, {
  color: "$text",
  opacity: 0.2,
})
