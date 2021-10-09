import {
    Box,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from '@chakra-ui/react'

import NavIconMobile from '../NavIconMobile'
import { Stack } from '@chakra-ui/react'
import StarlLogo from '../StarlLogo'
import WalletConnect from '../WalletConnect'
import { useMobileMenuContext } from '../../context/mobile-menu'

const MobileMenu = () => {
    const { isOpen, onClose } = useMobileMenuContext()
    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen} bg="one">
            <ModalOverlay />
            <ModalContent bg="one">
                <ModalHeader p="14px">
                    <StarlLogo />
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction="column" paddingLeft="20vw">
                        <Box w="1px" h="20px" />
                        <NavIconMobile
                            onClick={onClose}
                            label="Market"
                            path="market"
                            svg="market"
                            h="34"
                            w="28"
                            bg_colour="market_bg"
                        />
                        <Box w="1px" h="36px" />
                        <NavIconMobile
                            onClick={onClose}
                            label="Create"
                            path="create"
                            svg="create"
                            h="34"
                            w="28"
                            bg_colour="create_bg"
                        />
                        <Box w="1px" h="36px" />
                        <NavIconMobile
                            onClick={onClose}
                            label="Universe"
                            path="universe"
                            svg="universe"
                            h="31"
                            w="27"
                            bg_colour="universe_bg"
                        />
                        <Box w="1px" h="36px" />
                        <NavIconMobile
                            onClick={onClose}
                            label="Play"
                            path="play"
                            svg="play"
                            h="27"
                            w="38"
                            bg_colour="play_bg"
                        />
                    </Flex>
                </ModalBody>
                <ModalFooter>
                    <Flex
                        justify="center"
                        position="absolute"
                        bottom="50px"
                        left="1vw"
                        right="1vw"
                    >
                        <WalletConnect />
                    </Flex>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MobileMenu
