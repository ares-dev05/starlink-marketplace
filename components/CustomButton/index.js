import { Flex, Button, Text, Image } from '@chakra-ui/react'

const CustomButton = ({
    title,
    color,
    marginLeft,
    onClick,
    disabled,
    icon,
    border,
    number,
}) => (
    <Button
        variant="solid"
        bgColor={color}
        h="48px"
        w={title.length > 10 ? '220px' : '120px'}
        boxShadow={'0 12px 16px 4px ' + color + '40'}
        marginLeft={marginLeft}
        onClick={onClick}
        disabled={disabled}
        borderRadius="24px"
        border={border}
        _hover={{
            backgroundColor: color + '70',
        }}
    >
        {icon && (
            <Image src={icon} w="24px" h="19px" mr="10px" ignoreFallback />
        )}
        <Text color="white" fontWeight="700" fontSize="15px">
            {title.toUpperCase()}
        </Text>
        {number > 0 && (
            <Flex
                borderRadius="10px"
                bgColor="#9362AD"
                w="20px"
                h="20px"
                justify="center"
                alignItems="center"
                fontSize="11px"
                color="white"
                fontWeight="700"
                ml="10px"
            >
                {number}
            </Flex>
        )}
    </Button>
)

export default CustomButton
