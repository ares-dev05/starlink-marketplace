import {
    Box,
    Flex,
    IconButton,
    Image,
    Modal,
    ModalContent,
    ModalOverlay,
    Text,
} from '@chakra-ui/react'

import { CloseIcon } from '@chakra-ui/icons'
import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSignedUserContext } from '../../context/signed-user'
import { useWallet } from 'use-wallet'
import { useMobileMenuContext } from '../../context/mobile-menu'
import AlertModal from '../AlertModal'

const ConnectModal = (props) => {
    const wallet = useWallet()
    const router = useRouter()
    const { loginStatus, setLoginStatus } = useSignedUserContext()
    const { onClose } = useMobileMenuContext()
    const [showSwitchNetAlert, setShowSwitchNetAlert] = useState(false)

    const connectWallet = (connector) => {
        setLoginStatus(0)
        wallet
            .connect(connector)
            .then(() => {})
            .catch((e) => {})
    }

    useEffect(() => {
        if (loginStatus === 0 && wallet.status === 'connected') {
            if (onClose) {
                onClose()
            }
            router.replace('/signin')
        }
        if (props.isOpen && loginStatus >= 0 && wallet.status === 'error') {
            setShowSwitchNetAlert(true)
            props.onClose()
        }
    }, [wallet.status])

    return (
        <>
            <Modal
                size="sm"
                isOpen={props.isOpen}
                onClose={props.onClose}
                isCentered
            >
                <ModalOverlay />
                <ModalContent
                    bg="#23262F"
                    border="1px solid #555555"
                    w={['90%', '90%', null]}
                >
                    <IconButton
                        color="white"
                        icon={<CloseIcon />}
                        position="absolute"
                        top="1rem"
                        right="0.5rem"
                        onClick={props.onClose}
                        bg="none"
                        fontSize="0.6rem"
                        _active={{}}
                        _focus={{}}
                        _hover={{}}
                    />
                    <Box ml="1.5rem" mt="1.5rem" borderTopRadius="18px">
                        <Text color="#fff" fontSize="23px" fontWeight="700">
                            Connect Wallet
                        </Text>
                    </Box>
                    <Box p="1.5rem" borderBottomRadius="10px">
                        <Flex
                            flexDirection="row"
                            cursor="pointer"
                            onClick={() => connectWallet('injected')}
                            p="1px"
                            transition="0.3s"
                            _hover={{
                                bg: 'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
                                transition: '0.3s',
                            }}
                            borderRadius="16px"
                            bg="rgba(255, 255, 255, 0.1)"
                            mt="1rem"
                            maxH="4rem"
                        >
                            <Flex w="100%" h="100%" p="10px">
                                <Image
                                    alt="wallet"
                                    src="/wallets/metamask.png"
                                    w="1.5rem"
                                    m="auto 0"
                                    ignoreFallback
                                />
                                <Flex
                                    flexDirection="column"
                                    m="auto 0 auto 2rem"
                                >
                                    <Text
                                        fontSize="16px"
                                        fontWeight="500"
                                        color="#fff"
                                    >
                                        MetaMask
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            cursor="pointer"
                            onClick={() => connectWallet('walletconnect')}
                            p="1px"
                            transition="0.3s"
                            _hover={{
                                bg: 'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
                                transition: '0.3s',
                            }}
                            borderRadius="16px"
                            bg="rgba(255, 255, 255, 0.1)"
                            mt="1rem"
                            maxH="4rem"
                        >
                            <Flex w="100%" h="100%" p="10px">
                                <Image
                                    alt="wallet"
                                    src="/wallets/walletConnectIcon.svg"
                                    w="1.5rem"
                                    m="auto 0"
                                    ignoreFallback
                                />
                                <Flex
                                    flexDirection="column"
                                    m="auto 0 auto 2rem"
                                >
                                    <Text
                                        fontSize="16px"
                                        fontWeight="500"
                                        color="#fff"
                                    >
                                        WalletConnect
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            cursor="pointer"
                            onClick={() => connectWallet('walletlink')}
                            p="1px"
                            transition="0.3s"
                            _hover={{
                                bg: 'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
                                transition: '0.3s',
                            }}
                            borderRadius="17px"
                            bg="rgba(255, 255, 255, 0.1)"
                            mt="1rem"
                            maxH="4rem"
                        >
                            <Flex w="100%" h="100%" p="10px">
                                <Image
                                    alt="wallet"
                                    src="/wallets/coinbaseWalletIcon.svg"
                                    w="1.5rem"
                                    m="auto 0"
                                    ignoreFallback
                                />
                                <Flex
                                    flexDirection="column"
                                    m="auto 0 auto 2rem"
                                >
                                    <Text
                                        fontSize="16px"
                                        fontWeight="500"
                                        color="#fff"
                                    >
                                        Coinbase Wallet
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            cursor="pointer"
                            onClick={() => connectWallet('fortmatic')}
                            p="1px"
                            transition="0.3s"
                            _hover={{
                                bg: 'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
                                transition: '0.3s',
                            }}
                            borderRadius="16px"
                            bg="rgba(255, 255, 255, 0.1)"
                            mt="1rem"
                            maxH="4rem"
                        >
                            <Flex w="100%" h="100%" p="10px">
                                <Image
                                    alt="wallet"
                                    src="/wallets/fortmaticIcon.png"
                                    w="1.5rem"
                                    m="auto 0"
                                    ignoreFallback
                                />
                                <Flex
                                    flexDirection="column"
                                    m="auto 0 auto 2rem"
                                >
                                    <Text
                                        fontSize="16px"
                                        fontWeight="500"
                                        color="#fff"
                                    >
                                        Fortmatic
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                        <Flex
                            flexDirection="row"
                            cursor="pointer"
                            onClick={() => connectWallet('portis')}
                            p="1px"
                            transition="0.3s"
                            _hover={{
                                bg: 'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
                                transition: '0.3s',
                            }}
                            borderRadius="16px"
                            bg="rgba(255, 255, 255, 0.1)"
                            mt="1rem"
                            maxH="4rem"
                        >
                            <Flex w="100%" h="100%" p="10px">
                                <Image
                                    alt="wallet"
                                    src="/wallets/portisIcon.png"
                                    w="1.5rem"
                                    m="auto 0"
                                    ignoreFallback
                                />
                                <Flex
                                    flexDirection="column"
                                    m="auto 0 auto 2rem"
                                >
                                    <Text
                                        fontSize="16px"
                                        fontWeight="500"
                                        color="#fff"
                                    >
                                        Portis
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Box>
                </ModalContent>
            </Modal>

            <AlertModal
                title="Switch network"
                description={
                    'Please switch network to ' + wallet.networkName + '.'
                }
                buttonLabel="OK"
                isOpen={showSwitchNetAlert}
                onClose={() => setShowSwitchNetAlert(false)}
            />
        </>
    )
}

export default ConnectModal
