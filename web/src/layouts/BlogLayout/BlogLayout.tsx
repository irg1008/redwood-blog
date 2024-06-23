import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'

import { routes } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import { useAuth } from 'src/auth'
import Link from 'src/components/UI/Link/Link'
import NavLink from 'src/components/UI/NavLink/NavLink'

type BlogLayoutProps = {
  children?: React.ReactNode
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const { isAuthenticated, currentUser, logOut, hasRole } = useAuth()

  return (
    <main className="flex min-h-dvh flex-col bg-background text-foreground">
      <Toaster toastOptions={{ position: 'bottom-center', duration: 5000 }} />

      <Navbar isBordered className="h-16">
        <NavbarBrand>
          <Link
            className="text-3xl font-semibold tracking-tight text-blue-400"
            to={routes.home()}
          >
            Redwood Blog
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavLink to={routes.about()}>About</NavLink>
          <NavLink
            to={routes.chat({
              streamId: 1,
            })}
          >
            Chat
          </NavLink>
          <NavLink to={routes.contact()}>Contact</NavLink>
          {hasRole('admin') && <NavLink to={routes.posts()}>Posts</NavLink>}

          {isAuthenticated ? (
            <NavbarItem>
              <Button variant="flat" onClick={logOut}>
                Logout
              </Button>
            </NavbarItem>
          ) : (
            <NavLink to={routes.login()}>Login</NavLink>
          )}

          {isAuthenticated && (
            <div className="text-xs text-blue-300">
              {String(currentUser?.email)}
            </div>
          )}
        </NavbarContent>
      </Navbar>

      <div className="mx-auto flex w-full grow flex-col">{children}</div>
    </main>
  )
}

export default BlogLayout
