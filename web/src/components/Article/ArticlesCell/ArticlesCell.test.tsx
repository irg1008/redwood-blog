import { render, screen } from '@redwoodjs/testing/web'

import { Loading, Empty, Failure, Success } from './ArticlesCell'
import { standard } from './ArticlesCell.mock'

describe('ArticlesCell', () => {
  it('Loading renders successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('No posts to show')).toBeInTheDocument()
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
