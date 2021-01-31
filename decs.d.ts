import * as React from "react"
import firebase from "firebase"
import admin from "firebase-admin"

declare module "next-firebase-auth" {
  export interface Config extends any {}

  export interface AuthUser {
    id: string
    email: string
    emailVerified: boolean
    getIdToken: () => Promise<null | firebase.User.getToken>
    clientInitialized: boolean
    firebaseUser: firebase.User | null
    signOut: () => Promise<void>
    serialize: (options?: { includeToken?: boolean }) => string
  }
  export enum AuthAction {
    RENDER = "render",
    SHOW_LOADER = "showLoader",
    RETURN_NULL = "returnNull",
    REDIRECT_TO_LOGIN = "redirectToLogin",
    REDIRECT_TO_APP = "redirectToApp",
  }
  export function init(config: Config): void
  export function useAuthUser(): ReturnType<React.useContext<AuthUser>>
  export function withAuthUser(options: {
    whenAuthed?: AuthAction
    whenUnauthedBeforeInit?: AuthAction
    whenUnauthedAfterInit?: AuthAction
    appPageURL?: string
    authPageURL?: string
    LoaderComponent?: React.ReactNode
  }): (children: React.ReactNode) => React.ReactNode
  export function withAuthUserSSR(...args: any): any
  export function withAuthUserTokenSSR(...args: any): any
  export function setAuthCookies(...args: any): any
  export function unsetAuthCookies(...args: any): any
  export function verifyIdToken(...args: any): any
}
