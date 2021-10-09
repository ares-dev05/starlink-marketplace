import { extendTheme } from '@chakra-ui/react'

const styles = {
    global: () => ({
        body: {
            bg: 'seven',
            color: 'five',
        },
    }),
}

const colors = {
    one: '#333333',
    two: '#212121',
    four: '#794194',
    five: '#C4C4C4',
    six: '#23262F',
    seven: '#141416',
    market_bg: '#6734FF',
    create_bg: '#3479FF',
    universe_bg: '#D52215',
    play_bg: '#95B05A',
}

const fonts = {
    body: 'Poppins, sans-serif',
    // heading: 'Georgia, serif',
    // mono: 'Menlo, monospace',
}

const shadows = {
    outline: 'none',
}

const components = {
    FormLabel: {
        baseStyle: {
            fontSize: '12px',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.5)',
        },
    },
    Input: {
        baseStyle: {
            fontSize: '14px',
            fontWeight: '600',
            color: 'white',
        },
        variants: {
            outline: {
                field: {
                    // borderColor: 'blue.500',
                },
            },
        },
    },
    Image: {
        baseStyle: {
            ignoreFallback: true,
        },
    },
}

const theme = extendTheme({
    components,
    styles,
    colors,
    fonts,
    shadows,
})

export default theme
