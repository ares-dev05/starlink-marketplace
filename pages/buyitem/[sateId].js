import 'chartjs-adapter-moment'

import {
    Flex,
    Image,
    Link,
    Spinner,
    Text,
    useBreakpointValue,
} from '@chakra-ui/react'
import React, { useEffect, useRef, useState } from 'react'
import {
    convertPrice,
    formatLeftTime,
    getAuctionPrice,
    getBigNumber,
    getStarlPrice,
    limitedStr,
    useWindowSize,
} from '../../lib/helper'

import { API_URL, STLM_NFT_ADDRESS, SATE_NFT_ADDRESS } from '../../utils/const'
import AlertModal from '../../components/AlertModal'
import BackToMarketLink from '../../components/BackToMarketLink'
import BasePanel from '../../components/BasePanel'
import { Box } from '@chakra-ui/layout'
import ConnectModal from '../../components/ConnectModal'
import CustomButton from '../../components/CustomButton'
import { FiNavigation } from 'react-icons/fi'
import IconButton from '../../components/IconButton'
import { Line } from 'react-chartjs-2'
import PlaceBidModal from '../../components/PlaceBidModal'
import ProfilePillButton from '../../components/ProfilePillButton'
import SocialShare from '../../components/SocialShare'
import VideoCard from '../../components/VideoCard'
import { ethers } from 'ethers'
import { formatNumber } from '../../lib/helper'
import moment from 'moment'
import { querySateDetail } from '../../utils/graphql'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { useSignedUserContext } from '../../context/signed-user'
import { useWallet } from 'use-wallet'

const TokenTitle = ({ tokenId, tokenName, tokenClass }) => {
    const networkId = process.env.NETWORK === 'mainnet' ? 1 : 4
    const network = process.env.NETWORK === 'mainnet' ? 'etherscan.io' : 'rinkeby.etherscan.io'
    const tokenContract = tokenId.startsWith('LM-') ? STLM_NFT_ADDRESS[networkId] : SATE_NFT_ADDRESS[networkId]
    const tid = tokenId.replace("LM-", "")
    
    return (
        <Flex flexDir="column">
            <Link
                href={`https://${network}/token/${tokenContract}?id=${tid}`}
                _focus={{ border: 'none' }}
                isExternal
                flexDirection="row"
            >
                <Flex>
                    <Text
                        color="rgba(255, 255, 255, 0.5)"
                        fontSize="17px"
                        fontWeight="300"
                    >
                        {tokenClass} {tokenId.startsWith('LM-') ? 'Living Module' : 'Satellite'} #{tid}
                    </Text>
                </Flex>
            </Link>
            <Text color="white" fontSize="44.61px" fontWeight="700">
                {tokenName}
            </Text>
        </Flex>
    )
}

const FavAndShare = ({ isFavorite, addToFavorites, tokenInfo, tokenId, tokenClass }) => {
    return (
        <Flex flexDir="row" alignItems="center">
            <IconButton
                iconPath={isFavorite ? '/favorite_red.png' : '/favorite.png'}
                onClick={addToFavorites}
            />
            <SocialShare tokenInfo={tokenInfo} tokenId={tokenId} tokenClass={tokenClass} />
        </Flex>
    )
}

const OwnedBy = ({ owner }) => {
    return (
        <Flex
            color="rgba(255, 255, 255, 0.5)"
            fontSize="17px"
            fontWeight="300"
            flexDir={['column', 'column', 'row', 'row', 'row']}
            mt={['2px', '2px', '0', '0', '0']}
        >
            OWNED BY
            <Flex
                color="rgba(255, 255, 255, 0.5)"
                fontSize={['15px', '15px', '17px']}
                fontWeight="300"
                flexDir="row"
                mt={['8px', '8px', '0', '0', '0']}
            >
                <Image
                    src="/avatar_placeholder.jpg"
                    ignoreFallback
                    ml={['0px', '0px', '12px', '12px', '12px']}
                    mr="4px"
                    borderRadius="10px"
                    width="20px"
                    height="20px"
                />
                {owner}
            </Flex>
        </Flex>
    )
}

