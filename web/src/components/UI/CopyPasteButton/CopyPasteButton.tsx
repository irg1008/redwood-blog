import { useEffect, useState } from 'react'

import { Button, Tooltip } from '@nextui-org/react'
import { CheckIcon, ClipboardCopyIcon, ClipboardPasteIcon } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useTranslation } from 'react-i18next'

type CopyPasteButton<T extends string = string> =
  | {
      value: T
      onCopy?: (value: CopyPasteButton['value']) => void
      onPaste?: never
    }
  | {
      value?: never
      onCopy?: never
      onPaste: (value: string) => void
    }

const CopyPasteButton = ({ onCopy, onPaste, value }: CopyPasteButton) => {
  const { t } = useTranslation()
  const [showSuccess, setShowSuccess] = useState(false)

  const showSuccessTime = 2000
  const showAnimationClass = 'animate-appearance-in'

  useEffect(() => {
    if (showSuccess) {
      const timeout = setTimeout(() => {
        setShowSuccess(false)
      }, showSuccessTime)

      return () => clearTimeout(timeout)
    }
  }, [showSuccess])

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setShowSuccess(true)
      onPaste?.(text)
      toast.success(t('common.paste', { context: 'success' }), {
        id: 'paste-success',
      })
    } catch (err) {
      console.error(err)
      toast.error(t('common.paste', { context: 'error' }), {
        id: 'paste-error',
      })
    }
  }

  const copyToClipboard = async () => {
    if (!value) return

    try {
      await navigator.clipboard.writeText(value)
      setShowSuccess(true)
      onCopy?.(value)
      toast.success(t('common.copy', { context: 'success' }), {
        id: 'copy-success',
      })
    } catch (err) {
      console.error(err)
      toast.error(t('common.copy', { context: 'error' }), {
        id: 'copy-error',
      })
    }
  }

  return value ? (
    <Tooltip content={t('common.copy')}>
      <Button
        onClick={copyToClipboard}
        isIconOnly
        variant="light"
        aria-label={t('common.copy')}
      >
        {showSuccess ? (
          <CheckIcon className={showAnimationClass} />
        ) : (
          <ClipboardCopyIcon className={showAnimationClass} />
        )}
      </Button>
    </Tooltip>
  ) : (
    <Tooltip content={t('common.paste')}>
      <Button
        onClick={pasteFromClipboard}
        isIconOnly
        variant="light"
        aria-label={t('common.paste')}
      >
        {showSuccess ? (
          <CheckIcon className={showAnimationClass} />
        ) : (
          <ClipboardPasteIcon className={showAnimationClass} />
        )}
      </Button>
    </Tooltip>
  )
}

export default CopyPasteButton
