import { useTranslation } from 'react-i18next'

import { Metadata } from '@redwoodjs/web'

import ArticlesCell from 'src/components/Article/ArticlesCell'

const HomePage = () => {
  const { t } = useTranslation()

  return (
    <>
      <Metadata
        title={t('HomePage.title')}
        description={t('HomePage.description')}
      />
      <ArticlesCell />
    </>
  )
}

export default HomePage
