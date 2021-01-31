import firebase from "firebase"
import { createState } from "@state-designer/react"
import router from "next/router"

const authState = createState({
  data: {
    user: null as null | {
      id: string
      email: string
      emailVerified: boolean
      getIdToken: () => Promise<null | (() => void)>
      clientInitialized: boolean
      firebaseUser: firebase.User | null
      signOut: () => Promise<void>
      serialize: (options?: { includeToken?: boolean }) => string
    },
  },
  initial: "loading",
  states: {
    loading: {
      on: {
        USER_CHANGED: {
          if: "hasFoundUser",
          to: "signedIn",
          else: { to: "signedOut" },
        },
      },
    },
    signedIn: {
      onEnter: "setUser",
      on: {
        SIGNED_OUT: { do: "signOut" },
        USER_CHANGED: {
          unless: "hasFoundUser",
          to: "signedOut",
        },
      },
    },
    signedOut: {
      onEnter: "clearUser",
      on: {
        SIGNED_IN: { do: "signIn" },
        USER_CHANGED: {
          if: "hasFoundUser",
          to: "signedIn",
        },
      },
    },
  },
  actions: {
    setUser(data, { user }) {
      data.user = user
    },
    clearUser(data) {
      data.user = null
    },
    signOut(data) {
      data.user.signOut()
    },
    signIn() {
      router.push({ pathname: "/login", query: router.asPath })
    },
  },
  conditions: {
    hasFoundUser(_, { user }) {
      return user?.id !== null
    },
    hasUser(data) {
      return !!data.user
    },
  },
})

export default authState
