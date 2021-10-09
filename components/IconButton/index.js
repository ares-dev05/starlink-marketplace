import { Flex, Image } from '@chakra-ui/react'

const IconButton = ({
    iconPath,
    noBorderLeftRadius,
    onClick,
    bgColor,
    height,
    imgSize,
}) => {
    return (
        <Flex
            p="9px"
            border="1px solid rgba(69, 69, 69, 0.5)"
            _hover={{ bgColor: 'rgba(69, 69, 69, 0.3)' }}
            bgColor={bgColor}
            cursor="pointer"
            borderTopLeftRadius={noBorderLeftRadius ? '0' : '6px'}
            borderBottomLeftRadius={noBorderLeftRadius ? '0' : '6px'}
            borderTopRightRadius={noBorderLeftRadius ? '6px' : '0'}
            borderBottomRightRadius={noBorderLeftRadius ? '6px' : '0'}
            borderLeftWidth={noBorderLeftRadius ? '0' : '1px'}
            onClick={onClick}
            height={height}
        >
            <Image
                src={iconPath}
                ignoreFallback
                width={imgSize || '17px'}
                height={imgSize || '17px'}
                objectFit="contain"
            />
        </Flex>
    )
}

export default IconButton
