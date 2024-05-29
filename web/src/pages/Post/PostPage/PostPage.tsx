import PostCell from 'src/components/Post/PostCell'

type PostPageProps = {
  slug: string
}

const PostPage = ({ slug }: PostPageProps) => {
  return <PostCell slug={slug} />
}

export default PostPage
