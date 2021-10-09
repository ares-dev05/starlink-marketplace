import { Box, Flex, Image, Link, Spacer, Stack, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

import ConnectModal from '../ConnectModal'
import NextLink from 'next/link'
import TruncateEthAddress from '../TruncateEthAddress'
import router from 'next/router'
import { useSignedUserContext } from '../../context/signed-user'
import { useWallet } from 'use-wallet'
import { useMobileMenuContext } from '../../context/mobile-menu'
import { limitedStr } from '../../lib/helper'

const WalletConnect = () => {
    const wallet = useWallet()
    const { userInfo, setUserInfo, loginStatus, setLoginStatus } =
        useSignedUserContext()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [account, setAccount] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const { onClose } = useMobileMenuContext()

    useEffect(() => {
        if (wallet.status === 'connected') {
            setAccount(wallet.account)
        } else if (
            userInfo &&
            loginStatus >= 0 &&
            wallet.status === 'disconnected'
        ) {
            wallet.connect()
            setLoginStatus(2)
        } else if (
            !userInfo &&
            router.pathname.endsWith('signin') &&
            wallet.status === 'disconnected'
        ) {
            wallet.connect()
            setLoginStatus(0)
        } else {
            setAccount(null)
        }
    }, [wallet.status])

    useEffect(() => {
        if (account) setIsOpen(false)
    }, [account])

    const openModal = () => {
        setIsMenuOpen(false)
        if (!account) {
            setIsOpen(true)
        }
    }

    const closeModal = () => {
        setIsOpen(false)
    }

    const onLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            if (res.status === 200) {
                setLoginStatus(-1)
                setUserInfo({})
                wallet.reset()
                router.replace('/market')
                onClose()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return loginStatus >= 0 && account ? (
        <Flex
            align="center"
            justify={['space-between']}
            flexDir={['row-reverse', 'row-reverse', 'row']}
        >
            <Flex display={['flex', 'flex', 'none']}>
                <Box w="25vw" h="1px" />
                <Image
                    src="/disconnect.png"
                    w="33px"
                    h="33px"
                    cursor="pointer"
                    onClick={onLogout}
                />
            </Flex>
            <Box textAlign="right" pr={4} ml="20px">
                <NextLink href="/profile" passHref>
                    <Link
                        _hover={{
                            textDecoration: 'none',
                        }}
                        onClick={onClose}
                    >
                        <Text
                            fontSize="15px"
                            fontWeight="700"
                            color="white"
                            textAlign={['left', 'left', 'right']}
                        >
                            {userInfo && userInfo.username
                                ? limitedStr(userInfo.username, 12)
                                : ''}
                        </Text>
                        <Text
                            fontSize="11px"
                            fontWeight="400"
                            color="white"
                            isTruncated
                            mt="-2px"
                        >
                            <TruncateEthAddress address={account} />
                        </Text>
                    </Link>
                </NextLink>
            </Box>
            <Image
                src="/avatar_placeholder.jpg"
                h={50}
                w={50}
                borderRadius={10}
                ignoreFallback
            />
        </Flex>
    ) : (
        <Box
            bg="linear-gradient(225deg, #E91085, #93C920, #00C2FF)"
            borderRadius="20px"
            p="2px"
            ml="20px"
            marginInlineStart="30px !important"
        >
            <Flex
                as="button"
                onClick={openModal}
                alignItems="center"
                bg="#251b46"
                borderRadius="20px"
                pl="25px"
                pr="25px"
                pt="6px"
                pb="6px"
            >
                <Image
                    src="/connect_icon.png"
                    ignoreFallback
                    width="10px"
                    height="10px"
                    mb="2px"
                />
                <Text fontSize="15px" fontWeight="600" color="white" ml="4px">
                    Connect Wallet
                </Text>
                <ConnectModal isOpen={isOpen} onClose={closeModal} />
            </Flex>
        </Box>
    )
}

export default WalletConnect
