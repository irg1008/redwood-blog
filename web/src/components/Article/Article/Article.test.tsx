import { FindArticleQuery } from 'types/graphql'

import { render, screen, waitFor } from '@redwoodjs/testing/web'

import { standard as commentsStandard } from 'src/components/Comment/CommentsCell/CommentsCell.mock'

import Article, { LINE_CLAMP_CLASS } from './Article'

const ARTICLE: FindArticleQuery['article'] = {
  id: 1,
  user: {
    name: 'Alice',
  },
  title: 'First post',
  slug: 'first-post',
  body: `Neutra tacos hot chicken prism raw denim, put a bird on it enamel pin post-ironic vape cred DIY. Street art next level umami squid. Hammock hexagon glossier 8-bit banjo. Neutra la croix mixtape echo park four loko semiotics kitsch forage chambray. Semiotics salvia selfies jianbing hella shaman. Letterpress helvetica vaporware cronut, shaman butcher YOLO poke fixie hoodie gentrify woke heirloom.`,
  createdAt: new Date().toISOString(),
}

describe('Article', () => {
  it('renders a blog post', () => {
    render(<Article article={ARTICLE} />)

    expect(screen.getByText(ARTICLE.title)).toBeInTheDocument()

    const bodyElement = screen.getByText(ARTICLE.body)
    expect(bodyElement).toBeInTheDocument()
    expect(bodyElement).not.toHaveClass(LINE_CLAMP_CLASS)
  })

  it('renders comments when displaying a full blog post', async () => {
    render(<Article article={ARTICLE} />)

    const { comments } = commentsStandard()
    const [firstComment] = comments

    await waitFor(() => {
      expect(screen.getByText(firstComment.name)).toBeInTheDocument()
      expect(screen.getByText(firstComment.body)).toBeInTheDocument()
    })
  })

  it('renders a summary of a blog post', () => {
    render(<Article article={ARTICLE} summary={true} />)

    expect(screen.getByText(ARTICLE.title)).toBeInTheDocument()

    const bodyElement = screen.getByText(ARTICLE.body)
    expect(bodyElement).toBeInTheDocument()
    expect(bodyElement).toHaveClass(LINE_CLAMP_CLASS)
  })

  it('does not render comments when displaying a summary', async () => {
    render(<Article article={ARTICLE} summary={true} />)

    const { comments } = commentsStandard()
    const [firstComment] = comments

    await waitFor(() =>
      expect(screen.queryByText(firstComment.body)).not.toBeInTheDocument()
    )
  })
})
