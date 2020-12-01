import router from "next/router"
import firebase from "./firebase"

export async function login() {
  const provider = new firebase.auth.GoogleAuthProvider()
  const token = await firebase
    .auth()
    .signInWithPopup(provider)
    .then((auth) => auth.user.getIdToken())

  await fetch(process.env.NEXT_PUBLIC_BASE_API_URL + "/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  })

  // await firebase.auth().signOut()

  router.reload()
}

export async function logout() {
  await fetch(process.env.NEXT_PUBLIC_BASE_API_URL + "/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })

  router.reload()
}
