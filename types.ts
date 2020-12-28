import { S } from "@state-designer/react"

// App

export type LayoutOffset = "content" | "main" | "code" | "detail" | "console"

export type CodeEditorTab = "state" | "view" | "static"

export type DetailsTab = "data" | "values"

// Data

export interface User {
  name: string
  uid: string
  email: string
  picture: string
  authenticated: boolean
}

export interface AuthState {
  user: User | null
  error: string
  authenticated: boolean
  token?: string
}

export type ProjectResponse = {
  oid: string
  pid: string
  isProject: boolean
  isOwner: boolean
}

export type ProjectData = {
  pid: string
  oid: string
  name: string
  code: string
  jsx: string
  theme: string
  statics: string
  tests: string
}

export type AdminResponse = {
  projects: ProjectData[]
  authenticated: boolean
  error?: Error
}

export type UserProjectsResponse = {
  oid: string
  projects: string[]
  isOwner: boolean
}

// UI

export interface ToastMessage {
  id: string
  message: string
  autohide?: boolean
}

export interface HighlightData {
  event: {
    eventName: string
    statePaths: string[]
    targets: {
      from: React.RefObject<HTMLDivElement>
      to: React.RefObject<HTMLDivElement>
    }[]
  } | null
  states: Record<string, { name: string; path: string }>
  scrollToLine: boolean
  eventButtonRefs: Map<string, React.RefObject<HTMLDivElement>>
  stateNodeRefs: Map<string, React.RefObject<HTMLDivElement>>
}

export interface EventDetails {
  eventName: string
  states: Set<S.State<any, any>>
  targets: {
    from: S.State<any, any>
    to: S.State<any, any>
    isConditional: boolean
    isSecondary: boolean
  }[]
}
