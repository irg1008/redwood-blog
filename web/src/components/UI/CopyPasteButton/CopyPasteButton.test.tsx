import { render } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import CopyPasteButton from './CopyPasteButton'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('CopyPasteButton', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(
        <CopyPasteButton
          value="test"
          onCopy={(value) => {
            alert(value)
          }}
        />
      )
    }).not.toThrow()
  })
})
