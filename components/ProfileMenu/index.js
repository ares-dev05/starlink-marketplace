import { Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'

import { useState } from 'react'

const ProfileMenu = ({
    onlyDisconnect,
    editing,
    logout,
    editCover,
    editProfile,
    deleteProfile,
}) => {
    const [hovered, setHovered] = useState(false)

    return (
        <Menu offset={[-119, 1]} matchWidth={true}>
            <MenuButton>
                <Text
                    backgroundColor="#2C2C2C"
                    pl="10px"
                    pr="10px"
                    pt="0px"
                    pb="8px"
                    borderRadius="5px"
                    fontWeight="600"
                >
                    ...
                </Text>
            </MenuButton>
            <MenuList
                backgroundColor="#2C2C2C"
                _selected={-1}
                border="0px"
                minW="150px"
                zIndex={3}
            >
                {/* <MenuItem
                    style={!hovered ? { backgroundColor: '#2C2C2C' } : {}}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="white"
                    onClick={editCover}
                    display={onlyDisconnect ? 'none' : null}
                >
                    Edit Cover
                </MenuItem> */}
                <MenuItem
                    style={!hovered ? { backgroundColor: '#2C2C2C' } : {}}
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="white"
                    onClick={editProfile}
                    display={onlyDisconnect ? 'none' : null}
                >
                    {editing ? 'View Profile' : 'Edit Profile'}
                </MenuItem>
                <MenuItem
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="red.600"
                    onClick={deleteProfile}
                    display={onlyDisconnect ? 'none' : null}
                >
                    Delete Profile
                </MenuItem>
                <MenuItem
                    _hover={{ backgroundColor: '#3C3C3C' }}
                    color="#2C2C2C"
                    textColor="white"
                    onClick={logout}
                >
                    {onlyDisconnect ? 'Disconnect wallet' : 'Logout'}
                </MenuItem>
            </MenuList>
        </Menu>
    )
}

export default ProfileMenu
