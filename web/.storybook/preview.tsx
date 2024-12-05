import * as React from 'react'

import type { GlobalTypes } from '@storybook/csf'
import type { Preview } from '@storybook/react'
import { I18nextProvider } from 'react-i18next'

import { MockProviders } from '@redwoodjs/testing/web'

import i18n from 'src/i18n/i18n'

export const globalTypes: GlobalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        {
          value: 'en',
          right: '🇺🇸',
          title: 'English',
        },
        {
          value: 'es',
          right: '🇪🇸',
          title: 'Español',
        },
      ],
    },
  },
}

const preview: Preview = {
  decorators: [
    (Story, context) => {
      React.useEffect(() => {
        i18n.changeLanguage(context.globals.locale)
      }, [context.globals.locale])

      return (
        <I18nextProvider i18n={i18n}>
          <MockProviders>
            <Story />
          </MockProviders>
        </I18nextProvider>
      )
    },
  ],
}

export default preview
