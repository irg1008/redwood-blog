import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import ChatInput from './ChatInput'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('ChatInput', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<ChatInput streamId={1} />)
    }).not.toThrow()
  })
})
