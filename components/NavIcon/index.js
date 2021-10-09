import { Flex, Image, Link, Square, Text } from '@chakra-ui/react'

import NextLink from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'

const NavIcon = ({ label, path, svg, h, w, bg_colour }) => {
    const [isHovering, setIsHovering] = useState(false)
    const router = useRouter()
    const sPath = `/${path}`
    const isActive = router.pathname === sPath
    return (
        <NextLink href={sPath} passHref>
            <Link
                _hover={{ textDecoration: 'none' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
            >
                <Flex direction="column" align="center">
                    <Square
                        mt="-30px"
                        size="36px"
                        borderRadius="10px"
                        bg={isActive || isHovering ? bg_colour : ''}
                        transition="0.2s linear"
                    ></Square>
                    <Image
                        mt="14px"
                        src={`/icons/${svg}.svg`}
                        h={`${h}px`}
                        w={`${w}px`}
                        ignoreFallback
                    />
                    <Text
                        mt="8px"
                        textTransform="uppercase"
                        fontSize="9px"
                        fontWeight="500"
                        color={isHovering || isActive ? 'white' : 'transparent'}
                        transition="all 0.2s ease-in-out"
                    >
                        {label}
                    </Text>
                </Flex>
            </Link>
        </NextLink>
    )
}

export default NavIcon
