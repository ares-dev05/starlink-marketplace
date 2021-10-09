import { Box, Stack } from '@chakra-ui/layout'

import NavIcon from '../NavIcon'

const SideNav = ({ opened }) => {
    return (
        <Box w="70px" bg="six" pt={5}>
            <Stack direction="column" spacing={5} align="center">
                <NavIcon
                    label="Market"
                    path="market"
                    svg="market"
                    h="20"
                    w="16.67"
                    bg_colour="market_bg"
                />
                <NavIcon
                    label="Create"
                    path="create"
                    svg="create"
                    h="24"
                    w="20.03"
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
                    w="24.7"
                    bg_colour="play_bg"
                />
            </Stack>
        </Box>
    )
}

export default SideNav
