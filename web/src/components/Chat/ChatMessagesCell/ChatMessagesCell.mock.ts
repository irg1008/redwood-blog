import { ChatMessageFragment } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  chatMessages: Array.from({ length: 20 }, (_, index) => ({
    body: `Message ${index + 1}`,
    createdAt: '2021-07-01T00:00:00.000Z',
    id: index + 1,
    user: {
      displayName: `User ${(index % 5) + 1}`, // Cycle through 5 different users
      id: (index % 5) + 1,
    },
  })) satisfies ChatMessageFragment[],
})
