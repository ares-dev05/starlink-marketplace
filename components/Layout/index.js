import { Box, Flex } from '@chakra-ui/layout'

import CornerGlow from '../CornerGlow'
import Header from '../Header'
import MobileMenu from '../MobileMenu'
import { MobileMenuWrapper } from '../../context/mobile-menu'
import React from 'react'

const Layout = ({ children, noBackground }) => {
    return (
        <>
            <Flex
                p={3.5}
                h="100%"
                minH="100%"
                flexDirection="column"
                id="outer"
                backgroundImage={noBackground ? null : '/market-bg.png'}
                backgroundRepeat={noBackground ? null : 'no-repeat'}
                backgroundSize={['contain', 'contain', 'unset']}
            >
                <Flex
                    id="header"
                    pb={5}
                    position="relative"
                    alignItems="center"
                    zIndex={1}
                >
                    <MobileMenuWrapper>
                        <Header />
                        <MobileMenu />
                    </MobileMenuWrapper>
                </Flex>
                <Box zIndex={1} id="main">
                    {children}
                </Box>
            </Flex>
            <CornerGlow />
        </>
    )
}

export default Layout
