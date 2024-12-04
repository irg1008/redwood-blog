import { render, screen } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import { Empty, Failure, Loading, Success } from './CommentsCell'
import { standard } from './CommentsCell.mock'

describe('CommentsCell', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('Loading renders successfully', () => {
    expect(() => {
      render(<Loading />)
    }).not.toThrow()
  })

  it('Failure renders successfully', async () => {
    expect(() => {
      render(<Failure />)
    }).not.toThrow()
  })

  it('Empty renders successfully', async () => {
    render(<Empty />)
    expect(screen.getByText('comments.empty')).toBeInTheDocument()
  })

  it('Success renders successfully', async () => {
    const comments = standard().comments

    render(<Success comments={comments} />)

    comments.forEach((comment) => {
      expect(screen.getByText(comment.name)).toBeInTheDocument()
      expect(screen.getByText(comment.body)).toBeInTheDocument()
    })
  })
})
