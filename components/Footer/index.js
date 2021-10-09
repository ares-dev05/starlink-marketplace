import { Flex, HStack, Image, Stack, Text, VStack } from '@chakra-ui/react'

import Link from 'next/link'
import React from 'react'
import Socialbutton from '../SocialButton'
import { socialMediaUrls } from '../../utils/const'

const Footer = () => {
    return (
        <Flex w="100%" bg="#060A1A">
            <Flex w="100%" h="100%" p="50px" justifyContent="space-between">
                <Flex
                    w={['35%', '35%', '35%', '30%', '30%']}
                    h="40px"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Image
                        alt="Starl logo"
                        src={'logo@2x.png'}
                        w={['90px', '90px', '90px', '90px', '90px']}
                        h={['50px', '50px', '50px', '50px', '50px']}
                        ignoreFallback
                    />
                </Flex>
                <Stack
                    w="50%"
                    direction={['column', 'column', 'row', 'row', 'row']}
                    spacing="50"
                    mt="7px"
                >
                    <Flex
                        w={['100%', '60%', '35%', '30%', '20%']}
                        flexDirection="column"
                        textColor="#fff"
                        fontSize="16px"
                    >
                        <Text>PAGES</Text>
                        <Flex
                            textColor="rgba(255, 255, 255, 0.5)"
                            fontSize="14px"
                            lineHeight="35px"
                            justifyContent="space-between"
                        >
                            <Flex flexDirection="column">
                                <Link
                                    href="/"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Home
                                    </Flex>
                                </Link>
                                <Link
                                    href="/marketplace"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Market
                                    </Flex>
                                </Link>
                                <Link
                                    href="/create"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Create
                                    </Flex>
                                </Link>
                            </Flex>
                            <Flex flexDirection="column">
                                <Link
                                    href="/universe"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Universe
                                    </Flex>
                                </Link>
                                <Link
                                    href="/play"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Play
                                    </Flex>
                                </Link>
                                <Link
                                    href="https://www.starltoken.com/whitepaper.pdf"
                                    style={{ textDecoration: 'none' }}
                                    _focus={{ border: 'none' }}
                                    isExternal
                                >
                                    <Flex
                                        _hover={{ color: '#fff' }}
                                        cursor="pointer"
                                    >
                                        Whitepaper
                                    </Flex>
                                </Link>
                            </Flex>
                        </Flex>
                    </Flex>
                    <Flex
                        flexDirection="column"
                        textColor="#fff"
                        fontSize="16px"
                    >
                        <Text>SOCIAL</Text>
                        <VStack
                            spacing={15}
                            alignItems="flex-start"
                            mt="0.5rem"
                        >
                            <HStack spacing={['2', '13', '15', '15', '15']}>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.facebookUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="facebook" />
                                </Flex>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.twitterUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="twitter" />
                                </Flex>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.telegramUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="telegram" />
                                </Flex>
                                {/* <Flex
                                    as="button"
                                    onClick={() => (window.location.href = socialMediaUrls.youtubeUrl)}
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="youtube" />
                                </Flex> */}
                            </HStack>
                            <HStack spacing={['2', '13', '15', '15', '15']}>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.discordUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                    bg="#fff"
                                    borderRadius="10px"
                                    justifyContent="center"
                                    alignItems="center"
                                >
                                    <Image
                                        w="20px"
                                        h="20px"
                                        alt="social"
                                        src="footer/ico_discord.png"
                                        ignoreFallback
                                    />
                                </Flex>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.mediumUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="medium" />
                                </Flex>
                                <Flex
                                    as="button"
                                    onClick={() =>
                                        (window.location.href =
                                            socialMediaUrls.instagramUrl)
                                    }
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="instagram" />
                                </Flex>
                                {/* <Flex
                                    as="button"
                                    onClick={() => (window.location.href = socialMediaUrls.twitchUrl)}
                                    w="35px"
                                    h="35px"
                                >
                                    <Socialbutton network="twitch" />
                                </Flex> */}
                            </HStack>
                        </VStack>
                    </Flex>
                </Stack>
            </Flex>
        </Flex>
    )
}

export default Footer
