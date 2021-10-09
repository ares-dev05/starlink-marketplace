import { Flex, Image, Text } from '@chakra-ui/react'

const AprFilterButton = ({ handleAprFilterChange, apr, aprFilters }) => {
    const imgFiles = { 0: 'free', 20: 'platinum', 15: 'gold', 10: 'silver' }

    return (
        <Flex mb="15px" as="button" onClick={() => handleAprFilterChange(apr)}>
            <Image
                src={imgFiles[apr] + '_star.png'}
                w="21px"
                h="21px"
                ignoreFallback
            />
            <Text
                ml="9px"
                fontSize="13px"
                color={aprFilters[apr] ? 'white' : 'gray'}
            >
                {apr === 20
                    ? 'GEO'
                    : apr === 15
                    ? 'MEO'
                    : apr === 10
                    ? 'LEO'
                    : 'Free'}{' '}
                Tier - {apr}% APR
            </Text>
        </Flex>
    )
}

export default AprFilterButton
