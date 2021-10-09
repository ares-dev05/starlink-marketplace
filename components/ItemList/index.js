import {
    Container,
    Next,
    PageGroup,
    Paginator,
    Previous,
} from 'chakra-paginator'
import { Flex, Image, SimpleGrid, Spinner } from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import { queryPaginationSates, querySates } from '../../utils/graphql'

import AlertModal from '../AlertModal'
import { Box } from '@chakra-ui/layout'
import CustomButton from '../CustomButton'
import FilterDrawer from '../FilterDrawer'
import ItemCard from '../ItemCard'
import ItemListHeader from '../ItemListHeader'
import { PAGE_SIZE } from '../../utils/const'
import { getStarlPrice } from '../../lib/helper'
import { useBreakpointValue } from '@chakra-ui/react'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

//
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop - 20)

const baseStyles = {
    w: 7,
    border: '1px solid',
    borderColor: 'white',
    fontSize: 'sm',
    _hover: {
        background: 'rgba(255, 255, 255, 0.1)',
    },
    _active: {
        background: 'rgba(255, 255, 255, 0.2)',
    },
}

const normalStyles = {
    ...baseStyles,
    bg: 'transparent',
}

const activeStyles = {
    ...baseStyles,
    bg: 'rgba(255, 255, 255, 0.3)',
}

const separatorStyles = {
    w: 7,
    bg: 'transparent',
}

