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

type ResetPasswordEmailProps = {
  email: string
  resetLink: string
}

export const ResetPasswordEmail = ({
  email,
  resetLink,
}: ResetPasswordEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Preview>Reset your password</Preview>
      <Tailwind>
        <Body className="mx-auto my-auto bg-white font-sans">
          <Container className="mx-auto my-[40px] rounded border border-solid border-gray-200 p-[20px]">
            <Heading className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
              Reset the password for {email}
            </Heading>
            <Hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[14px] leading-[24px] text-black">
              Click on the link below to reset your password.
            </Text>

            <Link
              href={resetLink}
              className="text-[14px] leading-[24px] text-black"
            >
              Reset password
            </Link>

            <Text className="text-[14px] leading-[24px] text-black">
              {`If you can't click the link, copy and paste the following URL into
              your browser:`}
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
