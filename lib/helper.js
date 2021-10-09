import { BigNumber, ethers } from 'ethers'

export const formatNumber = (x, decimals) => {
    if (decimals) {
        const parts = x.toFixed(decimals + 1).split('.')
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        return parts[0] + '.' + parts[1]?.slice(0, decimals)
    }
    return x.toFixed().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export const convertUnit = (amount) => ethers.utils.formatUnits(amount, 'ether')

export const convertPrice = (price) =>
    formatNumber(parseFloat(ethers.utils.formatUnits(price, 'ether')))

export const isTransactionMined = async (transactionHash) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const txReceipt = await provider.getTransactionReceipt(transactionHash)
    if (txReceipt && txReceipt.blockNumber) {
        return true
    }
    return false
}

export const requestSignMessage = async (timestamp) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const signature = await signer.signMessage(timestamp.toString())
    return signature
}

export const getBigNumber = (source) => {
    const parts = source.split('.')
    let decimals = 18
    if (parts[1] && parts[1].length) decimals -= parts[1].length
    let zero = '0'
    if (decimals < 0) return parts[0] + parts[1].slice(0, 18)
    return parts[0] + (parts[1] ? parts[1] : '') + zero.repeat(decimals)
}

export const formatLeftTime = (time) => {
    const seconds = Math.floor(time / 1000)
    const mins = Math.floor(seconds / 60)
    const hours = Math.floor(mins / 60)
    const days = Math.floor(hours / 24)
    return (
        (days > 0 ? days + 'd ' : '') +
        (hours % 24) +
        'h ' +
        (mins % 60) +
        'm ' +
        (seconds % 60) +
        's'
    )
}

export const formatDate = (date) => {
    const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
    ]
    const day = date.getDate()
    const month = months[date.getMonth()]
    const hour = '0' + date.getHours()
    const minute = '0' + date.getMinutes()
    const second = '0' + date.getSeconds()

    return `${day} ${month} ${hour.substr(-2)}:${minute.substr(
        -2
    )}:${second.substr(-2)}`
}

export const getStarlPrice = async () => {
    try {
        const res = await fetch('https://starltoken.com/price.json')
        const resJson = await res.json()
        console.log(resJson)
        return parseFloat(resJson.price)
    } catch (err) {
        console.log(err)
    }
    return 0
}

export const getAuctionPrice = (token) => {
    const auction = token.auction
    let price = null
    if (auction.resulted) {
        price = token.launchPrice
    } else {
        const reservePrice = BigNumber.from(auction.reservePrice)
        const bidPrice =
            auction.bids.length > 0
                ? BigNumber.from(auction.bids[auction.bids.length - 1].amount)
                : BigNumber.from('0')
        if (auction.bids.length === 0 || reservePrice.gt(bidPrice)) {
            price = reservePrice.toString()
        } else {
            price = bidPrice.toString()
        }
    }
    return price
}

export const limitedStr = (str, len) => {
    return str.substr(0, len) + (str.length > len ? '···' : '')
}

export const validURL = (str) => {
    return !!/((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi.test(
        str
    )
}

export function objectToGetParams(object) {
    const params = Object.entries(object)
        .filter(([, value]) => value !== undefined && value !== null)
        .map(
            ([key, value]) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    String(value)
                )}`
        )

    return params.length > 0 ? `?${params.join('&')}` : ''
}
