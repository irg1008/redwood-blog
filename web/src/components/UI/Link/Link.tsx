import { ComponentProps } from 'react'

import { Link as NextLink, cn } from '@nextui-org/react'

import { Link as RWLink } from '@redwoodjs/router'

type LinkProps = ComponentProps<typeof RWLink> & ComponentProps<typeof NextLink>

const Link = (props: LinkProps) => (
  <NextLink
    as={RWLink}
    {...props}
    className={cn('cursor-pointer', props.className)}
  />
)

export default Link
