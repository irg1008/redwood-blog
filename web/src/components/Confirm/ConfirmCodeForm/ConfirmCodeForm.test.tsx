import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from '@redwoodjs/testing/web'
import { toast } from '@redwoodjs/web/toast'

import ConfirmCodeForm from './ConfirmCodeForm'

describe('ConfirmCodeForm', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ConfirmCodeForm />)
    }).not.toThrow()
  })

  it('code cannot be empty', async () => {
    const onConfirm = jest.fn()

    console.log(toast)

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('Confirm')

    await waitFor(() => userEvent.click(submit))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.getByText('Please enter the code')).toBeInTheDocument()
  })

  it('code must be a 6 digit number', async () => {
    const onConfirm = jest.fn()

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('Confirm')
    const input = screen.getByLabelText('Code')

    await waitFor(() => userEvent.type(input, '12345'))
    await waitFor(() => userEvent.click(submit))

    const error = screen.getByText(
      'Invalid code format. Must be a 6 digit code'
    )
    expect(error).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('input must be number type', async () => {
    render(<ConfirmCodeForm />)

    const input = screen.getByLabelText('Code')

    expect(input).toHaveAttribute('type', 'number')

    await waitFor(() => userEvent.type(input, 'abc'))
    expect(input).toHaveValue(null)
  })

  it('onConfirm should receive the code', async () => {
    const onConfirm = jest.fn()

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('Confirm')
    const input = screen.getByLabelText('Code')

    const code = '123456'

    await waitFor(() => userEvent.type(input, code))
    await waitFor(() => userEvent.click(submit))

    expect(onConfirm).toHaveBeenCalledWith({ code })
  })

  it('can paste code from clipboard', async () => {
    const user = userEvent.setup()

    render(<ConfirmCodeForm />)

    const input = screen.getByLabelText('Code')
    const paste = screen.getByLabelText('Paste from clipboard')
    expect(paste).toBeInTheDocument()

    const code = 123456
    await navigator.clipboard.writeText(code.toString())

    await waitFor(() => user.click(paste))
    await waitFor(() => expect(input).toHaveValue(code))

    const wrongCode = 'abc'
    await navigator.clipboard.writeText(wrongCode)

    await waitFor(() => user.click(paste))
    await waitFor(() => expect(input).toHaveValue(null))
  })
})
