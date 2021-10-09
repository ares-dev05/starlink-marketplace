import { Box, Image } from '@chakra-ui/react'

import { useMobileMenuContext } from '../../context/mobile-menu'

const HamburgerIcon = () => {
    const { onOpen } = useMobileMenuContext()
    return (
        <Box as="button" onClick={onOpen}>
            <Image
                alt="Menu Icon"
                w="31px"
                h="17px"
                src="/hamburger.svg"
                ignoreFallback
            />
        </Box>
    )
}

export default HamburgerIcon
