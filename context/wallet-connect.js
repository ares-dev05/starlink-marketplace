import { createContext, useContext, useState } from 'react'

import { useDisclosure } from '@chakra-ui/react'

const WalletConnectContext = createContext({})

export const WalletConnectWrapper = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <WalletConnectContext.Provider
            value={{
                isOpen,
                onOpen,
                onClose,
            }}
        >
            {children}
        </WalletConnectContext.Provider>
    )
}

export const useWalletConnectContext = () => useContext(WalletConnectContext)
