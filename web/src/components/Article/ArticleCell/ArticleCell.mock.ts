import { FindArticleQuery } from 'types/graphql'

// Define your own mock data here:
export const standard = (/* vars, { ctx, req } */) => ({
  article: {
    id: 1,
    user: {
      name: 'Alice',
    },
    title: 'First Post',
    slug: 'first-post',
    body: `Neutra tacos hot chicken prism raw denim, put a bird on it enamel pin post-ironic vape cred DIY. Street art next level umami squid. Hammock hexagon glossier 8-bit banjo. Neutra la croix mixtape echo park four loko semiotics kitsch forage chambray. Semiotics salvia selfies jianbing hella shaman. Letterpress helvetica vaporware cronut, shaman butcher YOLO poke fixie hoodie gentrify woke heirloom.`,
    createdAt: '2020-01-01T12:34:56Z',
  } satisfies FindArticleQuery['article'],
})
