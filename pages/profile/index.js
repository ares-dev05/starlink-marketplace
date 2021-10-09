import {
    API_URL,
    COOKIE_NAME,
    SATE_AUCTION_ADDRESS,
    SESSION_PASSWORD,
    STARL_ADDRESS,
} from '../../utils/const'
import { Box, Flex, Stack, Text } from '@chakra-ui/layout'
import {
    Button,
    FormControl,
    FormLabel,
    Image,
    Input,
    Spinner,
} from '@chakra-ui/react'
import { getBalance, isTokenApproved } from '../../contracts/starlink'
import { useEffect, useState } from 'react'

import AlertModal from '../../components/AlertModal'
import { AspectRatio } from '@chakra-ui/react'
import BackToMarketLink from '../../components/BackToMarketLink'
import IconButton from '../../components/IconButton'
import ProfileMenu from '../../components/ProfileMenu'
import { applySession } from 'next-iron-session'
import { ethers } from 'ethers'
import { getWalletAddress } from '../../lib/wallet'
import { useRouter } from 'next/router'
import { useSignedUserContext } from '../../context/signed-user'
import { useWallet } from 'use-wallet'
import { validURL } from '../../lib/helper'

const fillUserInfo = (u) => {
    if (!u) {
        return {}
    }
    return {
        ...u,
        username: u.username || '',
        website: u.website || '',
        twitter: u.twitter || '',
        instagram: u.instagram || '',
        telegram: u.telegram || '',
    }
}

const placeholders = {
    username: 'John Connor',
    website: 'www.johnconnor.com',
    twitter: '@johnconn',
    instagram: '@iamthejohn',
    telegram: '@iamthejohn',
}

const minMaxLength = {
    username: [4, 32],
    website: [8, 45],
    twitter: [4, 15],
    instagram: [4, 30],
    telegram: [5, 32],
}

