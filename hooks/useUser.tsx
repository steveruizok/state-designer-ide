import { useAuthUser as _useAuthUser } from "next-firebase-auth"

export default function useAuthUser() {
  const user = _useAuthUser()

  return user
}
