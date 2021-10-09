import {
    Flex,
    FormLabel,
    Button,
    Input,
    InputLeftElement,
    InputGroup,
    Text,
    Modal,
    ModalContent,
    ModalOverlay,
} from '@chakra-ui/react'

import { useWallet } from 'use-wallet'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FaAddressCard } from 'react-icons/fa'
import { ethers } from 'ethers'

const AddAddressModal = (props) => {
    const wallet = useWallet()
    const router = useRouter()
    const [ethAddr, setEthAddr] = useState('')

    useEffect(() => {
        setEthAddr('')
    }, [props.isOpen])

    const addEthAddr = () => {
        if (props.addEthAddr(ethAddr)) {
            props.onClose()
        }
    }

    return (
        <Modal size="sm" isOpen={props.isOpen} onClose={props.onClose}>
            <ModalOverlay />
            <ModalContent
                borderRadius="18px"
                bg="#0e1429"
                padding="1rem"
                w={['22rem', '22rem', '40rem', '40rem', '40rem']}
                marginTop="12rem"
            >
                <Text fontSize="24px">Add ETH Address</Text>
                <Flex
                    flexDirection={['column', 'column', 'row', 'row', 'row']}
                    justifyContent={[
                        'flex-start',
                        'flex-start',
                        'flex-start',
                        'flex-start',
                        'flex-start',
                    ]}
                    alignItems={[
                        'flex-start',
                        'flex-start',
                        'flex-end',
                        'flex-end',
                        'flex-end',
                    ]}
                    mt="1rem"
                    w={['20rem', '20rem', '32rem', '32rem', '32rem']}
                >
                    <FormLabel>ETH Address: </FormLabel>
                    <InputGroup
                        w={['20rem', '20rem', '15rem', '15rem', '15rem']}
                    >
                        <InputLeftElement children={<FaAddressCard />} />
                        <Input
                            placeholder="0xbD1..."
                            value={ethAddr}
                            onChange={(e) => setEthAddr(e.target.value)}
                        />
                    </InputGroup>
                </Flex>
                <Button
                    colorScheme="blue"
                    variant="solid"
                    w="10rem"
                    mt="1rem"
                    disabled={!ethers.utils.isAddress(ethAddr)}
                    onClick={addEthAddr}
                >
                    Add Address
                </Button>
            </ModalContent>
        </Modal>
    )
}

export default AddAddressModal
