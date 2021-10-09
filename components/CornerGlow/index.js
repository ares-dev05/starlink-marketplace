import { Box } from '@chakra-ui/layout'

const CornerGlow = () => {
    return (
        <Box
            position="absolute"
            w={['295px', '295px', '357px']}
            h={['202px']}
            top="0"
            right={['0px', '0px', '-10px']}
            background="linear-gradient(221.15deg, #6734FF -81.3%, rgba(103, 52, 255, 0) 53.01%)"
            zIndex="0"
        />
    )
}

export default CornerGlow
