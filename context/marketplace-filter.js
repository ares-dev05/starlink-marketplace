import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

import { useDisclosure } from '@chakra-ui/react'

const MarketplaceFilterContext = createContext({})

export const MarketplaceFilterWrapper = ({ children }) => {
    // Disclosure for mobile filter
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [filterCount, setFilterCount] = useState(1)

    const [selectedFilters, setSelectedFilters] = useState({
        satellites: false,
        livingModules: false,
    })

    const [orderBy, setOrderBy] = useState({
        orderBy: 'apr',
        orderDirection: 'desc',
    })

    const [liveAuction, setLiveAuction] = useState({
        onAuction: false,
        onBuyNow: false,
    })
    const [aprFilters, setAprFilters] = useState({
        10: false,
        15: false,
        20: false,
        0: false,
    })

    const [priceRange, setPriceRange] = useState({
        min: 0,
        max: 0,
    })

    const useSetPriceRange = useCallback(
        (value) => {
            setPriceRange(() => {
                return value
            })
        },
        [priceRange]
    )

    const useResetFilters = useCallback(
        (value) => {
            setSelectedFilters(() => {
                return value
            })
        },
        [selectedFilters]
    )

    const useSetSelectedFilters = useCallback(
        (category, value) => {
            setSelectedFilters((prevState) => {
                if (category in prevState) {
                    prevState[category] = !prevState[category]
                } else {
                    prevState[category] = { category: value }
                }
                return { ...prevState }
            })
        },
        [selectedFilters]
    )

    const useSetOrderBy = useCallback(
        (value) => {
            const parts = value.split('-')
            const orderBy = parts[0]
            const orderDirection = parts[1]
            setOrderBy(() => {
                return { orderBy, orderDirection }
            })
        },
        [orderBy]
    )

    const useSetLiveAuction = useCallback(
        (value) => {
            setLiveAuction(() => {
                return value
            })
        },
        [liveAuction]
    )
    const useResetAprs = useCallback(
        (value) => {
            setAprFilters(() => {
                return value
            })
        },
        [aprFilters]
    )

    const useSetAprFilters = useCallback(
        (apr, value) => {
            setAprFilters((prevState) => {
                prevState[apr] = value
                return { ...prevState }
            })
        },
        [liveAuction]
    )

    useEffect(() => {
        let n = selectedFilters.livingModules + selectedFilters.satellites
        n += liveAuction.onAuction + liveAuction.onBuyNow
        n += aprFilters[0] + aprFilters[10] + aprFilters[15] + aprFilters[20]
        n += priceRange.min > 0 || priceRange.max > 0
        setFilterCount(n)
    }, [selectedFilters, liveAuction, aprFilters, priceRange])

    return (
        <MarketplaceFilterContext.Provider
            value={{
                selectedFilters,
                useSetSelectedFilters,
                useResetFilters,
                aprFilters,
                orderBy,
                useSetOrderBy,
                liveAuction,
                useSetLiveAuction,
                useSetAprFilters,
                useResetAprs,
                priceRange,
                useSetPriceRange,
                isOpen,
                onOpen,
                onClose,
                filterCount,
            }}
        >
            {children}
        </MarketplaceFilterContext.Provider>
    )
}

export const useMarketplaceFilterContext = () =>
    useContext(MarketplaceFilterContext)
