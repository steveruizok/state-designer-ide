import * as React from "react"
import useUser from "hooks/useUser"
import { useRouter } from "next/router"

import { Button, IconButton, styled } from "components/theme"

import { Home } from "react-feather"
import Link from "next/link"

interface MenuProps {}

export default function Menu({}: MenuProps) {
  const user = useUser()
  const router = useRouter()

  return (
    <MenuContainer>
      <Link href={user ? `/u/${user.id}` : "/"}>
        <IconButton title="Home">
          <Home />
        </IconButton>
      </Link>
      {!user.id && (
        <Link href={`/auth?mode=select&signInSuccessUrl=${router.asPath}`}>
          <Button title="Log In">Log in</Button>
        </Link>
      )}
    </MenuContainer>
  )
}

const MenuContainer = styled.div({
  gridArea: "menu",
  display: "flex",
  alignItems: "center",
})
