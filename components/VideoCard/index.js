import { Box, Flex, Image } from '@chakra-ui/react'
import { APR_NAMES } from '../../utils/const'

const VideoCard = ({ url, apr }) => {
    return (
        <Flex
            flexDir="column"
            w={['320px', '320px', '300px', '358px', '358px']}
        >
            <Flex
                w={['320px', '320px', '320px', '358px', '358px']}
                h={['320px', '320px', '320px', '358px', '358px']}
                bg="linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)"
                p="2px"
                borderRadius="8px"
                justifyContent="center"
                alignItems="center"
                zIndex={2}
            >
                <Flex
                    w="100%"
                    h="100%"
                    bg="#1C1C1F"
                    borderRadius="8px"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Flex m="12px">
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            controls
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                                borderRadius: '5px',
                            }}
                        >
                            <source src={url} type="video/mp4" />
                        </video>
                    </Flex>
                </Flex>
            </Flex>
            {apr > 0 && (
                <Flex justifyContent="center" mt="-20px" mb="-76px">
                    <Box
                        width="100%"
                        height="97px"
                        left="8px"
                        top="-30px"
                        zIndex={1}
                        position="relative"
                        background="radial-gradient(22.59% 52.89% at 47.39% 36.8%, rgba(251, 234, 174, 0.5) 0%, rgba(158, 126, 66, 0.187865) 62.61%, rgba(102, 61, 0, 0) 100%)"
                    />
                    <Image
                        src={`/${APR_NAMES[apr]}_star.png`}
                        ignoreFallback
                        width="40px"
                        height="40px"
                        position="absolute"
                        zIndex={2}
                    />
                </Flex>
            )}
        </Flex>
    )
}

export default VideoCard
