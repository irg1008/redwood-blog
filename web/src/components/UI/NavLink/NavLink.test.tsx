import { Navbar } from '@nextui-org/react'

import { render } from '@redwoodjs/testing/web'

import NavLink from './NavLink'

//   Improve this test with help from the Redwood Testing Doc:
//    https://redwoodjs.com/docs/testing#testing-components

describe('NavLink', () => {
  it('renders successfully', () => {
    expect(() => {
      render(
        <Navbar>
          <NavLink to="/" />
        </Navbar>
      )
    }).not.toThrow()
  })
})
