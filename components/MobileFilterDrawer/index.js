import {
    Flex,
    Image,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react'

import FilterDrawer from '../FilterDrawer'
import { useMarketplaceFilterContext } from '../../context/marketplace-filter'

const MobileFilterDrawer = () => {
    const { isOpen, onClose } = useMarketplaceFilterContext()
    return (
        <Modal onClose={onClose} size="full" isOpen={isOpen}>
            <ModalOverlay />
            <ModalContent bgColor="#23262FE0">
                <ModalHeader bg="#161A25">
                    <Flex>
                        <Image
                            alt="Menu Icon"
                            w="30px"
                            h="24px"
                            src="/filter-icon.svg"
                            ignoreFallback
                        />
                        <Text ml="10px" color="white" fontSize="17px">
                            FILTER RESULTS
                        </Text>
                    </Flex>
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FilterDrawer noHeader />
                </ModalBody>
                <ModalFooter></ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default MobileFilterDrawer
