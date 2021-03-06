import { withAuthUser, AuthAction } from "next-firebase-auth"
import FirebaseAuth from "components/firebase-auth"
import { styled } from "components/theme"
import useAuthUser from "hooks/useAuthUser"
import { GetServerSidePropsContext } from "next"

interface AuthProps {
  redirect: string
}

function Auth() {
  useAuthUser()

  return (
    <Container>
      <FirebaseAuth />
    </Container>
  )
}

export default withAuthUser<AuthProps>({
  whenAuthed: AuthAction.REDIRECT_TO_APP,
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.RENDER,
})(Auth)

const Container = styled.div({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100vw",
  height: "100vh",
  textAlign: "center",
})
