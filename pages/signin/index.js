import {
    Box,
    Button,
    Flex,
    Spinner,
    Image,
    Square,
    Text,
} from '@chakra-ui/react'
import { API_URL } from '../../utils/const'
import { requestSignMessage } from '../../lib/helper'
import router from 'next/router'
import { useEffect, useState } from 'react'
import { useSignedUserContext } from '../../context/signed-user'
import { useWallet } from 'use-wallet'

const Signin = () => {
    const wallet = useWallet()
    const { setLoginStatus, setUserInfo } = useSignedUserContext()
    const [signing, setSigning] = useState(false)

    useEffect(async () => {
        if (wallet.status === 'disconnected') {
            wallet.connect()
        }
    }, [wallet.status])

    const signMessage = async () => {
        setSigning(true)
        const r1 = await fetch(`${API_URL}/time/v1`)
        if (r1.status === 200) {
            const d1 = await r1.json()
            const message = `${d1.starl_time}`
            try {
                const signature = await requestSignMessage(message)

                let formData = new URLSearchParams()
                formData.append('address', wallet.account)
                formData.append('signature', signature)
                formData.append('timestamp', d1.starl_time)

                const r2 = await fetch(`${API_URL}/login/v1/`, {
                    method: 'POST',
                    body: formData,
                })
                if (r2.status === 200) {
                    const d2 = await r2.json()
                    let user = d2
                    if (d2 && d2.error) {
                        user = {
                            addresses: wallet.account,
                            timestamp: d1.starl_time,
                            signature: signature,
                        }
                    }
                    if (user) {
                        const signedUser = user.user_id
                            ? {
                                  userId: user.user_id,
                                  username: user.user_name,
                                  addresses: user.address,
                                  twitter: user.twitter,
                                  telegram: user.telegram,
                                  instagram: user.instagram,
                                  website: user.url,
                                  timestamp: d1.starl_time,
                                  signature: signature,
                              }
                            : user

                        const r3 = await fetch('/api/auth/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(signedUser),
                        })
                        if (r3.status === 200) {
                            const d3 = await r3.json()
                            if (d3.success) {
                                setSigning(false)
                                setLoginStatus(signedUser.userId ? 2 : 1)
                                setUserInfo(signedUser)
                                router.replace('/profile')
                                return
                            }
                        }
                    }
                }
            } catch (e) {
                console.log(e)
            }
        } else {
            console.log(r1)
        }

        setSigning(false)
    }

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
                        bg="#FF7A00"
                        width="144px"
                        height="144px"
                        left="637px"
                        top="204px"
                        filter="blur(100px)"
                        top="0"
                        left="0"
                        zIndex="-2"
                    ></Box>
                    <Square size="115px" borderRadius="60px" bg="#FF7A00">
                        <Image
                            src={`/sign_icon.png`}
                            h={`57px`}
                            w={`62px`}
                            ignoreFallback
                        />
                    </Square>
                </Box>
                <Box mt="20px">
                    <Text fontSize="28px" fontWeight="700" color="white">
                        Sign Message
                    </Text>
                </Box>
                <Box mt="20px" pt="30px" maxW="340px">
                    <Text fontSize="17px" fontWeight="300" color="white">
                        We need a Wallet Signature from you. No Worries, It’s
                        free and absolutely safe.
                    </Text>
                </Box>
                <Button
                    onClick={signMessage}
                    bgColor="#59A020"
                    color="white"
                    variant="solid"
                    mt="1rem"
                >
                    <Flex alignItems="center">
                        {signing && <Spinner mr="10px" />} Sign Message Now
                    </Flex>
                </Button>
            </Flex>
            <Image
                zIndex="-1"
                src={`/planet-bg.png`}
                mt="-100px"
                ignoreFallback
            />
        </Flex>
    )
}

Signin.noBackground = true
export default Signin
