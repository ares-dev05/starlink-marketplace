import { createContext, useCallback, useContext, useState } from 'react'

const SignedUserContext = createContext({})

export const SignedUserWrapper = ({ signedUser, children }) => {
    const [loginStatus, setLoginStatus] = useState(
        signedUser && signedUser.userId ? 2 : signedUser ? 1 : -1
    )
    const [userInfo, setUserInfo] = useState(signedUser)
    return (
        <SignedUserContext.Provider
            value={{
                signedUser,
                loginStatus,
                setLoginStatus,
                userInfo,
                setUserInfo,
            }}
        >
            {children}
        </SignedUserContext.Provider>
    )
}

export const useSignedUserContext = () => useContext(SignedUserContext)
