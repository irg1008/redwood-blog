import { Metadata } from '@redwoodjs/web'
import ArticleCell from 'src/components/Article/ArticleCell'

type ArticlePageProps = {
  slug: string
}

const ArticlePage = ({ slug }: ArticlePageProps) => {
  return (
    <>
      <Metadata title="Article" description="Article page" />
      <ArticleCell slug={slug} />
    </>
  )
}

export default ArticlePage
