import router from "next/router"
import firebase from "firebase/app"
import "firebase/firestore"
import "firebase/auth"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

const db = firebase.firestore()

/**
 * Remove the user's session token.
 */
async function clearUserToken() {
  var path = "/api/logout"
  var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
}

/**
 * Create a session token for the current user.
 * @param token The user's token.
 */
async function postUserToken(token: string) {
  var path = "/api/login"
  var url = process.env.NEXT_PUBLIC_BASE_API_URL + path
  var data = { token }
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

// Public API

export async function login() {
  const provider = new firebase.auth.GoogleAuthProvider()
  const result = await firebase.auth().signInWithPopup(provider)
  const token = await result.user.getIdToken()
  await postUserToken(token).catch(() => router.reload())
  router.push("/user")
}

export async function logout() {
  firebase.auth().signOut()
  await clearUserToken()
  router.push("/auth")
}
