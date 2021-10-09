import { Box, Flex, Text } from '@chakra-ui/layout'

const ProfilePillButton = ({ label, children, borderStyle, marginRight }) => {
    let bgGradient = ''
    switch (borderStyle) {
        case 'gradient1':
            bgGradient =
                'linear-gradient(93.97deg, #E91085 -10.02%, rgba(32, 201, 201, 0.494792) 52.31%, rgba(255, 255, 255, 0) 113.36%)'
            break
        case 'gradient2':
            bgGradient =
                'linear-gradient(93.97deg, #E91085 -10.02%, rgba(147, 201, 32, 0.494792) 52.31%, #00C2FF 113.36%)'
            break
        default:
            bgGradient = '2px solid rgba(223, 223, 223, 0.19)'
            break
    }
    return (
        <Box
            as="button"
            p="2px"
            borderRadius="8px"
            border={bgGradient}
            bgGradient={bgGradient}
            padding="2px"
            marginRight={marginRight}
        >
            <Flex
                alignItems="center"
                w="100%"
                h="100%"
                bg="#0e1429"
                borderRadius="8px"
                p="5px 8px"
                cursor="pointer"
            >
                {children && children}
                {label && (
                    <Text fontSize="9px" fontWeight="600" color="white">
                        {label}
                    </Text>
                )}
            </Flex>
        </Box>
    )
}

export default ProfilePillButton
