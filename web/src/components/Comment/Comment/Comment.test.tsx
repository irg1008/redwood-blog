import { render, screen, waitFor } from '@redwoodjs/testing/web'

import Comment from './Comment'

const COMMENT = {
  id: 1,
  name: 'John Doe',
  body: 'This is my comment. With a word in it oh noooo!',
  createdAt: '2020-01-02T12:34:56Z',
  postId: 1,
}

describe('Comment', () => {
  it('renders successfully', () => {
    render(<Comment comment={COMMENT} />)

    expect(screen.getByText(COMMENT.name)).toBeInTheDocument()
    expect(screen.getByText(COMMENT.body)).toBeInTheDocument()

    const formattedCreatedAt = COMMENT.createdAt
    const dateExpect = screen.getByText(formattedCreatedAt)

    expect(dateExpect).toBeInTheDocument()
    expect(dateExpect.nodeName).toEqual('TIME')
    expect(dateExpect).toHaveAttribute('datetime', COMMENT.createdAt)
  })

  it('does not render a delete button if user is logged out', async () => {
    render(<Comment comment={COMMENT} />)

    await waitFor(() => {
      const deleteBtn = screen.queryByText('Delete', { selector: 'button' })
      expect(deleteBtn).not.toBeInTheDocument()
    })
  })

  it('renders a delete button if the user is a moderator', async () => {
    mockCurrentUser({
      id: 1,
      email: 'moderator@gmail.com',
      roles: 'moderator',
    })

    render(<Comment comment={COMMENT} />)

    await waitFor(() => {
      const deleteBtn = screen.getByText('Delete', { selector: 'button' })
      expect(deleteBtn).toBeInTheDocument()
    })
  })
})
