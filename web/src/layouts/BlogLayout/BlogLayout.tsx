import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from '@nextui-org/react'
import { LanguagesIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { routes, useParams } from '@redwoodjs/router'
import { Toaster } from '@redwoodjs/web/toast'

import Link from 'src/components/UI/Link/Link'
import NavLink from 'src/components/UI/NavLink/NavLink'
import { langs } from 'src/i18n/i18n'
import { useAuth } from 'src/lib/auth'
import { deleteSearchParams } from 'src/lib/router'

type BlogLayoutProps = {
  children?: React.ReactNode
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  const { isAuthenticated, currentUser, logOut, hasRole } = useAuth()
  const { i18n, t } = useTranslation()

  const params = useParams()

  const changeLang = (lang: string) => {
    i18n.changeLanguage(lang)
    if ('lng' in params) deleteSearchParams('lng')
  }

  return (
    <main className="flex min-h-dvh flex-col">
      <Toaster toastOptions={{ position: 'bottom-center', duration: 5000 }} />

      <Navbar isBordered className="h-16">
        <NavbarBrand>
          <Link
            className="text-3xl font-semibold tracking-tight text-blue-400"
            to={routes.home()}
          >
            {t('common.name')}
          </Link>
        </NavbarBrand>

        <NavbarContent justify="end">
          <NavLink to={routes.about()}>{t('About.title')}</NavLink>
          <NavLink to={routes.streamer({ streamerId: 1 })}>
            {t('Streamer.title')}
          </NavLink>
          <NavLink to={routes.contact()}>{t('Contact.title')}</NavLink>
          {hasRole('admin') && <NavLink to={routes.posts()}></NavLink>}

          {isAuthenticated ? (
            <NavbarItem>
              <Button variant="flat" onClick={logOut}>
                {t('common.logout')}
              </Button>
            </NavbarItem>
          ) : (
            <NavLink to={routes.login()}>{t('common.login')}</NavLink>
          )}

          {isAuthenticated && (
            <div className="text-xs text-blue-300">
              {String(currentUser?.email)}
            </div>
          )}

          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Chip
                startContent={<LanguagesIcon className="ms-1 size-4" />}
                variant="faded"
                className="cursor-pointer transition-transform"
              >
                {i18n.language}
              </Chip>
            </DropdownTrigger>
            <DropdownMenu
              aria-label={t('common.language-dropdown.aria')}
              variant="faded"
              disallowEmptySelection
              selectedKeys={[i18n.language]}
              selectionMode="single"
            >
              {langs.map((lang) => (
                <DropdownItem key={lang} onClick={() => changeLang(lang)}>
                  {lang}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </Navbar>

      <div className="mx-auto flex w-full grow flex-col">{children}</div>
    </main>
  )
}

export default BlogLayout
