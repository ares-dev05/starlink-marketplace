import { Flex, Image, Spinner, Text, Tooltip } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import {
    convertPrice,
    formatLeftTime,
    formatNumber,
    getAuctionPrice,
} from '../../lib/helper'

import { ethers } from 'ethers'
import { useRouter } from 'next/router'

const ItemCard = ({ token, starlPrice, refreshLeftTime }) => {
    const id = token.id
    const router = useRouter()
    const [tokenInfo, setTokenInfo] = useState({})
    const [price, setPrice] = useState('0')
    const [resulted, setResulted] = useState(true)
    const [auctionTimeLeft, setAuctionTimeLeft] = useState(null)
    const [apr, setAPR] = useState(0)

    useEffect(async () => {
        loadData()
    }, [])

    useEffect(() => {
        const auction = token.auction
        if (auction) {
            setPrice(getAuctionPrice(token))
            if (!auction.resulted) {
                setAuctionTimeLeft(auction.endTimestamp * 1000 - Date.now())
            }
            setResulted(auction.resulted)
        }
    }, [refreshLeftTime])

    const loadData = () => {
        const auction = token.auction
        if (auction) {
            setPrice(getAuctionPrice(token))
            if (!auction.resulted) {
                setAuctionTimeLeft(auction.endTimestamp * 1000 - Date.now())
            }
            setResulted(auction.resulted)
        }

        setAPR(token.apr)

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
                } catch (e) {
                    console.error('[INFO] Invalid tokenUri', metadata)
                }
            })
    }

    const handleClick = (e) => {
        e.preventDefault()
        const path = `/buyitem/${id}`
        router.push(path)
    }

    if (!tokenInfo.name) {
        return (
            <Flex
                flexDirection="column"
                onClick={handleClick}
                border="2px solid #45454500"
                bgColor="#23262F"
                padding={['10px', '10px', '16px']}
                borderRadius="8px"
                _hover={{
                    border: '2px solid #454545',
                    boxShadow: '0 12px 16px 4px #45454540',
                }}
                h="350px"
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
            flexDirection="column"
            onClick={handleClick}
            border="2px solid #45454500"
            bgColor="#23262F"
            padding={['10px', '10px', '16px']}
            borderRadius="8px"
            _hover={{
                border: '2px solid #454545',
                boxShadow: '0 12px 16px 4px #45454540',
            }}
            cursor="pointer"
        >
            <Flex
                backgroundImage={tokenInfo.image}
                backgroundSize="cover"
                backgroundPosition="center center"
                h="200px"
                borderRadius="6px"
                padding="12px"
                justifyContent="space-between"
            >
                {token.auction && !token.auction.resulted ? (
                    <Flex flexDirection="column">
                        <Text
                            fontSize="12px"
                            color="#ffffff70"
                            fontWeight="400"
                        >
                            {auctionTimeLeft > 0 ? 'Ending in' : 'Auction ended'}
                        </Text>
                        <Text
                            fontSize={['11px', '12px', '12px']}
                            color="white"
                            fontWeight="400"
                            maxW="150px"
                        >
                            {auctionTimeLeft > 0
                                ? formatLeftTime(auctionTimeLeft)
                                : ''}
                        </Text>
                    </Flex>
                ) : (
                    <Flex />
                )}
                {apr > 0 && (
                    <Tooltip
                        label={
                            tokenInfo.attributes[5].value +
                            ' Tier - ' +
                            apr +
                            '% APR'
                        }
                        hasArrow
                        arrowSize={12}
                        border="2px solid #AB8840"
                        arrowShadowColor="#AB8840"
                        borderRadius="5px"
                    >
                        <Image
                            src={
                                (apr === 10
                                    ? 'silver'
                                    : apr === 15
                                    ? 'gold'
                                    : 'platinum') + '_star.png'
                            }
                            ignoreFallback
                            width="21px"
                            height="21px"
                            ignoreFallback
                            position="relative"
                            right="0"
                            boxShadow="inset 0px 1px 1.15064px rgba(255, 255, 255, 0.4), inset 0px -1.3px 0.6px rgba(0, 0, 0, 0.5"
                        />
                    </Tooltip>
                )}
            </Flex>

            <Flex flexDirection="column" padding="3px">
                <Text
                    color="rgba(255, 255, 255, 0.5)"
                    fontSize="12px"
                    fontWeight="300"
                    mt="12px"
                >
                    {tokenInfo.attributes[5] ? tokenInfo.attributes[5].value : ""}{' '}
                    {token.id.startsWith('LM-') ? 'Living Module' : 'Satellite'}
                </Text>
                <Text
                    color="white"
                    fontSize={['15px', '15px', '18px']}
                    fontWeight="700"
                >
                    {tokenInfo.name}
                </Text>

                <Flex flexDirection="column">
                    <Flex flexDirection="row" alignItems="flex-start" mt="8px">
                        <Image
                            src="/starlusd.png"
                            w={['18px', '20px', '21px']}
                            h={['18px', '20px', '21px']}
                            mt="4px"
                            ignoreFallback
                        />
                        <Flex
                            flexDirection="column"
                            ml={['5px', '8px', '10px']}
                        >
                            <Flex
                                color="white"
                                fontWeight="400"
                                fontSize={['11px', '11px', '12px']}
                                flexDirection="row"
                            >
                                {convertPrice(price)}
                                <Text
                                    color="white"
                                    fontWeight="400"
                                    fontSize="9px"
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
                                    ethers.utils.formatUnits(price, 'ether') *
                                        starlPrice,
                                    2
                                )}{' '}
                                USD
                            </Text>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default ItemCard
