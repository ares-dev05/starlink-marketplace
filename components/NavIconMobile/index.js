import { Flex, Image, Link, Square, Text } from '@chakra-ui/react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'

const NavIconMobile = ({ onClick, label, path, svg, h, w, bg_colour }) => {
    const router = useRouter()
    const sPath = `/${path}`
    const isActive = router.pathname === sPath
    return (
        <NextLink href={sPath} passHref>
            <Link _hover={{ textDecoration: 'none' }}>
                <Flex
                    direction="row"
                    align="center"
                    as="button"
                    onClick={onClick}
                    alignItems="center"
                >
                    <Flex
                        // mt="-30px"
                        // size="36px"
                        borderRadius="10px"
                        bg={isActive ? bg_colour : ''}
                        // transition="0.2s linear"
                        w="50px"
                        h="50px"
                        justify="center"
                        alignItems="center"
                    >
                        <Image
                            // mt="14px"
                            src={`/icons/${svg}.svg`}
                            h={`${h}px`}
                            w={`${w}px`}
                            ignoreFallback
                        />
                    </Flex>
                    <Text
                        ml="24px"
                        textTransform="uppercase"
                        fontSize="16px"
                        fontWeight="700"
                        color="white"
                        transition="all 0.2s ease-in-out"
                    >
                        {label}
                    </Text>
                </Flex>
            </Link>
        </NextLink>
    )
}

export default NavIconMobile
