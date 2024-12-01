import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation()
  return (
    <div>
      <h2>{t('common.loading')}</h2>
    </div>
  )
}

export default Loading
