import { ethers } from 'ethers'
import abi from './sate.abi.json'
import { isTransactionMined } from '../lib/helper'

export async function getMetadata(nft, tokenId, provider) {
    try {
        const contract = new ethers.Contract(nft, abi, provider)
        const metadata = await contract.tokenURI(tokenId)
        return metadata
    } catch (e) {
        console.error(e)
        return ''
    }
}

export async function getSateInfo(nft, tokenId, provider) {
    try {
        const contract = new ethers.Contract(nft, abi, provider)
        const tokenInfo = await contract.sateInfo(tokenId)
        return tokenInfo
    } catch (e) {
        console.error(e)
        return {}
    }
}
