// import { Link, routes } from '@redwoodjs/router'
import { PropsWithChildren, useEffect, useState } from 'react'

import {
  Card,
  CardBody,
  CardHeader,
  Divider,
  Tab,
  Tabs,
} from '@nextui-org/react'
import { SettingsIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { TranslatePath } from 'types/i18next'

import {
  AvailableRoutes,
  routes,
  Link as RWLink,
  useRouteName,
} from '@redwoodjs/router'

import { KeysEndingWith } from 'src/lib/types'

type SettingsRoutes = KeysEndingWith<AvailableRoutes, 'Settings'>

const SettingsLayout = ({ children }: PropsWithChildren) => {
  const { t } = useTranslation()
  const routeName = useRouteName()

  const sidenavItems: Record<SettingsRoutes, TranslatePath> = {
    profileSettings: 'settings.sidenav.profile',
    streamerSettings: 'settings.sidenav.streamer',
  }
  const [page, setPage] = useState(routeName)

  useEffect(() => {
    setPage(routeName)
  }, [routeName])

  return (
    <>
      <section className="flex grow justify-stretch gap-8 p-8">
        <Card className="min-w-64 shrink-0" isBlurred>
          <CardHeader className="flex gap-4">
            <SettingsIcon className="size-4" />
            <h2>{t('settings.title')}</h2>
          </CardHeader>

          <CardBody>
            <Tabs
              selectedKey={page}
              aria-label={t('settings.sidenav.aria')}
              isVertical
              variant="light"
              className="w-full"
              classNames={{
                tabList: 'w-full',
                tab: 'p-0',
                tabContent: 'size-full',
              }}
            >
              {Object.entries(sidenavItems).map(([key, value]) => (
                <Tab
                  key={key}
                  title={
                    <RWLink
                      className="flex size-full items-center px-3 py-1 capitalize"
                      to={routes[key as SettingsRoutes]()}
                    >
                      {t(value)}
                    </RWLink>
                  }
                />
              ))}
            </Tabs>
          </CardBody>
        </Card>

        <Card className="grow">
          <CardBody className="p-8">
            <h1>
              {t('settings.full-title', {
                setting: t(sidenavItems[page as SettingsRoutes]),
              })}
            </h1>
            <Divider className="my-4" />
            {children}
          </CardBody>
        </Card>
      </section>
    </>
  )
}

export default SettingsLayout
