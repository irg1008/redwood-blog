import { useCallback, useEffect } from 'react'

import {
  FieldValues,
  Path,
  UseFormProps,
  useForm as useRedwoodForm,
} from '@redwoodjs/forms'

import i18n from 'src/i18n/i18n'

export const useForm = <
  T extends FieldValues,
  C = unknown,
  V extends FieldValues | undefined = undefined,
>(
  props: UseFormProps<T, C>
) => {
  const form = useRedwoodForm<T, C, V>(props)

  const triggerInvalidFields = useCallback(() => {
    console.log('Retriggering')
    Object.keys(form.formState.errors).forEach((key) => {
      form.trigger(key as Path<T>)
    })
  }, [form])

  useEffect(() => {
    i18n.on('languageChanged', triggerInvalidFields)
    return () => {
      i18n.off('languageChanged', triggerInvalidFields)
    }
  })

  return form
}
