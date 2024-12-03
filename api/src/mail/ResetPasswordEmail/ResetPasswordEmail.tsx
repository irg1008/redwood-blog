import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import i18next, { t } from 'i18next'

type ResetPasswordEmailProps = {
  email: string
  resetLink: string
}

export const ResetPasswordEmail = ({
  email,
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html lang={i18next.language}>
      <Head />
      <Preview>{t('emails.reset-password.preview')}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] rounded border border-solid border-gray-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {t('emails.reset-password.header', { email })}
            </Heading>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[14px] leading-[24px] text-black">
              {t('emails.reset-password.click-link')}
            </Text>

            <Link
              href={resetLink}
              className="text-[14px] leading-[24px] text-black"
            >
              {t('emails.reset-password.c2a')}
            </Link>

            <Text className="text-[14px] leading-[24px] text-black">
              {t('emails.reset-password.fallback')}
            </Text>

            <Text
              className="text-[14px] leading-[24px] text-black"
              style={{ wordBreak: 'break-all' }}
            >
              {resetLink}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
