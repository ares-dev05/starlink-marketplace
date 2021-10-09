import { Button, Flex, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { APR_TIERS } from '../../utils/const'
import { CloseIcon } from '@chakra-ui/icons'
import SortBy from '../SortbyComponent'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const Btn = ({ onClick, label }) => {
    return (
        <Button
            onClick={onClick}
            rightIcon={<CloseIcon />}
            colorScheme="teal"
            variant="outline"
            fontSize={label.length > 10 ? '11px' : '12px'}
            // pl="10px"
            // pr="10px"
        >
            {label}
        </Button>
    )
}

const ItemListHeader = ({ tokensCount }) => {
    const {
        liveAuction,
        priceRange,
        selectedFilters,
        aprFilters,
        useSetLiveAuction,
        useResetFilters,
        useSetPriceRange,
        useResetAprs,
        filterCount,
    } = useMarketplaceFilterContext()
    const selectedAprs = Object.keys(aprFilters).filter(
        (apr) => aprFilters[apr]
    )
    const hasFilters =
        liveAuction.onAuction ||
        liveAuction.onBuyNow ||
        priceRange.min > 0 ||
        priceRange.max > 0 ||
        selectedFilters.satellites ||
        selectedFilters.livingModules ||
        selectedAprs.length > 0
    const handleOnAuction = () => {
        useSetLiveAuction({
            ...liveAuction,
            onAuction: false,
        })
    }
    const handleOnBuyNow = () => {
        useSetLiveAuction({
            ...liveAuction,
            onBuyNow: false,
        })
    }
    const handleSatellites = () => {
        useResetFilters({
            ...selectedFilters,
            satellites: false,
        })
    }
    const handleLivingModules = () => {
        useResetFilters({
            ...selectedFilters,
            livingModules: false,
        })
    }
    const handleClearFilters = () => {
        useSetLiveAuction({
            onAuction: false,
            onBuyNow: false,
        })
        useSetPriceRange({
            min: 0,
            max: 0,
        })
        useResetFilters({
            satellites: false,
            livingModules: false,
        })
        useResetAprs({
            0: false,
            10: false,
            15: false,
            20: false,
        })
    }
    const handlePriceRange = () => {
        useSetPriceRange({
            min: 0,
            max: 0,
        })
    }
    const handleAprFilters = (apr) => {
        useResetAprs({
            ...aprFilters,
            [apr]: false,
        })
    }
    return (
        <Flex w="100%" mt={['0', '0', '1.5rem']} flexDirection="column">
            <Flex flexDir="row" justifyContent="space-between">
                <Flex alignItems="center">
                    <Flex
                        fontWeight="700"
                        flexDir="row"
                        fontSize={['12px', '12px', '15px', '15px', '15px']}
                    >
                        <Text color="white" mr="4px">
                            {tokensCount}
                        </Text>
                        NFTS Found
                    </Flex>
                </Flex>

                <Flex
                    textColor="#bcc0c1"
                    fontSize="14px"
                    alignItems="center"
                    justifyContent={['none', 'none', 'flex-end']}
                    mt={['1rem', '1rem', '0']}
                    display={['none', 'none', 'none', 'flex', 'flex']}
                >
                    <Text>Sort by</Text>
                    <Flex h="40px" ml="1rem">
                        <SortBy />
                    </Flex>
                </Flex>
                {filterCount > 0 && (
                    <Button
                        variant="ghost"
                        color="#DF83D0"
                        onClick={handleClearFilters}
                        fontSize="14px"
                        _hover={{ bgColor: 'transparent', color: 'white' }}
                        display={['inline', 'inline', 'inline', 'none']}
                        hight="20px"
                        pr="0"
                    >
                        CLEAR ALL FILTERS
                    </Button>
                )}
            </Flex>
            {hasFilters && (
                <SimpleGrid
                    direction="row"
                    spacing={4}
                    align="center"
                    mt="16px"
                    display={['none', 'none', 'none', 'flex']}
                    minChildWidth="110px"
                    display={[
                        'none',
                        'none',
                        filterCount >= 4 ? 'none' : 'none',
                        filterCount > 5 ? 'grid' : 'flex',
                        filterCount > 7 ? 'grid' : 'flex',
                    ]}
                >
                    {liveAuction.onAuction && (
                        <Btn label="On Auction" onClick={handleOnAuction} />
                    )}
                    {liveAuction.onBuyNow && (
                        <Btn label="Buy Now" onClick={handleOnBuyNow} />
                    )}
                    {priceRange.min > 0 && (
                        <Btn
                            label={`From: ${priceRange.min} `}
                            onClick={handlePriceRange}
                        />
                    )}
                    {priceRange.max > 0 && (
                        <Btn
                            label={`To: ${priceRange.max} `}
                            onClick={handlePriceRange}
                        />
                    )}
                    {selectedFilters.satellites && (
                        <Btn label="Satellites" onClick={handleSatellites} />
                    )}
                    {selectedFilters.livingModules && (
                        <Btn
                            label="Living Modules"
                            onClick={handleLivingModules}
                        />
                    )}
                    {selectedAprs.map((apr) => (
                        <Btn
                            label={APR_TIERS[apr]}
                            onClick={() => handleAprFilters(apr)}
                        />
                    ))}
                    <Button
                        variant="ghost"
                        color="#DF83D0"
                        onClick={handleClearFilters}
                        fontSize="13px"
                        pl="4px"
                        pr="4px"
                        _hover={{ bgColor: 'transparent', color: 'white' }}
                    >
                        CLEAR ALL FILTERS
                    </Button>
                </SimpleGrid>
            )}
        </Flex>
    )
}

export default ItemListHeader
