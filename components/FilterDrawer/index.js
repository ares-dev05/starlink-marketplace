import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
} from '@chakra-ui/react'
import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    Image,
    NumberInput,
    NumberInputField,
    Spacer,
    Stack,
    Text,
    VStack,
} from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'

import AprFilterButton from '../AprFilterButon'
import CustomCheckbox from '../CustomCheckbox'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const FilterDrawer = ({ handleFiltersOpen, noHeader }) => {
    const {
        selectedFilters,
        liveAuction,
        useSetLiveAuction,
        priceRange,
        useSetPriceRange,
        aprFilters,
        useSetAprFilters,
    } = useMarketplaceFilterContext()

    const [priceFilter, setPriceFilter] = useState({
        min: priceRange.min > 0 ? priceRange.min : null,
        max: priceRange.max > 0 ? priceRange.max : null,
    })

    useEffect(() => {
        setPriceFilter({
            min: priceRange.min > 0 ? priceRange.min : null,
            max: priceRange.max > 0 ? priceRange.max : null,
        })
    }, [priceRange])

    const handleOnAuction = () => {
        useSetLiveAuction({
            ...liveAuction,
            onAuction: !liveAuction.onAuction,
        })
    }
    const handleOnBuyNow = () => {
        useSetLiveAuction({
            ...liveAuction,
            onBuyNow: !liveAuction.onBuyNow,
        })
    }
    const handleAprFilterChange = (apr) => {
        useSetAprFilters(apr, !aprFilters[apr])
    }

    const onChangePriceFilter = (range) => {
        setPriceFilter(range)
    }

    const handleApply = () => {
        useSetPriceRange(priceFilter)
    }

    return (
        <>
            {!noHeader && (
                <Stack
                    direction="row"
                    spacing="17px"
                    alignItems="center"
                    pl="2px"
                    pt="22px"
                    pb="22px"
                >
                    <Image
                        width="24px"
                        height="19px"
                        src="filter-icon.svg"
                        ignoreFallback
                    />
                    <Box>
                        <Text fontSize="13px" fontWeight="700">
                            FILTER RESULTS
                        </Text>
                    </Box>
                    <Spacer />
                    <Box as="button" onClick={handleFiltersOpen}>
                        <Box
                            _hover={{
                                'img:first-of-type': {
                                    transform: 'translateX(-4px)',
                                },
                            }}
                        >
                            <Image
                                mr="15px"
                                width="15px"
                                height="13px"
                                src="filter-arrow-left.svg"
                                transition="transform .2s ease-out"
                                ignoreFallback
                            />
                        </Box>
                    </Box>
                </Stack>
            )}
            <Accordion
                defaultIndex={[0, 1, 2]}
                allowMultiple
                borderColor="rgba(255, 255, 255, 0.15)"
            >
                <AccordionItem>
                    <AccordionButton pt="22px" pb="22px">
                        <Box flex="1" textAlign="left">
                            <Text fontSize="13px" fontWeight="700">
                                Status
                            </Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Flex>
                            <ButtonGroup>
                                <Button
                                    variant="outline"
                                    bg={
                                        liveAuction.onAuction
                                            ? 'four'
                                            : 'transparent'
                                    }
                                    borderColor={
                                        liveAuction.onAuction ? 'four' : 'white'
                                    }
                                    _hover={{
                                        bg: '#transparent',
                                        color: 'four',
                                    }}
                                    _active={{
                                        bg: '#transparent',
                                        color: 'four',
                                    }}
                                    onClick={handleOnAuction}
                                >
                                    <Text
                                        color="white"
                                        fontWeight="700"
                                        fontSize="12px"
                                    >
                                        ON AUCTION
                                    </Text>
                                </Button>
                                <Button
                                    variant="outline"
                                    bg="transparent"
                                    bg={
                                        liveAuction.onBuyNow
                                            ? 'four'
                                            : 'transparent'
                                    }
                                    borderColor={
                                        liveAuction.onBuyNow ? 'four' : 'white'
                                    }
                                    _hover={{
                                        bg: '#transparent',
                                        color: 'four',
                                    }}
                                    _active={{
                                        bg: '#transparent',
                                        color: 'four',
                                    }}
                                    onClick={handleOnBuyNow}
                                >
                                    <Text
                                        color="white"
                                        fontWeight="700"
                                        fontSize="12px"
                                    >
                                        BUY NOW
                                    </Text>
                                </Button>
                            </ButtonGroup>
                        </Flex>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton pt="22px" pb="22px">
                        <Box flex="1" textAlign="left">
                            <Text fontSize="13px" fontWeight="700">
                                Price Range
                            </Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <Flex
                            w="100%"
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <Flex w="44%">
                                <NumberInput
                                    variant="flushed"
                                    placeholder="Min"
                                    onChange={(value) =>
                                        onChangePriceFilter({
                                            min: Math.min(value, 9999999999999),
                                            max: priceFilter.max,
                                        })
                                    }
                                    value={
                                        priceFilter.min
                                            ? priceFilter.min.toLocaleString()
                                            : ''
                                    }
                                    borderColor="rgba(255, 255, 255, 0.5)"
                                >
                                    <NumberInputField
                                        placeholder="Min ($STARL)"
                                        fontWeight="300"
                                        fontSize="16px"
                                        pr="4px"
                                        h="30px"
                                        maxLength={17}
                                    />
                                </NumberInput>
                            </Flex>
                            <Text
                                fontSize="12px"
                                fontWeight="700"
                                color="white"
                            >
                                TO
                            </Text>
                            <Flex w="44%" justifyContent="center">
                                <NumberInput
                                    variant="flushed"
                                    placeholder="Max"
                                    onChange={(value) =>
                                        onChangePriceFilter({
                                            min: priceFilter.min,
                                            max: Math.min(value, 9999999999999),
                                        })
                                    }
                                    value={
                                        priceFilter.max
                                            ? priceFilter.max.toLocaleString()
                                            : ''
                                    }
                                    borderColor="rgba(255, 255, 255, 0.5)"
                                >
                                    <NumberInputField
                                        placeholder="Max ($STARL)"
                                        fontWeight="300"
                                        fontSize="16px"
                                        pr="4px"
                                        h="30px"
                                        maxLength={17}
                                    />
                                </NumberInput>
                            </Flex>
                        </Flex>
                        <Flex mt="20px" w="100%">
                            <Button
                                w="100px"
                                variant="outline"
                                bg="transparent"
                                borderColor="#CECECE"
                                _hover={{ bg: '#494949' }}
                                onClick={handleApply}
                            >
                                <Text
                                    color="white"
                                    fontWeight="700"
                                    fontSize="12px"
                                >
                                    APPLY
                                </Text>
                            </Button>
                        </Flex>
                    </AccordionPanel>
                </AccordionItem>
                <AccordionItem>
                    <AccordionButton pt="22px" pb="22px">
                        <Box flex="1" textAlign="left">
                            <Text fontSize="13px" fontWeight="700">
                                Category
                            </Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        <VStack space={5}>
                            <CustomCheckbox
                                category="satellites"
                                checked={selectedFilters.satellites}
                                title="Satellites"
                            />
                            <CustomCheckbox
                                category="livingModules"
                                checked={selectedFilters.livingModules}
                                title="Living Modules"
                            />
                        </VStack>
                    </AccordionPanel>
                </AccordionItem>

                <AccordionItem>
                    <AccordionButton pt="22px" pb="22px">
                        <Box flex="1" textAlign="left">
                            <Text fontSize="13px" fontWeight="700">
                                APR
                            </Text>
                        </Box>
                        <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                        {[0, 20, 15, 10].map((apr) => (
                            <AprFilterButton
                                key={apr}
                                apr={apr}
                                aprFilters={aprFilters}
                                handleAprFilterChange={() =>
                                    handleAprFilterChange(apr)
                                }
                            />
                        ))}
                    </AccordionPanel>
                </AccordionItem>
            </Accordion>
        </>
    )
}

export default FilterDrawer
