import { render, screen } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import { Empty, Failure, Loading, Success } from './ArticlesCell'
import { standard } from './ArticlesCell.mock'

describe('ArticlesCell', () => {
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
    expect(screen.getByText('articles.empty')).toBeInTheDocument()
  })

  it('Failure renders successfully', async () => {
    expect(() => {
      render(<Failure error={new Error('Oh no')} />)
    }).not.toThrow()
  })

  it('Success renders successfully', async () => {
    const articles = standard().articles
    render(<Success articles={articles} />)

    articles.forEach((article) => {
      expect(screen.getByText(article.title)).toBeInTheDocument()
      expect(screen.getByText(article.body)).toBeInTheDocument()
    })
  })
})
