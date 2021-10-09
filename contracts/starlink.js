import { ethers } from 'ethers'
import abi from './starlink.abi.json'
import BigNumber from 'bignumber.js'
import { isTransactionMined } from '../lib/helper'

export async function getBalance(coinAddress, address, signer) {
    try {
        const erc20 = new ethers.Contract(coinAddress, abi, signer)
        const balance = await erc20.balanceOf(address)
        return balance.toString()
    } catch (e) {
        return '0'
    }
}

export async function getTotalSupply(coinAddress, signer) {
    try {
        const erc20 = new ethers.Contract(coinAddress, abi, signer)
        const total = await erc20.totalSupply()
        return total.toString()
    } catch (e) {
        return '0'
    }
}

export async function isTokenApproved(
    coinAddress,
    owner,
    contract,
    amount,
    signer
) {
    try {
        const erc20 = new ethers.Contract(coinAddress, abi, signer)
        const allowance = (await erc20.allowance(owner, contract)) || 0
        const x = new BigNumber(allowance)
        const y = new BigNumber(amount)
        return x.isGreaterThanOrEqualTo(y.isEqualTo('0') ? '10000000' : y)
    } catch (e) {
        return 0
    }
}

export async function approveToken(coinAddress, contract, amount, signer) {
    const erc20 = new ethers.Contract(coinAddress, abi, signer)
    const { hash } = await erc20.approve(contract, amount)
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
