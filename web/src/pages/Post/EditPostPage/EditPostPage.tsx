import EditPostCell from 'src/components/Post/EditPostCell'

type PostPageProps = {
  slug: string
}

const EditPostPage = ({ slug }: PostPageProps) => {
  return <EditPostCell slug={slug} />
}

export default EditPostPage
