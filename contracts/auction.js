import { ethers } from 'ethers'
import abi from './auction.abi.json'
import lmAuctionAbi from './lmauction.abi.json'
import { isTransactionMined } from '../lib/helper'

export async function placeBid(auction, tokenId, amount, signer, setPending) {
    const contract = new ethers.Contract(
        auction,
        tokenId.startsWith('LM-') ? lmAuctionAbi : abi,
        signer
    )
    const { hash } = await contract.placeBid(tokenId.replace('LM-', ''), amount)
    setPending(true)
    try {
        while (true) {
            let mined = await isTransactionMined(hash)
            if (mined) break
        }
    } catch (e) {
        console.error(e)
        return ''
    }
    return hash
}

export async function getAuction(auction, tokenId, signer) {
    try {
        const contract = new ethers.Contract(auction, abi, signer)
        const auctionInfo = await contract.auctions(tokenId)
        return auctionInfo
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function getHighestBid(auction, tokenId, signer) {
    try {
        const contract = new ethers.Contract(auction, abi, signer)
        const info = await contract.highestBids(tokenId)
        return info
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function getMinBidIncrement(auction, signer) {
    try {
        const contract = new ethers.Contract(auction, abi, signer)
        const mbi = await contract.minBidIncrement()
        return mbi
    } catch (e) {
        console.error(e)
        return {}
    }
}

export async function getOffers(auction, tokenId, signer) {
    try {
        const contract = new ethers.Contract(auction, abi, signer)
        const info = await contract
            .getPastEvents('BidPlaced', {
                fromBlock: 0,
                toBlock: 'latest',
            })
            .then((events) => {
                return events.map((event) => {
                    return {
                        price: event.bid,
                    }
                })
            })
            .catch((err) => {
                console.log(err)
                return []
            })
    } catch (e) {
        console.error(e)
        return {}
    }
}
