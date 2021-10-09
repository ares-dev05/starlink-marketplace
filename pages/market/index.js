import React from 'react'
import { Box } from '@chakra-ui/react'
import MobileFilterDrawer from '../../components/MobileFilterDrawer'
import ItemList from '../../components/ItemList'
import { MarketplaceFilterWrapper } from '../../context/marketplace-filter' // import based on where you put it

const MarketPage = () => {
    return (
        <MarketplaceFilterWrapper>
            <ItemList />
            <Box
                p={3.5}
                position="relative"
                display={{ base: 'flex', md: 'none' }}
                alignItems="center"
                zIndex={1}
            >
                <MobileFilterDrawer />
            </Box>
        </MarketplaceFilterWrapper>
    )
}

export default MarketPage
