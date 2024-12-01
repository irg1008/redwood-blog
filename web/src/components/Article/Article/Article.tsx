import { cn } from '@nextui-org/react'
import { useTranslation } from 'react-i18next'
import type { FindArticleQuery } from 'types/graphql'

import { Link, routes } from '@redwoodjs/router'

import CommentForm from 'src/components/Comment/CommentForm'
import CommentsCell from 'src/components/Comment/CommentsCell'

type ArticleProps = {
  article: NonNullable<FindArticleQuery['article']>
  summary?: boolean
}

export const LINE_CLAMP_CLASS = 'line-clamp-1'

const Article = ({ article, summary = false }: ArticleProps) => {
  const { t } = useTranslation()
  return (
    <article>
      <header>
        <h2 className="text-xl font-semibold text-blue-700">
          <Link to={routes.article({ slug: article.slug })}>
            {article.title}
          </Link>
          <span className="ml-2 font-normal text-foreground-300">
            {t('common.by', { name: article.user.name || t('common.unknown') })}
          </span>
        </h2>
      </header>
      <div
        className={cn(
          'mt-2 font-light text-foreground-900',
          summary && LINE_CLAMP_CLASS
        )}
      >
        {article.body}
      </div>
      {!summary && (
        <div className="mt-12">
          <CommentForm postId={article.id} />
          <div className="mt-12">
            <CommentsCell postId={article.id} />
          </div>
        </div>
      )}
    </article>
  )
}

export default Article
