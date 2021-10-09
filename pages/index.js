import { Flex, Text } from '@chakra-ui/react'

import Link from 'next/link'
import React from 'react'
import { UNISWAP_BUY } from '../utils/const'

const HomePage = () => {
    return (
        <Flex bg="transparent" w="100%" h="100%">
            <Flex w="100%" h="750px" justifyContent="flex-end">
                <Flex
                    flexDirection="column"
                    bg="rgba(29,37,63,0.6)"
                    ml="1rem"
                    mr={['1rem', '2rem', '5rem', '10rem', '15rem']}
                    mt={['50px', '50px', '150px']}
                    borderRadius="20px"
                    alignSelf="center"
                    p="30px 50px 30px 50px"
                >
                    <Text
                        fontSize={['18px', '20px', '25px', '25px', '25px']}
                        textColor="#0084ff"
                        fontWeight="700"
                    >
                        Welcome To
                    </Text>
                    <Text
                        fontSize={['28px', '40px', '50px', '60px', '60px']}
                        textColor="white"
                        fontWeight="700"
                    >
                        STARL METAVERSE
                    </Text>
                    <Text fontSize="15px" maxW="350px" textColor="white">
                        The First Gamified 3D Space Metaverse
                    </Text>
                    <Flex justifyContent="space-between" mt="1.5rem">
                        <Link href="/marketplace">
                            <Flex
                                as="button"
                                bg="linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)"
                                borderRadius="25px"
                                _hover={{ background: '#314DFF' }}
                                border="none"
                                _disabled={{
                                    background: '#131A32',
                                    textColor: 'rgba(255, 255, 255, 0.2)',
                                }}
                                textColor="#fff"
                                fontSize="13px"
                                fontWeight="700"
                                w="100%"
                                h="50px"
                                alignItems="center"
                                justifyContent="center"
                            >
                                Join Sale
                            </Flex>
                        </Link>
                        <Flex w="100px"></Flex>
                        <Link href={UNISWAP_BUY}>
                            <Flex
                                as="button"
                                bg="#131A32"
                                borderRadius="25px"
                                border="solid 2px"
                                borderColor="#1C2441"
                                _focus={{ borderColor: '#314DFF' }}
                                _hover={{ borderColor: '#314DFF' }}
                                textColor="#fff"
                                fontSize="13px"
                                fontWeight="700"
                                w="100%"
                                h="50px"
                                alignItems="center"
                                justifyContent="center"
                            >
                                Buy STARL
                            </Flex>
                        </Link>
                    </Flex>
                </Flex>
            </Flex>
            <video
                autoPlay
                loop
                muted
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '750px',
                    left: '50%',
                    top: '90px',
                    transform: 'translate(-50%, 0px)',
                    objectFit: 'cover',
                    zIndex: '-1',
                    opacity: '0.5',
                }}
            >
                <source src="/STARL_Intro.mp4" type="video/mp4" />
            </video>
        </Flex>
    )
}

HomePage.layout = 'Layout'
HomePage.noBackground = true
export default HomePage
