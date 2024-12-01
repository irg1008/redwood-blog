import { render, screen } from '@redwoodjs/testing/web'

import { mockI18n } from 'src/i18n/i18n.test'

import { Empty, Failure, Loading, Success } from './ArticlesCell'
import { standard } from './ArticlesCell.mock'

describe('ArticlesCell', () => {
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
    expect(screen.getByText('You are all caught up!')).toBeInTheDocument()
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
