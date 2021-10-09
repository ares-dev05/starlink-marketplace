export const STARL_ADDRESS = {
    1: '0x8e6cd950ad6ba651f6dd608dc70e5886b1aa6b24',
    4: '0x5a168798df2b9d84e28958702156b036927a9e29',
}

export const SATE_AUCTION_ADDRESS = {
    1: '0x0d45d108f56a2916332a2a0c73e71452e8560260',
    4: '0x56131689E389498e45F4b93Cc7AA238dF3740Ad3',
}

export const SATE_NFT_ADDRESS = {
    1: '0x48470fb3fe7108b9e15b2bf7aa15b7adf774d721',
    4: '0x9da1E70E26156abC3B29260Df67d2aB65D761Ad6',
}

export const STLM_NFT_ADDRESS = {
    1: '0x3634847577a40af0a0f592fdbcc1903720112cf6',
    4: '0xa56F7d14316f551f92223D1Ea89F2A8050B4D42d',
}

export const NFT_SALE_ADDRESS = {
    1: '0xb2EBC96485B1C5e9e5a3D4A07ed60db6cDa82A96',
    4: '0xb2EBC96485B1C5e9e5a3D4A07ed60db6cDa82A96',
}

export const REWARD_VAULT_ADDRESS = {
    1: '0xCE968135e84688F48C7e9567103fE249660029DE',
    4: '0x1cfce979b80ceb452a9af1e8583a6c11eef4a354',
}

export const getAuctionAddress = (tokenId, netId) => {
    return tokenId.startsWith('LM-')
        ? NFT_SALE_ADDRESS[netId]
        : SATE_AUCTION_ADDRESS[netId]
}

export const getNftAddress = (tokenId, netId) => {
    return tokenId.startsWith('LM-')
        ? STLM_NFT_ADDRESS[netId]
        : SATE_NFT_ADDRESS[netId]
}

export const API_URL = process.env.API_URL || 'https://api.starltoken.com'

export const UNISWAP_BUY =
    'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x8e6cd950ad6ba651f6dd608dc70e5886b1aa6b24&use=V2'

export const SESSION_PASSWORD =
    'STARLINK-MARKETPLACE-9871212*&&%^&9123*&^^%12387123QQ'

export const COOKIE_NAME = 'starlink'

export const PAGE_SIZE = 15

export const socialMediaUrls = {
    facebookUrl:
        'https://facebook.com/StarLink-Metaverse-starl-778484112539350',
    twitterUrl: 'https://twitter.com/starlinketh',
    telegramUrl: 'https://t.me/Starlinkofficial',
    youtubeUrl: 'N/A',
    mediumUrl: 'https://starlmeta.medium.com',
    instagramUrl: 'https://www.instagram.com/starl_official',
    twitchUrl: 'N/A',
    discordUrl: 'https://discord.gg/3dS3jvU6',
}

export const APR_NAMES = {
    0: 'free',
    20: 'platinum',
    15: 'gold',
    10: 'silver',
}

export const APR_TIERS = {
    0: 'Free Tier',
    20: 'GEO Tier',
    15: 'Gold Tier',
    10: 'Silver Tier',
}

export const NETWORK = process.env.NETWORK || 'mainnet'
export const SUBGRAPH_URL = process.env.SUBGRAPH_URL || 'https://api.thegraph.com/subgraphs/name/lclement927/starlink_mainnet'