const Panels = ({ tokenInfo, apr, mob }) => {
    const properties = [
        {
            name: 'ALTITUDE',
            value: tokenInfo.attributes[3] ? `${tokenInfo.attributes[3].value } km` : "",
        },
        {
            name: 'APR',
            value: `${apr} %`,
        },
        {
            name: 'SPEED',
            value: tokenInfo.attributes[4] ? `${tokenInfo.attributes[4].value} mph` : "",
        },
        {
            name: 'WEIGHT',
            value: `${tokenInfo.attributes[2].value} kg`,
        },
    ]
    return (
        <Flex
            flexDirection="column"
            paddingLeft={['0', '0', '12px', '12px', '12px']}
            paddingRight={['0', '0', '12px', '12px', '12px']}
            w={['320px', '320px', '320px', '358px', '358px']}
            mt={['20px', '20px', '0', '0', '0']}
        >
            {/* Properties */}
            <BasePanel
                title="Properties"
                borderBottomRadius="0"
                initShow
                mob={mob}
            >
                {[0, 1].map((rowIdx) => (
                    <Flex key={rowIdx} mt="0.5rem" mb="0.5rem">
                        {properties
                            .slice(rowIdx * 2, (rowIdx + 1) * 2)
                            .map((prop, idx) => (
                                <ProfilePillButton
                                    key={idx}
                                    borderStyle="gradient1"
                                    marginRight="12px"
                                >
                                    <Text
                                        fontWeight="600"
                                        textColor="#aaa"
                                        fontSize="12px"
                                        justifyContent="center"
                                    >
                                        {prop.name}
                                    </Text>
                                    <Text
                                        fontWeight="600"
                                        textColor="#fff"
                                        fontSize="12px"
                                        alignItems="center"
                                        justifyContent="center"
                                        ml="6px"
                                    >
                                        {prop.value}
                                    </Text>
                                </ProfilePillButton>
                            ))}
                    </Flex>
                ))}
            </BasePanel>

            <BasePanel title="Description" initShow>
                <Text>{tokenInfo.description}</Text>
            </BasePanel>
        </Flex>
    )
}

