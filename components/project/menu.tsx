import * as React from "react"
import * as Types from "types"

import { Button, IconButton, styled } from "components/theme"

import { Home } from "react-feather"
import Link from "next/link"
import { login } from "lib/auth-client"

interface MenuProps {
  user: Types.User
}

export default function Menu({ user }: MenuProps) {
  return (
    <MenuContainer>
      <Link href={user ? `/u/${user.uid}` : "/"}>
        <IconButton title="Home">
          <Home />
        </IconButton>
      </Link>
      {!user && (
        <Button title="Log In" onClick={login}>
          Log in
        </Button>
      )}
    </MenuContainer>
  )
}

const MenuContainer = styled.div({
  gridArea: "menu",
  display: "flex",
  alignItems: "center",
})
