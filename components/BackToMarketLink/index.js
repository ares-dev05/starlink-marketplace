import { Flex, Link, Square, Text } from '@chakra-ui/layout'

import { Image } from '@chakra-ui/react'
import NextLink from 'next/link'

export const BackToMarketLink = () => {
    return (
        <NextLink href="/market" passHref>
            <Link
                _hover={{
                    textDecoration: 'none',
                }}
            >
                <Flex direction="row" alignItems="center" as="button">
                    <Square
                        size="33px"
                        borderRadius="8px"
                        bg="#1C1D27"
                        p="10px"
                        transition="0.2s linear"
                    >
                        <Image
                            src="/arrow.svg"
                            h="9px"
                            w="7px"
                            ignoreFallback
                        />
                    </Square>
                    <Text
                        fontSize="13px"
                        fontWeight="700"
                        color="white"
                        ml="10px"
                    >
                        BACK TO MARKET
                    </Text>
                </Flex>
            </Link>
        </NextLink>
    )
}

export default BackToMarketLink
