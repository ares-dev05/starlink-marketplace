import { useState } from 'react'
import { Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react'
import IconButton from '../../components/IconButton'
import { objectToGetParams } from '../../lib/helper'

const SocialShare = ({ tokenInfo, tokenId, tokenClass }) => {
    const [hovered, setHovered] = useState(false)
    const category = tokenId.startsWith('LM-') ? 'Living Module' : 'Satellite'
    const text = `${tokenClass} ${category} - ${tokenInfo.name}`
    const url = process.env.MARKET_URL + "/buyitem/" + tokenId
    const facebookLink = 'https://www.facebook.com/sharer/sharer.php' +
        objectToGetParams({
            u: url,
            quote: text,
            hashtag: tokenId,
        })
    const twitterLink = 'https://twitter.com/share' +
        objectToGetParams({
            url: url,
            text: text,
            via: "",
            hashtags: tokenId,
            related: ""
        })
    return (
        <Menu>
            <MenuButton>
                <IconButton iconPath="/share.png" noBorderLeftRadius />
            </MenuButton>
            <MenuList backgroundColor="#2C2C2C" _selected={-1} zIndex={3}>
                <MenuItem
                    style={!hovered ? { backgroundColor: '#2C2C2C' } : {}}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="white"
                    onClick={() => {
                        window.open(facebookLink)
                    }}
                >
                    Share to facebook
                </MenuItem>
                <MenuItem
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="white"
                    onClick={() => {
                        window.open(twitterLink)
                    }}
                >
                    Share to twitter
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default SocialShare
