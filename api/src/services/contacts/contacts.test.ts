import { CreateContactInput } from 'types/graphql'

import { EmailValidationError } from '@redwoodjs/api'

import {
  contact,
  contacts,
  createContact,
  deleteContact,
  updateContact,
} from './contacts'
import type { StandardScenario } from './contacts.scenarios'

describe('contacts', () => {
  scenario('returns all contacts', async (scenario: StandardScenario) => {
    const result = await contacts()

    expect(result.length).toEqual(Object.keys(scenario.contact).length)
  })

  scenario('returns a single contact', async (scenario: StandardScenario) => {
    const result = await contact({ id: scenario.contact.john.id })

    expect(result).toEqual(scenario.contact.john)
  })

  scenario('creates a contact', async () => {
    const contact: CreateContactInput = {
      name: 'Jane Doe',
      email: 'jane@anonymous.com',
      message: 'Hi!',
    }

    const result = await createContact({ input: contact })

    expect(result.name).toEqual(contact.name)
    expect(result.email).toEqual(contact.email)
    expect(result.message).toEqual(contact.message)
    expect(result.createdAt).not.toEqual(null)
  })

  scenario('contact name is optional', async (scenario: StandardScenario) => {
    const result = await contact({ id: scenario.contact.nameless.id })
    expect(result.name).toBeNull()
  })

  scenario('updates a contact', async (scenario: StandardScenario) => {
    const original = await contact({ id: scenario.contact.john.id })

    const newName = 'Johnathan Doe'
    const result = await updateContact({
      id: original.id,
      input: { name: newName },
    })

    expect(result.name).toEqual(newName)
  })

  scenario('deletes a contact', async (scenario: StandardScenario) => {
    const original = await deleteContact({ id: scenario.contact.john.id })
    const result = await contact({ id: original.id })

    expect(result).toEqual(null)
  })

  scenario('only valid emails are inserted', async () => {
    expect(() =>
      createContact({
        input: {
          name: 'Jane Doe',
          email: 'jane@anonymous',
          message: 'Hi!',
        },
      })
    ).rejects.toThrow(EmailValidationError)
  })
})
