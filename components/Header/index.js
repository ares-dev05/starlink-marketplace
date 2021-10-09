import { Box, Flex, Spacer, Stack } from '@chakra-ui/react'

import HamburgerIcon from '../HamburgerIcon'
import React from 'react'
import StarlLogo from '../StarlLogo'
import { Toaster } from 'react-hot-toast'
import TopNav from '../TopNav'
import WalletConnect from '../WalletConnect'

const Header = () => {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <StarlLogo />
            <Spacer />
            <Flex align="flex-end" display={['flex', 'flex', 'flex', 'none']}>
                <HamburgerIcon />
            </Flex>

            <Stack
                display={['none', 'none', 'none', 'flex']}
                direction="row"
                align="center"
                position="absolute"
                top="4px"
                right="0"
            >
                <Box mr="20px">
                    <TopNav />
                </Box>
                <Box
                    w="1px"
                    backgroundColor="rgba(105, 105, 105, 0.5)"
                    height="43px"
                />
                <WalletConnect />
            </Stack>
        </>
    )
}

export default Header
