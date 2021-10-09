import { Flex, FormLabel, Text } from '@chakra-ui/react'

import CustomCheckbox from '../CustomCheckbox'
import CustomSwitch from '../CustomSwitch'
import React from 'react'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const ShopCategory = () => {
    const { selectedFilters } = useMarketplaceFilterContext()
    return (
        <>
            <Flex
                h="1px"
                w="100%"
                bg="rgba(255, 255, 255, 0.1)"
                mt="10px"
                alignSelf="center"
            />
            <Flex justifyContent="space-between" alignItems="center" mt="40px">
                <FormLabel textColor="#fff" fontSize="16px" fontWeight="400">
                    On sale
                </FormLabel>
                <CustomSwitch />
            </Flex>
            <Flex
                flexDirection="column"
                h="100%"
                mt="20px"
                justifyContent="flex-start"
                display="none"
            >
                <Text
                    textColor="#fff"
                    fontWeight="400"
                    cursor="pointer"
                    fontSize="20px"
                >
                    FILTER
                </Text>
                <Flex
                    alignItems="center"
                    textColor="rgba(255, 255, 255, 0.5)"
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="400"
                    mt="20px"
                >
                    <CustomCheckbox
                        category="satellites"
                        checked={selectedFilters.satellites}
                    />
                    Satellites
                </Flex>
                <Flex
                    alignItems="center"
                    textColor="rgba(255, 255, 255, 0.5)"
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="400"
                    mt="20px"
                >
                    <CustomCheckbox
                        category="livingModules"
                        checked={selectedFilters.livingModules}
                    />
                    Living Modules
                </Flex>
            </Flex>
        </>
    )
}

export default ShopCategory