const ProfilePage = () => {
    const { userInfo, setUserInfo, setLoginStatus } = useSignedUserContext()
    const router = useRouter()
    const wallet = useWallet()
    const [profile, setProfile] = useState(fillUserInfo(userInfo))
    const [invalids, setInvalids] = useState({})
    const [editing, setEditing] = useState(
        userInfo && userInfo.username ? false : true
    )
    const [touched, setTouched] = useState(false)
    const [savingProfile, setSavingProfile] = useState(false)
    const [balances, setBalances] = useState({})
    const [newAddress, setNewAddress] = useState('')
    const [showNewAddrInput, setShowNewAddrInput] = useState(false)
    const [alertLoading, setAlertLoading] = useState(false)
    const [alertOpen, setAlertOpen] = useState(false)
    const [alertTitle, setAlertTitle] = useState('Profile created successfully')
    const [alertDesc, setAlertDesc] = useState(
        'Your profile has been created successfully'
    )
    const [alertCancel, setAlertCancel] = useState(null)
    const [alertOk, setAlertOk] = useState('Ok')
    const [alertButtonAction, setAlertButtonAction] = useState(null)

    const showAlert = (title, desc) => {
        setAlertTitle(title)
        setAlertDesc(desc)
        setAlertButtonAction(null)
        setAlertCancel(null)
        setAlertOk('Ok')
        setAlertOpen(true)
    }

    const loadData = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum)
            const network = await provider.getNetwork()
            const walletAddr = await getWalletAddress(wallet)
            const approved = await isTokenApproved(
                STARL_ADDRESS[network.chainId],
                walletAddr,
                SATE_AUCTION_ADDRESS[network.chainId],
                balance,
                provider
            )
            // setApproved(approved)
            let balance = await getBalance(
                STARL_ADDRESS[network.chainId],
                walletAddr,
                provider
            )
            return balance
        }
    }

    useEffect(() => {
        if (wallet.account) {
            loadData().then((bal) => {
                let bObj = {}
                bObj[wallet.account] = bal
                const addrs = profile.addresses.toLowerCase().split(',')
                if (addrs.length > 0) {
                    addrs.map((addr) => {
                        if (addr !== wallet.account.toLowerCase()) {
                            bObj[addr] = -1
                        }
                    })
                }
                setBalances(bObj)
            })
        }
    }, [wallet.account])

    const validateId = (id, field) => {
        if (id !== '') {
            if (field === 'instagram') {
                if (!/^(@?)[\-_A-Za-z0-9]+$/.test(id)) {
                    return 'Can only contain alphanumeric characters, period, and underscore.'
                }
            } else {
                if (!/^(@?)[_A-Za-z0-9]+$/.test(id)) {
                    return 'Can only contain alphanumeric characters and underscore.'
                }
            }
            if (id.length < minMaxLength[field][0]) {
                return 'Should be longer than ' + minMaxLength[field][0]
            }
        }
        return null
    }

    const validateFields = (prof = profile) => {
        let invs = {}
        if (!wallet.account) {
            setInvalids({ account: 'Please connect your wallet.' })
            return false
        }
        invs['username'] =
            prof.username === '' || prof.username.trim() === ''
                ? 'Please fill username'
                : prof.username.length < minMaxLength['username'][0] ||
                  prof.username.length > minMaxLength['username'][1]
                ? `Username should be longer than ${minMaxLength['username'][0]} and shorter than ${minMaxLength['username'][1]}.`
                : !/^[_A-Za-z]+[_A-Za-z0-9]*$/.test(prof.username)
                ? 'Should start with alphabets and underscores and can only contain alphanumeric characters and underscore.'
                : null
        invs['website'] =
            prof.website !== '' && prof.website.trim() === ''
                ? 'Please fill your website url or remove empty spaces.'
                : prof.website.length > 0 &&
                  prof.website.length < minMaxLength['website'][0]
                ? 'Website url should be longer than ' +
                  minMaxLength['website'][0]
                : prof.website !== '' && !validURL(prof.website)
                ? 'Invalid url'
                : null
        invs['twitter'] = validateId(prof.twitter, 'twitter')
        invs['instagram'] = validateId(prof.instagram, 'instagram')
        invs['telegram'] = validateId(prof.telegram, 'telegram')
        setInvalids(invs)
        console.log('invs ' + Object.values(invs).filter((i) => i).length)
        if (Object.values(invs).filter((i) => i).length > 0) {
            return false
        }
        return true
    }

    const updateProfile = (field, value) => {
        if (value !== profile[field]) {
            setTouched(true)
            const prof = {
                ...profile,
                [field]: value,
            }
            setProfile(prof)
            validateFields(prof)
        }
    }

    const saveProfile = async (argBalances) => {
        let addresses = Object.keys(argBalances).join(',')
        if (!validateFields()) {
            return
        }
        setTouched(false)
        setSavingProfile(true)
        try {
            if (!userInfo.signature || !userInfo.timestamp) {
                router.push('/signin')
                return
            }
            let formData = new URLSearchParams()
            formData.append('user_name', profile.username)
            formData.append('address', addresses)
            formData.append('login_address', wallet.account)
            formData.append('telegram', profile.telegram)
            formData.append('twitter', profile.twitter)
            formData.append('instagram', profile.instagram)
            formData.append('url', profile.website)
            formData.append('signature', userInfo.signature)
            formData.append('timestamp', userInfo.timestamp)
            if (profile.userId) {
                formData.append('user_id', profile.userId)
            }

            const r1 = await fetch(
                profile.userId ? `${API_URL}/edit/v1` : `${API_URL}/signup/v1`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            if (r1.status === 200) {
                const t1 = await r1.text()
                if (t1.indexOf('user_id->') >= 0) {
                    const uid = t1.split(' ')[0].substring(9)
                    setProfile({
                        ...profile,
                        userId: uid,
                    })
                    const r2 = await fetch('/api/auth/login', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: uid,
                            ...profile,
                            addresses: addresses,
                        }),
                    })
                    if (r2.status === 200) {
                        const d2 = await r2.json()
                        if (d2.success) {
                            const desc = !userInfo.username
                                ? 'created'
                                : 'updated'
                            showAlert(
                                (!userInfo.username ? 'Created' : 'Updated') +
                                    ' Profile Successfully',
                                `Your profile has been ${desc} successfully. Navigate marketplace to bid on items.`
                            )
                            setLoginStatus(2)
                            setSavingProfile(false)
                            setEditing(false)
                            setUserInfo({
                                ...userInfo,
                                userId: uid,
                                username: profile.username,
                                website: profile.website,
                                twitter: profile.twitter,
                                telegram: profile.telegram,
                                instagram: profile.instagram,
                            })
                            return
                        }
                        setSavingProfile(false)
                    } else if (r2.status === 403) {
                        const d2 = await r2.json()
                        setSavingProfile(false)
                    } else {
                        const t2 = await r2.text()
                        setSavingProfile(false)
                    }
                    return
                }
                setSavingProfile(false)
                return
            } else if (r1.status === 403) {
                router.push('/signin')
            }
            setSavingProfile(false)
        } catch (err) {
            setSavingProfile(false)
        }
    }

    const addNewAddress = (ethAddr) => {
        if (!validateETHAddress(ethAddr)) {
            if (ethers.utils.isAddress(ethAddr)) {
                setBalances({ ...balances, [ethAddr]: -1 })
                setShowNewAddrInput(false)
                setTouched(true)
                return true
            } else {
                return false
            }
        }
    }

    const removeAddr = (ethAddr) => {
        delete balances[ethAddr]
        setBalances({
            ...balances,
        })
        setTouched(true)
    }

    const onLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' })
            if (res.status === 200) {
                setAlertLoading(false)
                setLoginStatus(-1)
                setUserInfo({})
                wallet.reset()
                router.replace('/market')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const showDeleteConfirm = () => {
        setAlertTitle('Delete Profile')
        setAlertDesc('Are you sure to delete your profile?')
        setAlertCancel('Cancel')
        setAlertOk('Delete')
        setAlertButtonAction(() => deleteProfile)
        setAlertOpen(true)
    }

    const validateETHAddress = (addr) => {
        if (balances[addr]) {
            return 'Address already exist'
        }
        if (!ethers.utils.isAddress(addr)) {
            return 'Invalid ETH address'
        }
        return false
    }

    const deleteProfile = () => {
        if (!userInfo.signature || !userInfo.timestamp) {
            router.push('/signin')
            return
        }

        let formData = new URLSearchParams()
        formData.append('user_id', profile.userId)
        formData.append('signature', userInfo.signature)
        formData.append('timestamp', userInfo.timestamp)
        formData.append('login_address', wallet.account)

        setAlertLoading(true)

        fetch(`${API_URL}/edit/v1/`, {
            method: 'DELETE',
            body: formData,
        })
            .then((r) => {
                if (r.status === 200) {
                    onLogout()
                } else if (r.status === 403) {
                    router.push('/signin')
                    setAlertLoading(false)
                }
            })
            .catch((err) => {
                console.log(err)
                setAlertLoading(false)
            })
    }

    return (
        <Box align="center" mb="20px">
            <Box maxW={'511px'} align="left">
                <BackToMarketLink />
                <AlertModal
                    isOpen={alertOpen}
                    title={alertTitle}
                    description={alertDesc}
                    buttonAction={alertButtonAction}
                    buttonLabel={alertOk}
                    alertLoading={alertLoading}
                    cancelLabel={alertCancel}
                    onClose={() => setAlertOpen(false)}
                />
                <Box textAlign="center">
                    <Text
                        fontSize="17px"
                        fontWeight="300"
                        color="white"
                        opacity="0.6"
                        mt="25px"
                    >
                        &nbsp;{userInfo.username ? 'Welcome' : ''}&nbsp;
                    </Text>
                    <Text
                        fontSize="44px"
                        fontWeight="700"
                        color="white"
                        mt="-10px"
                        mb="10px"
                    >
                        {userInfo.username
                            ? userInfo.username
                            : 'Create Profile'}
                    </Text>
                </Box>
                <Box position="relative">
                    <AspectRatio maxW="511px" ratio={511 / 213}>
                        <Flex
                            backgroundImage="/profile-image.png"
                            height="213px"
                            backgroundSize="cover"
                            backgroundPosition="center center"
                            borderTopLeftRadius="20px"
                            borderTopRightRadius="20px"
                            justifyContent="flex-end"
                            p="20px"
                            alignItems="flex-start"
                        ></Flex>
                    </AspectRatio>
                    <Box position="absolute" top="17px" right="17px">
                        <ProfileMenu
                            onlyDisconnect={!userInfo.username}
                            logout={onLogout}
                            editing={editing}
                            editProfile={() => {
                                if (!editing) {
                                    setTouched(false)
                                }
                                setEditing(!editing)
                            }}
                            deleteProfile={() => showDeleteConfirm()}
                        />
                    </Box>
                </Box>
                <Flex justify="center" mt="-82px" mb="-62px">
                    <Flex
                        justify="center"
                        alignItems="center"
                        bg="linear-gradient(0deg, #010001, #E91085, #FBEAAE)"
                        borderRadius="72px"
                        w="143px"
                        h="143px"
                        zIndex={2}
                    >
                        <Image
                            src="/avatar_large.jpg"
                            ignoreFallback
                            width="132px"
                            height="132px"
                            borderRadius="70px"
                        />
                    </Flex>
                </Flex>
                <Box
                    bg="six"
                    borderRadius="0px 0px 15px 15px"
                    p="32px"
                    mb="40px"
                >
                    <Stack spacing="20px" direction="column" mt="40px">
                        {[
                            'username',
                            'website',
                            'twitter',
                            'telegram',
                            'instagram',
                        ].map((field, idx) => (
                            <FormControl key={idx}>
                                <FormLabel
                                    fontSize="11px"
                                    mt="10px"
                                    mb={editing ? '0' : '9px'}
                                >
                                    {field.substring(0, 1).toUpperCase() +
                                        field.substring(1)}
                                </FormLabel>
                                <Input
                                    variant={editing ? 'flushed' : 'unstyled'}
                                    placeholder={
                                        editing ? placeholders[field] : ''
                                    }
                                    color="white"
                                    value={profile[field]}
                                    maxLength={minMaxLength[field][1]}
                                    readOnly={!editing}
                                    disabled={
                                        field === 'username' &&
                                        userInfo.username
                                    }
                                    onChange={(e) =>
                                        updateProfile(field, e.target.value)
                                    }
                                    mt={editing ? '1px' : '0'}
                                />
                                {invalids[field] && (
                                    <Text
                                        fontSize="11px"
                                        color="red.300"
                                        mt="10px"
                                    >
                                        {invalids[field]}
                                    </Text>
                                )}
                            </FormControl>
                        ))}
                        <Flex flexDir="column">
                            <Text
                                fontSize="11px"
                                mt="10px"
                                // mb={editing ? '-4px' : '0'}
                                textAlign="left"
                            >
                                ETH Addresses
                            </Text>
                            {Object.keys(balances).map((addr, idx) => (
                                <Flex
                                    key={idx}
                                    justify="space-between"
                                    alignItems="center"
                                    mt="10px"
                                >
                                    <Text
                                        color="white"
                                        fontSize={['11px', '12px', '13px']}
                                    >
                                        {addr}
                                    </Text>
                                    {editing && wallet.account !== addr && (
                                        <Button
                                            variant="ghost"
                                            fontSize="12px"
                                            onClick={() => removeAddr(addr)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </Flex>
                            ))}
                            {showNewAddrInput && (
                                <Flex alignItems="center">
                                    <Flex flexDir="column" w="100%">
                                        <Input
                                            variant={
                                                editing ? 'flushed' : 'unstyled'
                                            }
                                            placeholder={
                                                placeholders['address']
                                            }
                                            value={newAddress}
                                            mr="10px"
                                            fontSize="16px"
                                            onChange={(e) =>
                                                setNewAddress(e.target.value)
                                            }
                                        />
                                        {newAddress.trim() !== '' &&
                                            validateETHAddress(newAddress) && (
                                                <Text
                                                    color="red.400"
                                                    fontSize="12px"
                                                >
                                                    {validateETHAddress(
                                                        newAddress
                                                    )}
                                                </Text>
                                            )}
                                    </Flex>
                                    <IconButton
                                        iconPath="/save_icon.png"
                                        bgColor="#1C1C1F"
                                        height="34px"
                                        imgSize="15px"
                                        onClick={() =>
                                            addNewAddress(newAddress)
                                        }
                                    />
                                    <IconButton
                                        iconPath="/cancel_icon.png"
                                        noBorderLeftRadius={true}
                                        bgColor="#1C1C1F"
                                        height="34px"
                                        imgSize="13px"
                                        onClick={() =>
                                            setShowNewAddrInput(false)
                                        }
                                    />
                                </Flex>
                            )}
                            {invalids['address'] && (
                                <Text fontSize="11px" color="red.300">
                                    {invalids['address']}
                                </Text>
                            )}
                        </Flex>
                        {editing && (
                            <Flex justifyContent="space-between">
                                <Button
                                    bgColor="#38374A"
                                    textColor="white"
                                    disabled={showNewAddrInput}
                                    _hover={{ bgColor: '#68678A' }}
                                    onClick={() => {
                                        setShowNewAddrInput(true)
                                        setNewAddress('')
                                    }}
                                    fontSize={['13px', '14px', '15px']}
                                >
                                    ADD ADDRESS
                                </Button>
                                <Flex>
                                    <Button
                                        bgColor="#38374A"
                                        textColor="white"
                                        onClick={() => saveProfile(balances)}
                                        _hover={{ bgColor: '#68678A' }}
                                        disabled={!touched}
                                        fontSize={['13px', '14px', '15px']}
                                    >
                                        {savingProfile && (
                                            <Spinner
                                                mr="4px"
                                                w={['15px', '20px']}
                                                h={['15px', '20px']}
                                            />
                                        )}{' '}
                                        {userInfo.username
                                            ? 'Update Profile'
                                            : 'Create Profile'}
                                    </Button>
                                </Flex>
                            </Flex>
                        )}
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

export async function getServerSideProps({ req, res }) {
    await applySession(req, res, {
        password: SESSION_PASSWORD,
        cookieName: COOKIE_NAME,
    })
    if (!req.session.get('user')) {
        return {
            redirect: {
                destination: '/signin',
            },
        }
    }
    return {
        props: {},
    }
}

export default ProfilePage
