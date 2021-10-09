module.exports = {
    env: {
        API_URL: process.env.API_URL,
        MARKET_URL: process.env.MARKET_URL,
        SUBGRAPH_URL: process.env.SUBGRAPH_URL,
        NETWORK: process.env.NETWORK,
    },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/market',
                permanent: true,
            },
        ]
    },
    webpack(config, { defaultLoaders }) {
        config.module.rules.push({
            test: /\.(css)$/,
            use: [
                defaultLoaders.babel,
                {
                    loader: require('styled-jsx/webpack').loader,
                    options: {
                        type: 'global',
                    },
                },
            ],
        })

        return config
    },
}