const BuyItemPage = ({ sateId }) => {
    const wallet = useWallet()
    const router = useRouter()
    const { userInfo } = useSignedUserContext()
    const [token, setToken] = useState(null)
    const [tokenId, setTokenId] = useState(0)
    const [tokenInfo, setTokenInfo] = useState({})
    const [tokenClass, setTokenClass] = useState("")
    const [isOpen, setIsOpen] = useState(false)
    const [isConnectOpen, setIsConnectOpen] = useState(false)
    const [price, setPrice] = useState('0')
    const [startTime, setStartTime] = useState(new Date())
    const [endTime, setEndTime] = useState(new Date())
    const [onAuction, setOnAuction] = useState(false)
    const [auctionTimeLeft, setAuctionTimeLeft] = useState(null)
    const [tokenLauchDate, setLaunchDate] = useState(null)
    const [apr, setAPR] = useState(0)
    const [offersLoading, setOffersLoading] = useState(false)
    const [offers, setOffers] = useState([])
    const phGraphRef = useRef()
    const [phData, setPHData] = useState({})
    const [starlPrice, setStarlPrice] = useState(0)
    const [isFavorite, setFavroite] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [showSigninAlert, setShowSigninAlert] = useState(false)
    const [showBuyNowAlert, setShowBuyNowAlert] = useState(false)
    const mob = useBreakpointValue({
        base: true,
        sm: true,
        md: false,
        lg: false,
        xl: false,
        '2xl': false,
    })
    const rWidth = useBreakpointValue({
        xs: '300px',
        sm: '300px',
        md: '450px',
        lg: '671px',
        xl: '671px',
        '2xl': '671px',
    })
    const rFontSize = ['12px', '12px', '13px', '15px']

    let secondTimer = null

    useEffect(() => {
        loadData()
        const timer1 = setInterval(() => {
            loadData()
        }, 50000)

        return () => {
            if (timer1) {
                clearInterval(timer1)
            }
            if (secondTimer) {
                clearInterval(secondTimer)
            }
        }
    }, [])

    useEffect(() => {
        if (token && token.auction) {
            if (secondTimer) {
                clearInterval(secondTimer)
            }
            secondTimer = setInterval(() => {
                updateAuctionInfo(token)
            }, 1000)
        }
    }, [token])

    const updateAuctionInfo = (token) => {
        if (token) {
            setOnAuction(token.liveAuction)
        }
        if (token && token.auction) {
            const auction = token.auction
            setPrice(getAuctionPrice(token))
            if (!auction.resulted) {
                setAuctionTimeLeft(auction.endTimestamp * 1000 - Date.now())
            } else {
                setLaunchDate(new Date(parseInt(token.launchTime)))
            }
        }
    }

    const loadData = async () => {
        const starlPrice = await getStarlPrice()
        setStarlPrice(starlPrice)
        const nftId = sateId
        setTokenId(nftId)

        if (nftId) {
            const token = await querySateDetail(nftId)
            if (!token) {
                return
            }
            setToken(token)
            setAPR(token.apr)
            const auction = token.auction
            if (auction) {
                if (auction.bids.length >= offers.length) {
                    const loadBids = async () => {
                        setOffersLoading(true)
                        let bids = []
                        let allUsers = {}
                        for (let i = 0; i < auction.bids.length; i++) {
                            const bid = auction.bids[i]
                            const bidPrice = ethers.utils.formatUnits(
                                bid.amount,
                                'ether'
                            )
                            let user = null
                            try {
                                if (allUsers[bid.sender]) {
                                    user = allUsers[bid.sender]
                                } else {
                                    const rUser = await fetch(
                                        `${API_URL}/users/v1/address/${bid.sender}`
                                    )
                                    if (rUser.status === 200) {
                                        user = await rUser.json()
                                        user.userId = user.user_id
                                        user.username = user.user_name
                                        allUsers[bid.sender] = user
                                    } else {
                                        allUsers[bid.sender] = 'unknown'
                                    }
                                }
                            } catch (err) {
                                console.log(err)
                            }
                            const offerPrice = formatNumber(
                                parseFloat(bidPrice)
                            )
                            const usdPrice = formatNumber(
                                parseFloat(bidPrice) * starlPrice,
                                2
                            )
                            bids[i] = {
                                price: offerPrice,
                                usdPrice: usdPrice,
                                // expiration: 'In a month',
                                from: bid.sender,
                                fromUser: user === 'unknown' ? null : user,
                                txHash: bid.txHash,
                            }
                        }
                        bids.reverse()
                        setOffersLoading(false)
                        setOffers(bids)
                    }
                    loadBids()
                }
                setPHData({
                    labels: auction.bids.map((bid) => bid.timestamp * 1000),
                    datasets: [
                        {
                            label: 'Bid prices ($USD)',
                            data: auction.bids.map(
                                (bid) =>
                                    starlPrice *
                                    parseFloat(
                                        ethers.utils.formatUnits(
                                            bid.amount,
                                            'ether'
                                        )
                                    )
                            ),
                            fill: false,
                            xAxisID: 'xAxis',
                            yAxisID: 'yAxis',
                            pointRadius: 4,
                            pointHoverRadius: 6,
                            pointBackgroundColor: '#C4C4C4',
                            borderColor: '#DF83D0',
                            borderWith: 3,
                            cubicInterpolationMode: 'monotone',
                            fill: true,
                        },
                    ],
                })

                updateAuctionInfo(token)
                setStartTime(new Date(auction.startTimestamp * 1000))
                setEndTime(new Date(auction.endTimestamp * 1000))
            }

            fetch(token.tokenUri)
                .then((response) => response.text())
                .then((infoResponse) => {
                    try {
                        const jsonInfo = JSON.parse(infoResponse)

                        if (
                            !jsonInfo ||
                            !jsonInfo.image ||
                            !jsonInfo.name ||
                            !jsonInfo.animation_url
                        ) {
                            throw new Error('Invalid json info')
                        }
                        setTokenInfo(jsonInfo)
                        setTokenClass(jsonInfo.attributes[5] ? jsonInfo.attributes[5].value : "")
                        // if (jsonInfo.attributes[5].value == 'LEO') setAPR(10)
                        // else if (jsonInfo.attributes[5].value == 'MEO')
                        //     setAPR(15)
                        // else if (jsonInfo.attributes[5].value == 'GEO')
                        //     setAPR(20)
                    } catch (e) {
                        console.error('[INFO] Invalid tokenUri', metadata)
                    }
                })
            if (userInfo && userInfo.userId) {
                fetch(
                    `${API_URL}/users/v1/${userInfo.userId}/favorite_sates/${nftId}`
                )
                    .then((res) => res.json())
                    .then((res) => {
                        if (res.favId > 0) {
                            setFavroite(true)
                        } else {
                            setFavroite(false)
                        }
                    })
            }
        }
    }

    const openModal = async () => {
        const current = new Date()
        if (current >= endTime) {
            alert('Auction has been ended!')
            return
        }
        if (current < startTime) {
            alert('Auction has not started yet!')
            return
        }

        if (!wallet || !wallet.ethereum) {
            setIsConnectOpen(true)
        } else {
            setIsOpen(true)
        }
    }

    const addToFavorites = async () => {
        if (!userInfo || !userInfo.userId) {
            setShowSigninAlert(true)
            return
        }
        try {
            const res = await fetch(
                `${API_URL}/users/v1/${userInfo.userId}/favorite_sates/${tokenId}`,
                {
                    method: isFavorite ? 'DELETE' : 'PUT',
                }
            )
            if (res.status === 200) {
                if (!isFavorite) {
                    const favRes = await res.json()
                    if (favRes.favId > 0) {
                        setFavroite(true)
                    }
                } else {
                    setFavroite(false)
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    const copyAddr = (addr) => {
        navigator.clipboard.writeText(addr).then(() => {
            toast.success('Address Copied', { duration: 2000 })
        })
    }

    const closeModal = (bidInfo) => {
        setIsOpen(false)
        if (bidInfo) {
            const { bidAmount, txHash } = bidInfo

            if (bidInfo) {
                setOffers([
                    {
                        price: formatNumber(bidAmount),
                        usdPrice: formatNumber(starlPrice * bidAmount, 2),
                        from: wallet.account,
                        fromUser:
                            userInfo && userInfo.username ? userInfo : null,
                        // expiration: "In a month",
                        txHash: txHash,
                    },
                    ...offers,
                ])
                setPrice(getBigNumber(bidAmount.toString()))
            }
        }
    }

    const showBidResult = (success) => {
        if (success) {
            setShowAlert(true)
        }
    }

    const _renderPage = () => {
        if (!tokenInfo.name) {
            return (
                <Flex
                    flexDirection="column"
                    w={['300px', '300px', '1069px', '1069px', '1069px']}
                    h="100%"
                    lineHeight="30px"
                    borderRadius="6px"
                    p="1rem"
                    cursor="pointer"
                >
                    <Spinner
                        size="xl"
                        thickness="4px"
                        color="blue.500"
                        emptyColor="gray.600"
                        m="auto"
                    />
                </Flex>
            )
        }

        return (
            <Flex
                mt="30px"
                flexDirection={['column', 'column', 'row', 'row', 'row']}
            >
                <Flex
                    flexDir="column"
                    alignItems={[
                        'center',
                        'center',
                        'flex-start',
                        'flex-start',
                        'flex-start',
                    ]}
                >
                    {mob && (
                        <Flex
                            flexDir="row"
                            justify="space-between"
                            w={['320px', '320px', '320px', '358px', '358px']}
                            alignItems="flex-end"
                            mb="10px"
                        >
                            <TokenTitle
                                tokenId={tokenId}
                                tokenName={tokenInfo.name}
                                tokenClass={tokenClass}
                            />
                            <Box pb="12px">
                                <FavAndShare
                                    isFavorite={isFavorite}
                                    addToFavorites={addToFavorites}
                                    tokenInfo={tokenInfo}
                                    tokenId={tokenId}
                                    tokenClass={tokenClass}
                                />
                            </Box>
                        </Flex>
                    )}

                    {/* Video Card */}
                    <VideoCard url={tokenInfo.animation_url} apr={apr} />

                    {!mob && (
                        <Panels tokenInfo={tokenInfo} apr={apr} mob={false} />
                    )}
                </Flex>

                <Flex
                    flexDirection="column"
                    ml={['20px', '20px', '20px', '40px', '40px']}
                >
                    {!mob && (
                        <TokenTitle
                            tokenId={tokenId}
                            tokenName={tokenInfo.name}
                            tokenClass={tokenClass}
                        />
                    )}
                    {!mob && <OwnedBy owner={tokenInfo.attributes[0].value} />}

                    {!mob && (
                        <Flex
                            flexDirection="row"
                            alignItems="center"
                            width={rWidth}
                            mt="25px"
                        >
                            <Flex
                                width="100%"
                                bgColor="rgba(105, 105, 105, 0.2)"
                                height="1px"
                            />
                            <FavAndShare
                                isFavorite={isFavorite}
                                addToFavorites={addToFavorites}
                                tokenInfo={tokenInfo}
                                tokenId={tokenId}
                                tokenClass={tokenClass}
                            />
                        </Flex>
                    )}

                    {/* Price and Creator */}
                    <Flex
                        flexDirection={[
                            'column',
                            'column',
                            'row',
                            'row',
                            'row',
                        ]}
                        mt="25px"
                    >
                        <Flex
                            flexDir="row"
                            borderBottom={[
                                '1px solid rgba(105, 105, 105, 0.2)',
                                '1px solid rgba(105, 105, 105, 0.2)',
                                '0px',
                                '0px',
                                '0px',
                            ]}
                            mb={['16px', '16px', '0px', '0px', '0px']}
                            h="72px"
                        >
                            {mob && (
                                <OwnedBy
                                    owner={tokenInfo.attributes[0].value}
                                />
                            )}
                            {mob && (
                                <Flex
                                    width="1px"
                                    height="42px"
                                    bgColor="#69696970"
                                    mt="10px"
                                    ml="25px"
                                    mr="25px"
                                />
                            )}
                            <Flex
                                flexDirection="column"
                                minW={[
                                    '90px',
                                    '90px',
                                    '90px',
                                    '120px',
                                    '120px',
                                ]}
                            >
                                <Text
                                    color="rgba(255, 255, 255, 0.5)"
                                    mt={['4px', '4px', '0']}
                                >
                                    {!onAuction
                                        ? 'LAUNCH DATE'
                                        : auctionTimeLeft > 0
                                        ? 'ENDING IN'
                                        : 'Auction ended'}
                                </Text>
                                <Text
                                    color="white"
                                    fontWeight="400"
                                    fontSize={['13px', '13px', '15px']}
                                    mt={['10px', '10px', '12px']}
                                >
                                    {!onAuction
                                        ? moment
                                              .unix(tokenLauchDate)
                                              .format('M/d h:mm a')
                                        : auctionTimeLeft > 0
                                        ? formatLeftTime(auctionTimeLeft)
                                        : ''}
                                </Text>
                            </Flex>
                        </Flex>

                        {!mob && (
                            <Flex
                                width="1px"
                                height="66px"
                                bgColor="#69696970"
                                ml="25px"
                                mr="25px"
                            />
                        )}

                        <Flex
                            flexDir="row"
                            mt={['16px', '16px', '0px', '0px', '0px']}
                        >
                            <Flex
                                flexDirection="column"
                                minW={[
                                    '110px',
                                    '110px',
                                    '110px',
                                    '160px',
                                    '160px',
                                ]}
                            >
                                <Text color="rgba(255, 255, 255, 0.5)">
                                    CURRENT VALUE
                                </Text>
                                <Flex
                                    flexDirection="row"
                                    alignItems="flex-start"
                                    mt="8px"
                                >
                                    <Image
                                        src="/starlusd.png"
                                        ignoreFallback
                                        w="27px"
                                        h="27px"
                                        mt="2px"
                                    />
                                    <Flex flexDirection="column" ml="10px">
                                        <Flex
                                            color="white"
                                            fontWeight="400"
                                            fontSize={rFontSize}
                                            flexDirection="row"
                                        >
                                            {convertPrice(price)}
                                            <Text
                                                color="white"
                                                fontWeight="400"
                                                fontSize="10px"
                                                ml="3px"
                                                mt="3px"
                                            >
                                                $STARL
                                            </Text>
                                        </Flex>
                                        <Text
                                            color="#ffffff70"
                                            fontWeight="400"
                                            fontSize="9px"
                                        >
                                            {formatNumber(
                                                ethers.utils.formatUnits(
                                                    price,
                                                    'ether'
                                                ) * starlPrice,
                                                2
                                            )}{' '}
                                            USD
                                        </Text>
                                    </Flex>
                                </Flex>
                            </Flex>

                            <Flex
                                width="1px"
                                height="66px"
                                bgColor="#69696970"
                                ml="25px"
                                mr="25px"
                            />

                            <Flex flexDirection="column">
                                <Text color="rgba(255, 255, 255, 0.5)">
                                    CREATED BY
                                </Text>
                                <Flex
                                    flexDirection="row"
                                    mt="8px"
                                    alignItems="center"
                                >
                                    <Image
                                        src="/avatar_placeholder.jpg"
                                        ignoreFallback
                                        w="25px"
                                        h="25px"
                                        mt="2px"
                                        borderRadius="14px"
                                    />
                                    <Text
                                        color="white"
                                        fontWeight="400"
                                        fontSize={rFontSize}
                                        ml="4px"
                                    >
                                        {tokenInfo.attributes[0].value}
                                    </Text>
                                </Flex>
                            </Flex>
                        </Flex>
                    </Flex>

                    {mob && <Panels tokenInfo={tokenInfo} apr={apr} mob />}

                    {/* Buttons */}
                    <Flex
                        flexDirection="row"
                        zIndex={2}
                        alignSelf={mob ? 'center' : 'flex-start'}
                        mt="48px"
                        pos={mob ? 'fixed' : 'relative'}
                        bottom={mob ? '40px' : null}
                    >
                        <CustomButton
                            title="Place Bid"
                            color="#962984"
                            onClick={openModal}
                            disabled={!onAuction}
                        />
                        <CustomButton
                            title="Buy Now"
                            color="#296E96"
                            marginLeft="24px"
                            onClick={() => setShowBuyNowAlert(true)}
                            disabled={onAuction}
                        />
                    </Flex>

                    {/* Bid History */}
                    <Text
                        mt="40px"
                        fontSize="16px"
                        fontWeight="400"
                        color="#FFFFFF70"
                    >
                        BID HISTORY
                    </Text>
                    <Flex
                        width={['320px', '350px', '450px', '671px', '671px']}
                        height="1px"
                        bgColor="#69696915"
                        mt="25px"
                        mb="25px"
                    />
                    <Flex
                        flexDirection="row"
                        justifyContent="space-between"
                        paddingLeft="6px"
                        width={['320px', '350px', '450px', '671px', '671px']}
                    >
                        <Text
                            w={['160px', '160px', '160px', '160px', '160px']}
                            color="#FFFFFF70"
                            fontSize="12px"
                        >
                            STARL PRICE
                        </Text>
                        <Text
                            w={['130px', '130px', '150px', '150px', '150px']}
                            color="#FFFFFF70"
                            fontSize="12px"
                        >
                            USD Price
                        </Text>
                        <Text
                            w={['110px', '110px', '150px', '150px', '150px']}
                            color="#FFFFFF70"
                            fontSize="12px"
                        >
                            FROM
                        </Text>
                        <Text
                            w={['60px', '60px', '180px', '180px', '180px']}
                            color="#FFFFFF70"
                            fontSize="12px"
                        >
                            {!mob ? 'TRANSACTION' : 'TX'}
                        </Text>
                    </Flex>
                    <div
                        data-simplebar
                        style={{
                            overflow: 'auto',
                            maxHeight: 180,
                            width: rWidth,
                        }}
                    >
                        <Flex flexDirection="column">
                            {offersLoading && (
                                <Flex
                                    alignItems="center"
                                    justifyContent="center"
                                    mt="1rem"
                                >
                                    <Spinner />
                                </Flex>
                            )}
                            {offers.map((offer, idx) => (
                                <Flex
                                    key={idx}
                                    flexDirection="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                    border="1px solid #FFFFFF00"
                                    _hover={{
                                        backgroundColor: '#1C1C1F',
                                        borderRadius: '6px',
                                        border: '1px solid #45454570',
                                    }}
                                    padding="4px"
                                    mt="8px"
                                >
                                    <Flex
                                        flexDirection="row"
                                        w="160px"
                                        alignItems="center"
                                    >
                                        <Image
                                            src="/starlusd_small.png"
                                            ignoreFallback
                                            w="5px"
                                            h="11px"
                                        />
                                        <Text
                                            fontSize={[
                                                '12px',
                                                '12px',
                                                '15px',
                                                '15px',
                                                '15px',
                                            ]}
                                            color="white"
                                            ml="5px"
                                        >
                                            {offer.price}
                                        </Text>
                                    </Flex>
                                    <Text
                                        w={[
                                            '120px',
                                            '120px',
                                            '150px',
                                            '150px',
                                            '150px',
                                        ]}
                                        fontSize={[
                                            '12px',
                                            '12px',
                                            '15px',
                                            '15px',
                                            '15px',
                                        ]}
                                        color="white"
                                    >
                                        ${offer.usdPrice}
                                    </Text>
                                    <Flex
                                        display="flex"
                                        alignItems="center"
                                        w="150px"
                                        cursor="pointer"
                                        fontSize={[
                                            '12px',
                                            '12px',
                                            '15px',
                                            '15px',
                                            '15px',
                                        ]}
                                        color="white"
                                    >
                                        {offer.fromUser && (
                                            <Image
                                                src="/avatar_placeholder.jpg"
                                                ignoreFallback
                                                w="20px"
                                                h="20px"
                                                borderRadius="10px"
                                                marginRight="4px"
                                            />
                                        )}
                                        <Text
                                            onClick={() =>
                                                offer.fromUser
                                                    ? router.push(
                                                          '/profile/' +
                                                              offer.fromUser
                                                                  .userId
                                                      )
                                                    : copyAddr(offer.from)
                                            }
                                            decoration={
                                                offer.fromUser
                                                    ? 'underline'
                                                    : 'none'
                                            }
                                        >
                                            {offer.fromUser
                                                ? limitedStr(
                                                      offer.fromUser.username,
                                                      12
                                                  )
                                                : offer.from
                                                      .substring(2, 6)
                                                      .concat('_')
                                                      .concat(
                                                          offer.from.substring(
                                                              offer.from
                                                                  .length - 4
                                                          )
                                                      )
                                                      .toUpperCase()}
                                        </Text>
                                    </Flex>
                                    <Flex
                                        w={[
                                            '80px',
                                            '80px',
                                            '180px',
                                            '180px',
                                            '180px',
                                        ]}
                                        cursor="pointer"
                                        onClick={() =>
                                            window.open(
                                                (process.env.NETWORK ===
                                                'mainnet'
                                                    ? 'https://etherscan.io/tx/'
                                                    : 'https://rinkeby.etherscan.io/tx/') +
                                                    offer.txHash,
                                                '_blank'
                                            )
                                        }
                                    >
                                        {!mob && (
                                            <Text
                                                mr="4px"
                                                fontSize="12px"
                                                textTransform="uppercase"
                                                color="white"
                                            >
                                                {offer.txHash.substring(0, 6) +
                                                    '_' +
                                                    offer.txHash.substring(
                                                        offer.txHash.length - 4
                                                    )}
                                            </Text>
                                        )}
                                        <FiNavigation />
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </div>

                    {/* Price History */}
                    <Text
                        mt="40px"
                        fontSize="16px"
                        fontWeight="400"
                        color="#FFFFFF70"
                    >
                        PRICE HISTORY
                    </Text>

                    <Flex
                        bgColor="#1C1C1F"
                        borderRadius="6px"
                        border="1px solid rgba(69, 69, 69, 0.5)"
                        ml={['-10px', '-10px', '0px', '0px', '0px']}
                        mt="25px"
                        pt="20px"
                        pl="20px"
                        pr="20px"
                        width={rWidth}
                        mb={['120px', '120px', '20px', '20px', '20px']}
                    >
                        {phData.datasets &&
                        phData.datasets[0].data.length > 1 ? (
                            <Line
                                style={{ width: rWidth }}
                                ref={phGraphRef}
                                data={phData}
                                options={{
                                    animation: false,
                                    plugins: {
                                        legend: {
                                            display: false,
                                            labels: {
                                                color: '#eee',
                                            },
                                        },
                                    },
                                    layout: {
                                        padding: {
                                            bottom: 20,
                                        },
                                    },
                                    scales: {
                                        xAxis: {
                                            title: { text: '' },
                                            grid: {
                                                borderColor:
                                                    'rgba(105, 105, 105, 0.2)',
                                                color: 'rgba(105, 105, 105, 0.2)',
                                            },
                                            type: 'time',
                                            time: {
                                                displayFormats: {
                                                    day: 'M/D',
                                                    hour: 'M/D, H:mm',
                                                },
                                                unit: 'day',
                                            },
                                            ticks: {
                                                source: 'data',
                                            },
                                        },
                                        yAxis: {
                                            title: { text: 'USD' },
                                            ticks: {
                                                callback: function (
                                                    value,
                                                    index,
                                                    values
                                                ) {
                                                    return value >= 1000
                                                        ? value / 1000 + 'k'
                                                        : value
                                                },
                                            },
                                            borderColor:
                                                'rgb(255, 255, 255, 0)',
                                            color: 'rgb(255, 255, 255, 0)',
                                            grid: {
                                                color: '#69696925',
                                            },
                                        },
                                    },
                                }}
                            />
                        ) : (
                            <Text fontSize="15px" color="#777" height="40px ">
                                No price history due to only one bid made
                            </Text>
                        )}
                    </Flex>
                </Flex>
            </Flex>
        )
    }

    return (
        <Flex justify="center">
            <Box alignItems="flex-start">
                <BackToMarketLink />
                {_renderPage()}
                {tokenInfo.attributes && (
                    <PlaceBidModal
                        isOpen={isOpen}
                        onClose={closeModal}
                        tokenId={tokenId}
                        highestBid={price}
                        nOffers={offers.length}
                        showResult={showBidResult}
                        tokenInfo={{
                            name: tokenInfo.name,
                            apr: apr,
                            type: tokenClass,
                        }}
                    />
                )}
                <ConnectModal
                    isOpen={isConnectOpen}
                    onClose={() => {
                        setIsConnectOpen(false)
                    }}
                />
                <AlertModal
                    title="Sign in required"
                    description="You must sign in to add to favorites."
                    buttonLabel="OK"
                    isOpen={showSigninAlert}
                    onClose={() => setShowSigninAlert(false)}
                />
                <AlertModal
                    title="Bid Placed Successfully"
                    description="Your bid has been placed successfully."
                    buttonLabel="OK"
                    isOpen={showAlert}
                    onClose={() => setShowAlert(false)}
                />
                <AlertModal
                    title="Coming Soon"
                    description="Our Secondary Market is not quite ready yet."
                    buttonLabel="OK"
                    isOpen={showBuyNowAlert}
                    onClose={() => setShowBuyNowAlert(false)}
                />
            </Box>
        </Flex>
    )
}

export async function getServerSideProps(context) {
    const { params } = context
    return {
        props: {
            sateId: params.sateId,
        },
    }
}

BuyItemPage.justify = 'left'
export default BuyItemPage
