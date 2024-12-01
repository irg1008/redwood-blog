import { render, screen } from '@redwoodjs/testing/web'

import { mockI18n } from 'src/i18n/i18n.test'

import { Empty, Failure, Loading, Success } from './ArticleCell'
import { standard } from './ArticleCell.mock'

describe('ArticleCell', () => {
  beforeEach(() => {
    mockI18n()
  })

  it('Loading renders successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('Article not found')).toBeInTheDocument()
  })

  it('Failure renders successfully', async () => {
    expect(() => {
      render(<Failure error={new Error('Oh no')} />)
    }).not.toThrow()
  })

  it('Success renders successfully', async () => {
    const article = standard().article
    render(<Success article={article} />)

    expect(screen.getByText(article.title)).toBeInTheDocument()
    expect(screen.getByText(article.body)).toBeInTheDocument()
  })
})
