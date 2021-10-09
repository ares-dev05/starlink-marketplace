import { Flex } from '@chakra-ui/react'
import React from 'react'
import Switch from '@material-ui/core/Switch'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'
import { withStyles } from '@material-ui/core/styles'

const CustomSwitch = withStyles((theme) => ({
    root: {
        width: 55,
        height: 26,
        padding: 1,
        margin: theme.spacing(0),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(28px)',
            color: theme.palette.common.white,
            '& + $track': {
                background: '#131A32',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid grey',
        },
    },
    thumb: {
        width: 26,
        height: 26,
        marginTop: '-1px',
    },
    track: {
        borderRadius: 26 / 2,
        background:
            'linear-gradient(to left, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    const { liveAuction, useSetLiveAuction } = useMarketplaceFilterContext()
    const handleOnChange = (e) => {
        useSetLiveAuction(e.target.checked)
    }
    return (
        <Flex
            w="56px"
            h="28px"
            borderRadius="14px"
            bg="transparent"
            _hover={{
                background: classes.checked
                    ? 'linear-gradient(to left, #FDBF25, #B417EB, #0D57FF, #2D9CB4)'
                    : 'transparent',
            }}
            padding="2px 2px 2px 0"
            justifyContent="flex-start"
            alignItems="center"
        >
            <Switch
                checked={liveAuction}
                onChange={handleOnChange}
                focusVisibleClassName={classes.focusVisible}
                disableRipple
                classes={{
                    root: classes.root,
                    switchBase: classes.switchBase,
                    thumb: classes.thumb,
                    track: classes.track,
                    checked: classes.checked,
                }}
                {...props}
            />
        </Flex>
    )
})

export default CustomSwitch
