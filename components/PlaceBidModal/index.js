import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Flex,
    Image,
    Spinner,
    InputRightElement,
    Input,
    NumberInput,
    NumberInputField,
    Button,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import toast from 'react-hot-toast'
import { BigNumber, ethers } from 'ethers'
import {
    approveToken,
    getBalance,
    isTokenApproved,
} from '../../contracts/starlink'
import { convertPrice, formatNumber, getBigNumber } from '../../lib/helper'
import { getWalletAddress } from '../../lib/wallet'
import {
    getAuctionAddress,
    SATE_AUCTION_ADDRESS,
    STARL_ADDRESS,
} from '../../utils/const'
import { getMinBidIncrement, placeBid } from '../../contracts/auction'

const PlaceBidModal = ({
    tokenId,
    tokenInfo,
    highestBid,
    nOffers,
    isOpen,
    onClose,
    showResult,
}) => {
    const { name, type, apr } = tokenInfo
    const wallet = useWallet()
    const [networkId, setNetworkId] = useState(0)
    const [bidAmount, setBidAmount] = useState(0)
    const [amountInvalid, setAmountInvalid] = useState(false)
    const [balance, setBalance] = useState(0)
    const [approved, setApproved] = useState(false)
    const [pending, setPending] = useState(false)
    const [lockPlaceBid, setLockPlaceBid] = useState(false)
    const [minBidIncrement, setMinBidInc] = useState(0)

    const loadData = async () => {
        if (wallet && wallet.ethereum) {
            const provider = new ethers.providers.Web3Provider(wallet.ethereum)
            const network = await provider.getNetwork()
            setNetworkId(network.chainId)
            const signer = await provider.getSigner()
            const mbi = await getMinBidIncrement(
                SATE_AUCTION_ADDRESS[network.chainId],
                signer
            )
            setMinBidInc(Math.floor(ethers.utils.formatUnits(mbi, 'ether')))
            const walletAddr = await getWalletAddress(wallet)
            let balance = await getBalance(
                STARL_ADDRESS[network.chainId],
                walletAddr,
                provider
            )
            setBalance(balance)
            const approved = await isTokenApproved(
                STARL_ADDRESS[network.chainId],
                walletAddr,
                getAuctionAddress(tokenId, network.chainId),
                balance,
                provider
            )
            setApproved(approved)
        }
    }

    useEffect(() => {
        setBidAmount('')
        setAmountInvalid(false)
        loadData()
    }, [isOpen])

    const currentBid = Math.floor(ethers.utils.formatUnits(highestBid, 'ether'))
    let bidIncrement = Math.floor(currentBid * 0.05)
    if (minBidIncrement > bidIncrement) {
        bidIncrement = minBidIncrement
    }
    const minBidAmount =
        nOffers > 0 ? BigNumber.from(currentBid).add(bidIncrement) : currentBid

    const clickPlaceBid = async () => {
        if (!bidAmount || amountInvalid) {
            if (!amountInvalid) {
                setAmountInvalid(true)
            }
            return
        }
        if (pending) return

        setLockPlaceBid(true)

        const provider = new ethers.providers.Web3Provider(wallet.ethereum)
        const signer = await provider.getSigner()

        try {
            if (approved) {
                if (bidAmount <= 0) {
                    toast.error('Please enter bid price')
                    return
                }
                const txHash = await placeBid(
                    getAuctionAddress(tokenId, networkId),
                    tokenId,
                    getBigNumber(bidAmount.toString()),
                    signer,
                    setPending
                )
                // toast.success('Your bid has been placed successfully')
                showResult(true)
                setPending(false)
                onClose({ txHash, bidAmount })
            } else {
                setPending(true)
                await approveToken(
                    STARL_ADDRESS[networkId],
                    getAuctionAddress(tokenId, networkId),
                    '115792089237316195423570985008687907853269984665640564039457584007913129639935',
                    signer
                )
                setPending(false)
                setApproved(true)
            }
        } catch (e) {
            console.log(e)
            if (e.toString().includes('Failed to outbid highest bidder')) {
                toast.error(
                    'You must bid at least ' +
                        formatNumber(parseInt(minBidAmount.toString()))
                )
            } else if (
                e.toString().includes('Failed to outbid min bid price')
            ) {
                toast.error(
                    'You must bid at least ' +
                        formatNumber(parseInt(minBidAmount.toString()))
                )
            } else if (
                e.toString().includes('transfer amount exceeds balance')
            ) {
                toast.error("You haven't enough balance")
            }
            setPending(false)
        }

        setLockPlaceBid(false)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                bgColor="#23262F"
                border="1px solid #555555"
                maxW={['90vw', '90vw', '419px']}
            >
                <ModalHeader fontSize="23px" fontWeight="700" color="white">
                    Place your Bid
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize="14px">
                    <Flex flexDir="column">
                        <Text mb="1rem" fontWeight="400">
                            You are placing a bid for
                        </Text>
                        <Flex>
                            <Image
                                src="/gold_star.png"
                                ignoreFallback
                                w="21px"
                                h="21px"
                            />
                            <Text
                                fontSize="16px"
                                fontWeight="700"
                                color="white"
                                ml="9px"
                            >
                                {name} - {type} ({apr}% APR)
                            </Text>
                        </Flex>

                        <Text
                            fontSize="16px"
                            fontWeight="700"
                            color="white"
                            mt={['20px', '27px', '47px']}
                        >
                            {nOffers > 0 ? 'Current Bid' : 'Reserved Price'}
                        </Text>

                        <Text fontSize="16px" fontWeight="400">
                            {convertPrice(highestBid)} $STARL
                        </Text>

                        <Text
                            fontSize="16px"
                            fontWeight="700"
                            color="white"
                            mt={['20px', '27px', '47px']}
                        >
                            Your Bid
                        </Text>
                        <NumberInput
                            variant="flushed"
                            placeholder="$Starl Amount"
                            onChange={(value) => {
                                try {
                                    const val = parseFloat(value)
                                    setBidAmount(val)
                                    if (
                                        val >
                                        parseFloat(
                                            ethers.utils.formatUnits(
                                                balance,
                                                'ether'
                                            )
                                        )
                                    ) {
                                        setAmountInvalid('Insufficient $STARL')
                                    } else {
                                        if (val < minBidAmount) {
                                            setAmountInvalid(
                                                'You must bid at least ' +
                                                    formatNumber(
                                                        parseInt(
                                                            minBidAmount.toString()
                                                        )
                                                    )
                                            )
                                        } else {
                                            setAmountInvalid(false)
                                        }
                                    }
                                } catch (e) {
                                    setBidAmount(0)
                                }
                            }}
                            value={
                                bidAmount > 0 ? bidAmount.toLocaleString() : ''
                            }
                        >
                            <NumberInputField
                                placeholder="$Starl Amount"
                                fontSize="16px"
                            />

                            <InputRightElement>
                                <Image
                                    src="/starl_currency.png"
                                    color="#333"
                                    ignoreFallback
                                />
                            </InputRightElement>
                        </NumberInput>
                        {amountInvalid && (
                            <Text color="red.400">
                                {bidAmount
                                    ? amountInvalid
                                    : 'Ups, this field is really required, please fill it!'}
                            </Text>
                        )}

                        <Text fontSize="14px" fontWeight="400" mt="20px">
                            Enter{' '}
                            {formatNumber(parseInt(minBidAmount.toString()))}{' '}
                            $STARL or more.
                        </Text>

                        {/* <Text
                            fontSize="16px"
                            fontWeight="700"
                            color="white"
                            mt="33px"
                        >
                            Offer Expiration
                        </Text>
                        <Flex
                            justify="space-between"
                            alignItems="flex-end"
                            mt="10px"
                            borderBottom="1px solid #696969"
                        >
                            <Flex alignItems="flex-end">
                                <Input
                                    variant="unstyled"
                                    w="20px"
                                    textAlign="right"
                                    borderRadius="0"
                                />
                                <Text
                                    ml="5px"
                                    mr="10px"
                                    fontSize="16px"
                                    color="rgba(255, 255, 255, 0.5)"
                                >
                                    d
                                </Text>
                                <Input
                                    variant="unstyled"
                                    w="20px"
                                    textAlign="right"
                                    borderRadius="0"
                                />
                                <Text
                                    ml="5px"
                                    mr="10px"
                                    fontSize="16px"
                                    color="rgba(255, 255, 255, 0.5)"
                                >
                                    h
                                </Text>
                                <Input
                                    variant="unstyled"
                                    w="20px"
                                    textAlign="right"
                                    borderRadius="0"
                                />
                                <Text
                                    ml="5px"
                                    mr="10px"
                                    fontSize="16px"
                                    color="rgba(255, 255, 255, 0.5)"
                                >
                                    m
                                </Text>
                            </Flex>
                            <Image src="/timer_icon.png" ignoreFallback mb="4px" mr="7px" />
                            {amountInvalid && (
                                <Text color="red.400">
                                    Ups, this field is really required, please
                                    fill it!
                                </Text>
                            )}
                        </Flex> */}

                        <Flex
                            mt={['40px', '50px', '80px']}
                            justify="space-between"
                        >
                            <Text mb="1rem" fontWeight="400">
                                $STARL BALANCE
                            </Text>
                            <Text mb="1rem" color="white" fontWeight="500">
                                {convertPrice(balance)}
                            </Text>
                        </Flex>
                        <Flex justify="space-between">
                            <Text mb="1rem" fontWeight="400">
                                You Are Offering
                            </Text>
                            <Text mb="1rem" color="white" fontWeight="500">
                                {formatNumber(bidAmount ? bidAmount : 0)}
                            </Text>
                        </Flex>
                    </Flex>
                </ModalBody>

                <ModalFooter>
                    <Button
                        w="100%"
                        borderRadius="43px"
                        bgColor="#962984"
                        colorScheme="blue"
                        boxShadow="0px 16px 18px -5px rgba(101, 21, 88, 0.5)"
                        fontSize="15px"
                        fontWeight="700"
                        color="white"
                        disabled={lockPlaceBid}
                        mr={3}
                        onClick={clickPlaceBid}
                    >
                        {!approved ? (
                            <>
                                {pending && <Spinner mr="10px" />}{' '}
                                {pending ? 'Approve Pending' : 'Approve $STARL'}
                            </>
                        ) : (
                            <>                            
                                {pending && <Spinner mr="10px" />}{' '}
                                {pending ? 'Bid Pending' : 'PLACE BID'}
                            </>
                        )}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default PlaceBidModal
