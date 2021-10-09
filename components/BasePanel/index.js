import React, { useState } from 'react'
import { Flex, Image, Text } from '@chakra-ui/react'

const BasePanel = ({
    title,
    subTitle,
    ml,
    mt,
    mr,
    mb,
    initShow,
    alwaysShow,
    children,
    borderBottomRadius,
    mob,
}) => {
    const [showChildren, setShowChildren] = useState(initShow)

    return (
        <Flex
            flexDirection="column"
            border="1px solid #45454577"
            borderBottomLeftRadius={borderBottomRadius || '6px'}
            borderBottomRightRadius={borderBottomRadius || '6px'}
            borderTopWidth={mob ? '1px' : '0'}
            borderTopLeftRadius={mob ? '6px' : null}
            borderTopRightRadius={mob ? '6px' : null}
            bgColor="#1C1C1F"
            ml={ml}
            mt={mt}
            mr={mr}
            mb={mb}
            pb="18px"
            pl="15px"
            pr="14px"
            pt="4px"
        >
            <Flex
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
                textColor="#fff"
                fontSize="18px"
            >
                <Flex
                    flexDirection="row"
                    alignItems="flex-end"
                    mt="18px"
                    mb="18px"
                >
                    <Text
                        fontWeight="400"
                        color="rgba(255,255,255,0.5)"
                        fontSize="16px"
                    >
                        {title.toUpperCase()}
                    </Text>
                    <Text fontSize="11px" ml="1rem" mb="0.2rem" color="#ccc">
                        {subTitle}
                    </Text>
                </Flex>
                {!alwaysShow && (
                    <Image
                        width="9px"
                        height="4px"
                        src={
                            showChildren
                                ? '/arrow_up_white.png'
                                : '/arrow_down.png'
                        }
                        ignoreFallback
                        cursor="pointer"
                        zIndex={3}
                        onClick={() => setShowChildren(!showChildren)}
                    />
                )}
            </Flex>

            {showChildren && children}
        </Flex>
    )
}

export default BasePanel
