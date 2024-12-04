import { render, screen } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import { Empty, Failure, Loading, Success } from './ArticleCell'
import { standard } from './ArticleCell.mock'

describe('ArticleCell', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('Loading renders successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('article.empty')).toBeInTheDocument()
  })

  it('Failure renders successfully', async () => {
    expect(() => {
      render(<Failure />)
    }).not.toThrow()
  })

  it('Success renders successfully', async () => {
    const article = standard().article
    render(<Success article={article} />)

    expect(screen.getByText(article.title)).toBeInTheDocument()
    expect(screen.getByText(article.body)).toBeInTheDocument()
  })
})
