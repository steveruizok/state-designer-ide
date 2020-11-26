// refresh reset
import router from "next/router"
import { createState } from "@state-designer/core"
import firebase from "firebase/app"
import "firebase/auth"
import * as Types from "types"

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
}

export const authState = createState({
  id: "auth",
  data: {
    user: null as Types.User | null,
    error: null as Error | null,
  },
  onEnter: "initFirebase",
  initial: "checking",
  states: {
    checking: {
      async: {
        await: "checkAuth",
        onResolve: {
          if: "loginHasData",
          do: "setUser",
          to: "loggedIn",
        },
        onReject: {
          to: "loggedOut",
        },
      },
    },
    loggedOut: {
      onEnter: "clearUser",
      on: { LOGGED_IN: { to: "loggingIn" } },
    },
    loggingIn: {
      async: {
        await: "login",
        onResolve: {
          if: "loginHasData",
          do: "setUser",
          to: "loggedIn",
        },
        onReject: {
          do: "setError",
          to: "error",
        },
      },
    },
    loggedIn: {
      on: { LOGGED_OUT: { to: "loggingOut" } },
    },
    loggingOut: {
      async: {
        await: "logout",
        onResolve: {
          to: "loggedOut",
        },
        onReject: {
          do: "setError",
          to: "error",
        },
      },
    },
    error: {
      on: {
        RETRIED: {
          do: "reset",
          to: "checking",
        },
      },
    },
  },
  conditions: {
    loginHasData(__, _, result) {
      return !!result
    },
  },
  actions: {
    initFirebase() {
      if (!firebase.apps.length) {
        firebase.initializeApp(config)
      }
    },
    reset(data) {
      data.user = null
      data.error = null
    },
    clearUser(data) {
      data.user = null
    },
    setUser(data, _, auth: Types.User) {
      data.user = auth
    },
    setError(data, _, error: Error) {
      data.error = error
    },
  },
  asyncs: {
    async checkAuth() {
      return new Promise((resolve) => {
        const unsubscribe = firebase.auth().onAuthStateChanged((auth) => {
          unsubscribe()
          resolve(auth)
        })
      })
    },
    async login() {
      const provider = new firebase.auth.GoogleAuthProvider()
      const result = await firebase.auth().signInWithPopup(provider)
      router.push("/user")

      const { displayName, email, photoURL, uid } = result.user

      return {
        name: displayName,
        email,
        picture: photoURL,
        uid,
      }
    },
    async logout() {
      router.push("/auth")
      return firebase.auth().signOut()
    },
  },
})
