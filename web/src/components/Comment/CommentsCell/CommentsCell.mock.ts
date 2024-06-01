import { ComponentProps } from 'react'

import Comment from 'src/components/Comment/Comment'

export const standard = () => ({
  comments: [
    {
      id: 1,
      postId: 1,
      name: 'James May',
      body: 'Bollocks! Oh Cook!',
      createdAt: '2022-01-01T12:34:56Z',
    },
    {
      id: 2,
      postId: 1,
      name: 'Richard Hammond',
      body: 'My car is electric',
      createdAt: '2029-07-05T17:00:00Z',
    },
    {
      id: 3,
      postId: 2,
      name: 'Jeremy Clarkson',
      body: 'More power!',
      createdAt: '1995-12-01T09:15:34Z',
    },
  ] satisfies ComponentProps<typeof Comment>['comment'][],
})
