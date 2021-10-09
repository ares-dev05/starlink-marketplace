import React, { useEffect, useState } from 'react'
import { Flex } from '@chakra-ui/react'
import { SocialIcon } from 'react-social-icons'

const Socialbutton = ({ network }) => {
    const [focused, setFocus] = useState(0)

    const onFocus = () => {
        setFocus(1)
    }

    const onBlur = () => {
        setFocus(0)
    }

    return (
        <Flex
            w="100%"
            h="100%"
            borderRadius="10px"
            justifyContent="center"
            alignItems="center"
            border="none"
            bg={focused ? '#1365F1' : '#fff'}
            onMouseOver={onFocus}
            onMouseLeave={onBlur}
        >
            {focused == 0 && (
                <SocialIcon
                    url=""
                    network={network}
                    style={{ width: 35, height: 35 }}
                    fgColor="#06061C"
                    bgColor="transparent"
                />
            )}
            {focused == 1 && (
                <SocialIcon
                    network={network}
                    style={{ width: 35, height: 35 }}
                    fgColor="#fff"
                    bgColor="transparent"
                />
            )}
        </Flex>
    )
}

export default Socialbutton
