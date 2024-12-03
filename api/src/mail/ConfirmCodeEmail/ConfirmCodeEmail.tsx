import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
  Text,
} from '@react-email/components'
import i18next, { t } from 'i18next'
import { ConfirmUserInput } from 'types/graphql'

export const ConfirmCodeEmail = ({ code }: ConfirmUserInput) => {
  return (
    <Html lang={i18next.language}>
      <Head />
      <Preview>{t('emails.confirm-user.preview')}</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] rounded border border-solid border-gray-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              {t('emails.confirm-user.header')}
            </Heading>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[14px] leading-[24px] text-black">
              {code}
            </Text>

            <Text className="text-[14px] leading-[24px] text-black">
              {t('emails.confirm-user.unrequested')}
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
