import { Image } from '@chakra-ui/react'
import NextLink from 'next/link'

const StarlLogo = () => {
    return (
        <NextLink href="/market" passHref>
            <Image
                src="/starl-market-logo.svg"
                h="45px"
                w="100px"
                objectFit="contain"
                ignoreFallback
                cursor="pointer"
            />
        </NextLink>
    )
}

export default StarlLogo
