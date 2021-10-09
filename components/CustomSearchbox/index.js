import React, { useEffect, useState } from 'react'
import { Flex, Image, Input } from '@chakra-ui/react'

const CustomSearchbox = () => {
    const [icon, setIcon] = useState('header/ico_search.png')
    const [placeholderText, setPlaceholder] = useState('Search')

    const onFocus = () => {
        setIcon('header/ico_search_selected.png')
        setPlaceholder('')
    }

    const onBlur = () => {
        setIcon('header/ico_search.png')
        setPlaceholder('Search')
    }

    return (
        <Flex
            id="search_box"
            w="100%"
            h="100%"
            bg="transparent"
            onFocus={onFocus}
            onBlur={onBlur}
            _focusWithin={{
                background:
                    'linear-gradient(225deg, #FDBF25, #B417EB, #0D57FF, #2D9CB4)',
            }}
            borderRadius="6px"
            p="2px"
        >
            <Flex
                alignItems="center"
                alignSelf="center"
                borderRadius="5px"
                h="100%"
                w="100%"
                bg="#171e3a"
                p="0.5rem"
            >
                <Image
                    alt="ico search"
                    src={icon}
                    m="0 1rem 0 0.5rem"
                    ignoreFallback
                />
                <Input
                    textColor="white"
                    w="100%"
                    _focus={{ outline: 'none' }}
                    placeholder={placeholderText}
                    _placeholder={{ color: '#fff' }}
                    bg="#171e3a"
                    border="none"
                    fontSize="15px"
                />
            </Flex>
        </Flex>
    )
}

export default CustomSearchbox
