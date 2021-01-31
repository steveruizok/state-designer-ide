import { withAuthUser, AuthAction } from "next-firebase-auth"
import FirebaseAuth from "components/firebase-auth"
import { styled } from "components/theme"
import * as Types from "types"

function Auth({ error }: Types.AuthState) {
  return (
    <Container>
      <FirebaseAuth />
    </Container>
  )
}

export default withAuthUser({
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
