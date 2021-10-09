import { Flex } from '@chakra-ui/react'
import React from 'react'
import { Select } from '@chakra-ui/react'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const SortBy = () => {
    const { orderBy, useSetOrderBy } = useMarketplaceFilterContext()

    const handleOnChange = (e) => {
        useSetOrderBy(e.currentTarget.value)
    }

    const setSelected = () => {
        return `${orderBy.orderBy}-${orderBy.orderDirection}`
    }

    return (
        <Flex
            w="100%"
            h="100%"
            _focusWithin={{
                background:
                    'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
            }}
        >
            <Flex>
                <Select onChange={handleOnChange} defaultValue={setSelected()}>
                    <option value="apr-desc">Highest APR</option>
                    <option value="apr-asc">Lowest APR</option>
                    <option value="starlPrice-desc">Highest Price</option>
                    <option value="starlPrice-asc">Lowest Price</option>
                    <option value="launchTime-desc">Newest</option>
                    <option value="launchTime-asc">Oldest</option>
                </Select>
            </Flex>
        </Flex>
    )
}

export default SortBy
