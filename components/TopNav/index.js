import { Box, Stack } from '@chakra-ui/layout'

import NavIcon from '../NavIcon'

const TopNav = () => {
    return (
        <Stack direction="row" spacing={5} align="center">
            <NavIcon
                label="Market"
                path="market"
                svg="market"
                h="24"
                w="20"
                bg_colour="market_bg"
            />
            <NavIcon
                label="Create"
                path="create"
                svg="create"
                h="24"
                w="20"
                bg_colour="create_bg"
            />
            <NavIcon
                label="Universe"
                path="universe"
                svg="universe"
                h="22"
                w="21"
                bg_colour="universe_bg"
            />
            <NavIcon
                label="Play"
                path="play"
                svg="play"
                h="18"
                w="25"
                bg_colour="play_bg"
            />
        </Stack>
    )
}

export default TopNav
