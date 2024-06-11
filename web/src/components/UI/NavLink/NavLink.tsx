import { ComponentProps } from 'react'

import { NavbarItem } from '@nextui-org/react'

import { useMatch } from '@redwoodjs/router'

import Link from '../Link/Link'

type NavLinkProps = ComponentProps<typeof Link>

const NavLink = (props: NavLinkProps) => {
  const matchInfo = useMatch(props.to)
  return (
    <NavbarItem isActive={matchInfo.match}>
      <Link {...props} aria-current={matchInfo.match ? 'page' : undefined} />
    </NavbarItem>
  )
}

export default NavLink