const ItemList = () => {
    const { selectedFilters, aprFilters, priceRange, onOpen, filterCount } =
        useMarketplaceFilterContext()
    const { orderBy } = useMarketplaceFilterContext()
    const { liveAuction } = useMarketplaceFilterContext()
    const [price, setPrice] = useState(0)
    const [tokens, setTokens] = useState([])
    const [loading, setLoading] = useState(false)
    const [retry, setRetry] = useState(false)
    const [tokensCount, setTokensCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [refreshLeftTime, setRefreshLeftTime] = useState(0)
    const [isFiltersOpen, setFiltersOpen] = useState(true)
    const isDesktopView = useBreakpointValue({ lg: true })

    useEffect(() => {
        const timer = setInterval(() => {
            setRefreshLeftTime(refreshLeftTime + 1)
        }, 1000)
        return () => {
            if (timer) {
                clearInterval(timer)
            }
        }
    })

    useEffect(() => {
        getStarlPrice().then((starlPrice) => {
            setPrice(starlPrice)
        })
        loadTokens()
    }, [liveAuction, orderBy, selectedFilters, aprFilters, priceRange])

    const handleRetry = () => {
        loadTokens()
    }

    const loadTokens = () => {
        setLoading(true)
        setRetry(false)
        querySates(
            selectedFilters,
            aprFilters,
            priceRange,
            liveAuction,
            orderBy
        )
            .then((data) => {
                if (data) {
                    setLoading(false)
                    setTokens(data.tokens)
                    setTokensCount(data.all.length)
                } else {
                    setLoading(false)
                    setRetry(true)
                }
            })
            .catch((err) => {
                setLoading(false)
                setRetry(true)
            })
    }

    const handlePageChange = (nextPage) => {
        setLoading(true)
        setCurrentPage(nextPage)
        queryPaginationSates(
            selectedFilters,
            aprFilters,
            priceRange,
            liveAuction,
            orderBy,
            nextPage
        )
            .then((sates) => {
                if (sates) {
                    setLoading(false)
                    setTokens(sates)
                    // scrollToRef(marketingHeaderRef)
                } else {
                    setLoading(false)
                    setRetry(true)
                }
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
                setRetry(true)
            })
    }

    const handleFiltersOpen = () => {
        setFiltersOpen(!isFiltersOpen)
    }

    const calcGridColumns = () => {
        let columns = []
        if (isDesktopView) {
            if (isFiltersOpen) {
                columns = [null, null, null, '3', '4', '5']
            } else {
                columns = [null, null, null, '4', '5', '6']
            }
        }
        if (!isDesktopView) {
            columns = ['1', '2', '3']
        }
        return columns
    }

    const calcGridPadding = () => {
        let padding = []
        if (isDesktopView) {
            if (isFiltersOpen) {
                padding = ['0', '0', '0', '0 0 0 20px', '0 0 0 80px']
            } else {
                padding = '0 0 0 20px'
            }
        }
        return padding
    }

    const subNavWith = '70px'

    return (
        <Flex h="100%" mt="20px">
            <Flex display={['none', 'none', 'none', 'flex']}>
                <Box
                    zIndex="1"
                    h="100%"
                    w={subNavWith}
                    bg="six"
                    pt={5}
                    align="center"
                    opacity={isFiltersOpen ? '0' : '1'}
                    transition="all 0.2s ease-in-out"
                    ml={-3.5}
                >
                    <Box
                        as="button"
                        onClick={handleFiltersOpen}
                        _hover={{
                            'img:last-of-type': {
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        <Flex align="center">
                            <Image
                                mr="4px"
                                width="24px"
                                height="19px"
                                src="filter-icon.svg"
                                ignoreFallback
                                display={isFiltersOpen ? 'none' : 'block'}
                                animation="fadeRemove .2s ease-in-out"
                            />
                            <Image
                                transition="transform .2s ease-out"
                                width="10px"
                                height="9px"
                                src="filter-arrow-right.svg"
                                ignoreFallback
                            />
                        </Flex>
                    </Box>
                </Box>
                <Box
                    w="300px"
                    h="100%"
                    zIndex="0"
                    display={isFiltersOpen ? 'block' : 'none'}
                    animation="grow .2s ease-in-out"
                >
                    <FilterDrawer handleFiltersOpen={handleFiltersOpen} />
                </Box>
            </Flex>
            <Box flex="1" transition="all 0.2s ease-out" p={calcGridPadding()}>
                <ItemListHeader tokensCount={tokensCount} />
                <AlertModal isOpen={retry} onClose={handleRetry} />
                {loading ? (
                    <Flex
                        flexDirection="column"
                        w="100%"
                        h="350px"
                        mt="1rem"
                        lineHeight="30px"
                        borderRadius="6px"
                        p="1rem"
                        cursor="pointer"
                    >
                        <Spinner
                            size="xl"
                            thickness="4px"
                            color="blue.500"
                            emptyColor="gray.600"
                            m="auto"
                        />
                    </Flex>
                ) : (
                    <Flex flexDirection="column">
                        <SimpleGrid
                            spacing="40px"
                            mt="20px"
                            columns={calcGridColumns()}
                            gap={['10px', '10px', null]}
                        >
                            {tokens.map((token) => (
                                <ItemCard
                                    token={token}
                                    key={token.id}
                                    starlPrice={price}
                                    refreshLeftTime={refreshLeftTime}
                                />
                            ))}
                        </SimpleGrid>

                        {tokensCount > PAGE_SIZE && (
                            <Paginator
                                activeStyles={activeStyles}
                                currentPage={currentPage}
                                innerLimit={2}
                                normalStyles={normalStyles}
                                onPageChange={handlePageChange}
                                outerLimit={2}
                                pagesQuantity={Math.ceil(
                                    tokensCount / PAGE_SIZE
                                )}
                                separatorStyles={separatorStyles}
                            >
                                <Container
                                    align="center"
                                    justify="space-between"
                                    p={5}
                                    w="full"
                                >
                                    <Previous
                                        bg="transparent"
                                        border="1px solid"
                                        borderColor="white"
                                        _hover={{
                                            background:
                                                'rgba(255, 255, 255, 0.1)',
                                        }}
                                        _active={{
                                            background:
                                                'rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        {`<`}
                                    </Previous>
                                    <PageGroup isInline align="center" />
                                    <Next
                                        bg="transparent"
                                        border="1px solid"
                                        borderColor="white"
                                        _hover={{
                                            background:
                                                'rgba(255, 255, 255, 0.1)',
                                        }}
                                        _active={{
                                            background:
                                                'rgba(255, 255, 255, 0.2)',
                                        }}
                                    >
                                        {`>`}
                                    </Next>
                                </Container>
                            </Paginator>
                        )}
                    </Flex>
                )}
            </Box>
            <Flex
                flexDirection="row"
                justify="center"
                display={['flex', 'flex', 'flex', 'none']}
                pos="fixed"
                bottom="20px"
                w="100%"
            >
                <CustomButton
                    title="Filter Results"
                    icon="filter-icon.svg"
                    border="2px solid #794194"
                    color="#962984"
                    number={filterCount}
                    onClick={onOpen}
                />
            </Flex>
        </Flex>
    )
}

export default ItemList
