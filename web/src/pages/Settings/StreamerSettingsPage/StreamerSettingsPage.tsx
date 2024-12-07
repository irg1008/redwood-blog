// import { Link, routes } from '@redwoodjs/router'
import { Button, Card, CardBody, Input } from '@nextui-org/react'
import { AlertTriangleIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import {
  CreateStreamKeyMutation,
  CreateStreamKeyMutationVariables,
} from 'types/graphql'

import { Metadata, useMutation } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import CopyPasteButton from 'src/components/UI/CopyPasteButton/CopyPasteButton'

const CREATE_KEY = gql`
  mutation CreateStreamKeyMutation {
    createStreamKey {
      streamKey
    }
  }
`

const StreamerSettingsPage = () => {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const [createStreamKey, { loading, data }] = useMutation<
    CreateStreamKeyMutation,
    CreateStreamKeyMutationVariables
  >(CREATE_KEY, {
    onError(error) {
      toast.error(error.message)
    },
    onCompleted() {
      const message = t('StreamerSettings.actions.generate-key', {
        context: 'success',
      })
      toast.success(message, { id: 'stream-key' })
    },
  })

  const streamKey = data?.createStreamKey?.streamKey

  return (
    <>
      <Metadata
        title={t('StreamerSettings.title')}
        description={t('StreamerSettings.description')}
      />

      <section className="flex flex-col gap-4">
        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <Input
              label={t('StreamerSettings.form.stream-key.label')}
              value={streamKey ?? '-'}
              readOnly
              endContent={streamKey && <CopyPasteButton value={streamKey} />}
            />
            <Button
              color="warning"
              disabled={loading}
              onClick={() => createStreamKey()}
            >
              {t('StreamerSettings.actions.generate-key')}
            </Button>
          </div>
        ) : (
          <p className="text-center">
            {t('StreamerSettings.warnings.logged-in')}
          </p>
        )}

        {streamKey && (
          <Card className="bg-warning-600 text-warning-foreground">
            <CardBody>
              <p className="flex items-center gap-2">
                <AlertTriangleIcon className="size-[1.2em]" />
                {t('StreamerSettings.warnings.private-key')}
              </p>
            </CardBody>
          </Card>
        )}
      </section>
    </>
  )
}

export default StreamerSettingsPage
