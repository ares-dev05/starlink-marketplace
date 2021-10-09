import { createClient } from 'urql'
import { SUBGRAPH_URL, PAGE_SIZE } from './const'

const sateQuery = `
  query($orderBy: String, $orderDirection: String, $liveAuction: Boolean, $pageSize: Int, $category: String, $aprs: [Int!]!, $priceMin: BigInt, $priceMax: BigInt) {
    tokens(orderBy: $orderBy, orderDirection: $orderDirection, where: {
        apr_in: $aprs, liveAuction: $liveAuction, category: $category, starlPrice_gte: $priceMin, starlPrice_lte: $priceMax
    }, first: $pageSize) {
        id
        launchPrice
        starlPrice
        tokenUri
        category
        apr
        liveAuction
        auction {
            reservePrice
            resulted
            endTimestamp
            bids(first: 1, orderBy:amount, orderDirection:desc) {
                amount
            }
        }
    }
    all:tokens(orderBy: $orderBy, orderDirection: $orderDirection, where: {
        apr_in: $aprs, liveAuction: $liveAuction, category: $category, starlPrice_gte: $priceMin, starlPrice_lte: $priceMax
    }, first: 1000)
  }
`

const satePaginationQuery = `
  query($orderBy: String, $orderDirection: String, $liveAuction: Boolean, $skipSates: Int, $pageSize: Int, $category: String, $aprs: [Int!]!, $priceMin: BigInt, $priceMax: BigInt) {
    tokens(orderBy: $orderBy, orderDirection: $orderDirection, where: {
        apr_in: $aprs, liveAuction: $liveAuction, category: $category, starlPrice_gte: $priceMin, starlPrice_lte: $priceMax
    }, skip: $skipSates, first: $pageSize) {
        id
        launchPrice
        starlPrice
        tokenUri
        category
        apr
        liveAuction
        auction {
            reservePrice
            resulted
            endTimestamp
            bids(first: 1, orderBy:amount, orderDirection:desc) {
                amount
            }
        }
    }
  }
`

const sateDetailQuery = `
  query($tokenId: String) {
    token(id: $tokenId) {
        id
        launchTime
        launchPrice
        starlPrice
        tokenUri
        category
        apr
        liveAuction
        auction {
            reservePrice
            resulted
            bids(orderBy:timestamp) {
                sender
                amount
                timestamp
                txHash
            }
            startTimestamp
            endTimestamp
        }
        trades {
            event
            price
            from
            to
            timestamp
        }
    }
  }
`

const client = createClient({
    url: SUBGRAPH_URL,
    requestPolicy: 'cache-and-network',
})

const updateQueryByCategory = (
    query,
    selectedFilters,
    priceMin,
    priceMax,
    liveAuction
) => {
    let category = null
    if (selectedFilters.livingModules) {
        if (!selectedFilters.satellites) {
            category = 'LM'
        }
    } else {
        if (selectedFilters.satellites) {
            category = 'SATE'
        }
    }
    let updatedQuery = query
    if (!category) {
        updatedQuery = updatedQuery
            .replace(/, category: \$category/g, '')
            .replace(', $category: String', '')
    }
    if (priceMin > 0 && priceMax > 0) {
    } else if (priceMax > 0) {
        updatedQuery = updatedQuery
            .replace(/, starlPrice_gte: \$priceMin/g, '')
            .replace(', $priceMin: Int', '')
    } else if (priceMin > 0) {
        updatedQuery = updatedQuery
            .replace(/, starlPrice_lte: \$priceMax/g, '')
            .replace(', $priceMax: Int', '')
    } else {
        updatedQuery = updatedQuery
            .replace(
                /, starlPrice_gte: \$priceMin, starlPrice_lte: \$priceMax/g,
                ''
            )
            .replace(', $priceMin: Int, $priceMax: Int', '')
    }
    if (!liveAuction) {
        updatedQuery = updatedQuery
            .replace(/, liveAuction: \$liveAuction/g, '')
            .replace(', $liveAuction: Boolean', '')
    }
    return { updatedQuery, category }
}

const xor = (a, b) => (!a && b) || (a && !b)

export async function querySates(
    selectedFilters,
    aprFilters,
    priceRange,
    auctionSelected,
    order
) {
    const orderBy = `${order.orderBy}`
    const orderDirection = `${order.orderDirection}`
    const pageSize = parseInt(`${PAGE_SIZE}`)
    const priceMin = "" + priceRange.min
    const priceMax = "" + priceRange.max
    const hasLiveAuction = xor(
        auctionSelected.onAuction,
        auctionSelected.onBuyNow
    )
    const { updatedQuery, category } = updateQueryByCategory(
        sateQuery,
        selectedFilters,
        priceMin,
        priceMax,
        hasLiveAuction
    )
    let aprs = Object.keys(aprFilters)
        .filter((apr) => aprFilters[apr])
        .map((apr) => parseInt(apr))
    aprs = aprs.length === 0 ? [0, 10, 15, 20] : aprs
    const liveAuction = hasLiveAuction && auctionSelected.onAuction

    try {
        const queryRes = await client
            .query(updatedQuery, {
                orderBy,
                orderDirection,
                liveAuction,
                category,
                pageSize,
                aprs,
                priceMin,
                priceMax,
            })
            .toPromise()
        if (queryRes.data) {
            return queryRes.data
        }
    } catch (err) {
        console.log(err)
    }
    return null
}

export async function queryPaginationSates(
    selectedFilters,
    aprFilters,
    priceRange,
    auctionSelected,
    order,
    currentPage
) {
    const orderBy = `${order.orderBy}`
    const orderDirection = `${order.orderDirection}`
    const skipSates = parseInt(`${(currentPage - 1) * PAGE_SIZE}`)
    const pageSize = parseInt(`${PAGE_SIZE}`)
    const priceMin = "" + priceRange.min
    const priceMax = "" + priceRange.max
    const hasLiveAuction = xor(
        auctionSelected.onAuction,
        auctionSelected.onBuyNow
    )
    const { updatedQuery, category } = updateQueryByCategory(
        satePaginationQuery,
        selectedFilters,
        priceMin,
        priceMax,
        hasLiveAuction
    )
    let aprs = Object.keys(aprFilters)
        .filter((apr) => aprFilters[apr])
        .map((apr) => parseInt(apr))
    aprs = aprs.length === 0 ? [0, 10, 15, 20] : aprs
    const liveAuction = hasLiveAuction && auctionSelected.onAuction

    try {
        const queryRes = await client
            .query(updatedQuery, {
                orderBy,
                orderDirection,
                liveAuction,
                category,
                skipSates,
                pageSize,
                aprs,
                priceMin,
                priceMax,
            })
            .toPromise()
        if (queryRes.data) {
            return queryRes.data.tokens
        }
    } catch (err) {
        console.log(err)
    }
    return null
}

export async function querySateDetail(id) {
    const tokenId = `${id}`
    try {
        const queryRes = await client
            .query(sateDetailQuery, { tokenId })
            .toPromise()
        if (queryRes.data) {
            return queryRes.data.token
        }
    } catch (err) {
        console.log(err)
    }
    return null
}
