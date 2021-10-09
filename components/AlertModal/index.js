import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Text,
    Spinner,
    Button,
} from '@chakra-ui/react'

const AlertModal = ({
    title,
    description,
    buttonLabel,
    buttonAction,
    cancelLabel,
    alertLoading,
    isOpen,
    onClose,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent
                bgColor="#23262F"
                border="1px solid #555555"
                mt="150px"
                w={['90%', '90%', null]}
            >
                <ModalHeader
                    fontSize={['18px', '18px', '22px']}
                    fontWeight="700"
                    color="white"
                >
                    {title || 'Loading Failed'}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody fontSize="14px">
                    <Text fontWeight="bold" mb="1rem" fontWeight="400">
                        {description ||
                            'Please check your internet connection or check the sub graph if you are site owner.'}
                    </Text>
                </ModalBody>

                <ModalFooter>
                    {cancelLabel && (
                        <Button
                            borderRadius="43px"
                            // bgColor="#1B1E25"
                            // border="1px solid rgba(255, 255, 255, 0.4)"
                            colorScheme="blue"
                            fontSize="15px"
                            fontWeight="700"
                            color="gray.300"
                            variant="ghost"
                            mr={3}
                            onClick={onClose}
                        >
                            {cancelLabel}
                        </Button>
                    )}
                    <Button
                        w={cancelLabel ? null : '100%'}
                        borderRadius="43px"
                        bgColor="#1B1E25"
                        border="1px solid rgba(255, 255, 255, 0.4)"
                        colorScheme="blue"
                        fontSize="15px"
                        fontWeight="700"
                        color={buttonLabel === 'Delete' ? 'red.300' : 'white'}
                        mr={3}
                        onClick={buttonAction || onClose}
                        disabled={alertLoading}
                    >
                        {alertLoading && <Spinner mr="4px" />}
                        {buttonLabel || 'Reload Now'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AlertModal
