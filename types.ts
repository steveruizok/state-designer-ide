export interface User {
  name: string
  uid: string
  email: string
  picture: string
}

export interface AuthState {
  user: User | null
  authenticated: boolean
  error: string
}
