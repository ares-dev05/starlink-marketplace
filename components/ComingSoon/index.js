import { Box, Flex, Image, Square, Text } from '@chakra-ui/react'

const ComingSoon = ({ label, svg, bg_colour }) => {
    return (
        <Flex direction="column" alignItems="center">
            <Flex
                direction="column"
                maxWidth="490px"
                alignItems="center"
                textAlign="center"
            >
                <Box position="relative" mt="200px">
                    <Box
                        position="absolute"
                        bg={bg_colour}
                        width="144px"
                        height="144px"
                        left="637px"
                        top="304px"
                        filter="blur(100px)"
                        top="0"
                        left="0"
                        zIndex="-2"
                    ></Box>
                    <Square size="90px" borderRadius="10px" bg={bg_colour}>
                        <Image
                            src={`/icons/${svg}.svg`}
                            h={`40px`}
                            w={`55px`}
                            ignoreFallback
                        />
                    </Square>
                </Box>
                <Box mt="20px">
                    <Text fontSize="17px" fontWeight="300">
                        The {label} Section
                    </Text>
                </Box>
                <Box mt="20px">
                    <Text
                        fontSize={['36px', '40px', '44px']}
                        fontWeight="700"
                        color="white"
                    >
                        IS COMING SOON
                    </Text>
                </Box>
                <Box
                    mt="20px"
                    pt="30px"
                    borderTop="1px solid rgba(105, 105, 105, 0.5)"
                >
                    <Text fontSize={['15px', '16px', '17px']} fontWeight="300">
                        "A rushed game or feature is forever bad."
                    </Text>
                </Box>
                <Box mt="10px">
                    <Text
                        fontSize="17px"
                        fontWeight="300"
                        color="rgba(255, 255, 255, 0.5);"
                    >
                        Shigeru Miyamoto
                    </Text>
                </Box>
            </Flex>
            <Image zIndex="-1" src={`/planet-bg.png`} ignoreFallback />
        </Flex>
    )
}

export default ComingSoon
