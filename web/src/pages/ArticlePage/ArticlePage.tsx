import { useTranslation } from 'react-i18next'

import { Metadata } from '@redwoodjs/web'

import ArticleCell from 'src/components/Article/ArticleCell'

type ArticlePageProps = {
  slug: string
}

const ArticlePage = ({ slug }: ArticlePageProps) => {
  const { t } = useTranslation()
  return (
    <>
      <Metadata
        title={t('Article.title')}
        description={t('Article.description')}
      />
      <ArticleCell slug={slug} />
    </>
  )
}

export default ArticlePage
