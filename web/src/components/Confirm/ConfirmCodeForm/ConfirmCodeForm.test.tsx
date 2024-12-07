import userEvent from '@testing-library/user-event'

import { render, screen, waitFor } from '@redwoodjs/testing/web'

import { i18nInit } from 'src/i18n/i18n'

import ConfirmCodeForm from './ConfirmCodeForm'

describe('ConfirmCodeForm', () => {
  beforeAll(async () => {
    await i18nInit('cimode')
  })

  it('renders successfully', () => {
    expect(() => {
      render(<ConfirmCodeForm />)
    }).not.toThrow()
  })

  it('code cannot be empty', async () => {
    const onConfirm = jest.fn()

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('confirm-code.actions.submit')

    await waitFor(() => userEvent.click(submit))

    expect(onConfirm).not.toHaveBeenCalled()
    expect(screen.getByText('code.nonEmpty')).toBeInTheDocument()
  })

  test.each([
    ['123456789', 'code.length'],
    ['123', 'code.length'],
    ['DEHECK', 'code.regex'],
  ])(`code must be a 6 digit number. Checking %p`, async (code, message) => {
    const onConfirm = jest.fn()

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('confirm-code.actions.submit')
    const input: HTMLInputElement = screen.getByLabelText(
      'confirm-code.form.code.label'
    )

    input.type = 'text'

    await waitFor(() => userEvent.type(input, code))
    await waitFor(() => userEvent.click(submit))

    const error = screen.getByText(message)
    expect(error).toBeInTheDocument()
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('input must be number type', async () => {
    render(<ConfirmCodeForm />)

    const input = screen.getByLabelText('confirm-code.form.code.label')

    expect(input).toHaveAttribute('type', 'number')

    await waitFor(() => userEvent.type(input, 'abc'))
    expect(input).toHaveValue(null)
  })

  it('onConfirm should receive the code', async () => {
    const onConfirm = jest.fn()

    render(<ConfirmCodeForm onConfirm={onConfirm} />)

    const submit = screen.getByText('confirm-code.actions.submit')
    const input = screen.getByLabelText('confirm-code.form.code.label')

    const code = '123456'

    await waitFor(() => userEvent.type(input, code))
    await waitFor(() => userEvent.click(submit))

    expect(onConfirm).toHaveBeenCalledWith({ code })
  })

  it('can paste code from clipboard', async () => {
    const user = userEvent.setup()

    render(<ConfirmCodeForm />)

    const input = screen.getByLabelText('confirm-code.form.code.label')
    const paste = screen.getByLabelText('common.paste')
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
