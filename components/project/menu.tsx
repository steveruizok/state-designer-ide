import * as React from "react"
import { useAuthUser } from "next-firebase-auth"

import { Button, IconButton, styled } from "components/theme"

import { Home } from "react-feather"
import Link from "next/link"

interface MenuProps {}

export default function Menu({}: MenuProps) {
  const user = useAuthUser()
  return (
    <MenuContainer>
      <Link href={user ? `/u/${user.id}` : "/"}>
        <IconButton title="Home">
          <Home />
        </IconButton>
      </Link>
      {!user && (
        <Link href="/login">
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
