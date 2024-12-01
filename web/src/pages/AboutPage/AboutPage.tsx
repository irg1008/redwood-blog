import { useTranslation } from 'react-i18next'

import { Metadata } from '@redwoodjs/web'

const AboutPage = () => {
  const { t } = useTranslation()
  return (
    <>
      <Metadata title={t('About.title')} description={t('About.description')} />
      <p className="font-light">{t('About.about')}</p>
    </>
  )
}

export default AboutPage
