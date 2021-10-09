import { createContext, useContext, useState } from 'react'

import { useDisclosure } from '@chakra-ui/react'

const MobileMenuContext = createContext({})

export const MobileMenuWrapper = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
        <MobileMenuContext.Provider
            value={{
                isOpen,
                onOpen,
                onClose,
            }}
        >
            {children}
        </MobileMenuContext.Provider>
    )
}

export const useMobileMenuContext = () => useContext(MobileMenuContext)
