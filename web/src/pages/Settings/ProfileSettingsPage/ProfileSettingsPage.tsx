// import { Link, routes } from '@redwoodjs/router'
import { useTranslation } from 'react-i18next'

import { Metadata } from '@redwoodjs/web'

const ProfileSettingsPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Metadata
        title={t('ProfileSettings.title')}
        description={t('ProfileSettings.description')}
      />

      <h1>ProfileSettingsPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/ProfileSettingsPage/ProfileSettingsPage.tsx</code>
      </p>
      {/*
          My default route is named `profileSettings`, link to me with:
          `<Link to={routes.profileSettings()}>ProfileSettings</Link>`
      */}
    </>
  )
}

export default ProfileSettingsPage
