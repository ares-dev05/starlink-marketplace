import { Box, Flex, Image, Text } from '@chakra-ui/react'
Custom404.noBackground = true
export default function Custom404() {
    return (
        <Flex direction="column" alignItems="center">
            <Flex
                flexDirection="column"
                position="absolute"
                h={['30%', '40%', '65%']}
                textAlign="center"
            >
                <Flex
                    w="100%"
                    h="100%"
                    position="relative"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Image
                        src="/404-bg.png"
                        alt="404 page"
                        w="100%"
                        h="100%"
                        position="relative"
                        ignoreFallback
                        zIndex="-2"
                    />
                    <Text
                        position="absolute"
                        textColor="#DF83D0"
                        fontWeight="200"
                        fontSize={['25px', '40px', '65px']}
                        mr="0.5rem"
                        mt="0.5rem"
                    >
                        404
                    </Text>
                </Flex>
            </Flex>
            <Flex
                flexDirection="column"
                position="absolute"
                h={['40%', '50%', '70%']}
                textAlign="center"
                justifyContent="flex-end"
            >
                <Box mt="25px">
                    <Text
                        fontSize={['12px', '15px', '17px']}
                        fontWeight="300"
                        color="white"
                    >
                        We know you are breathtaking but
                    </Text>
                </Box>
                <Box
                    borderBottom="1px solid rgba(105, 105, 105, 0.5)"
                    pb="20px"
                >
                    <Text
                        fontSize={['20px', '24px', '27px']}
                        fontWeight="700"
                        color="white"
                    >
                        YOU JUST BROKE THE METAVERSE.
                    </Text>
                </Box>
                <Box mt="20px" pt="10px" mb="20px">
                    <Text
                        fontSize={['12px', '15px', '17px']}
                        fontWeight="300"
                        color="white"
                    >
                        Also the page you are looking for does not exist.
                    </Text>
                </Box>
            </Flex>
        </Flex>
    )
}
