import Checkbox from 'react-custom-checkbox'
import { Flex, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const CustomCheckbox = ({ category, checked, title }) => {
    const { useSetSelectedFilters } = useMarketplaceFilterContext()
    const handleChange = (value) => {
        useSetSelectedFilters(category, value)
    }
    return (
        <Flex w="100%" h="100%" alignItems="center">
            <Flex
                w="14px"
                h="14px"
                borderRadius="3px"
                borderWidth="1px"
                borderColor={checked ? '#fff' : 'rgba(206, 206, 206, 0.5)'}
            >
                <Checkbox
                    icon={
                        <Flex position="absolute" w="16px" h="14px" mb="1px">
                            <Image src="/check-ico.svg" />
                        </Flex>
                    }
                    borderWidth="0px"
                    borderColor={checked ? '#fff' : 'rgba(206, 206, 206, 0.5)'}
                    onChange={handleChange}
                    checked={checked}
                />
            </Flex>
            <Text
                ml="1rem"
                fontSize="13px"
                fontWeight="300"
                textColor={checked ? '#fff' : 'rgba(206, 206, 206, 0.5)'}
                onClick={() => handleChange(!checked)}
                cursor="pointer"
            >
                {title}
            </Text>
        </Flex>
    )
}

export default CustomCheckbox
