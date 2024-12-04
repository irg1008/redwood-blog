import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import CommentForm from './CommentForm'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CommentForm', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<CommentForm postId={1} />)
    }).not.toThrow()
  })
})
