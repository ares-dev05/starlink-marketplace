import React from 'react'
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Button,
} from '@chakra-ui/react'

export default function DeleteUserConfirmModal({
    isOpen,
    setIsOpen,
    onDelete,
}) {
    const onDeleteClicked = () => {
        onDelete()
        setIsOpen(false)
    }
    const cancelRef = React.useRef()

    return (
        <AlertDialog
            isOpen={isOpen}
            leastDestructiveRef={cancelRef}
            onClose={() => setIsOpen(false)}
        >
            <AlertDialogOverlay>
                <AlertDialogContent>
                    <AlertDialogHeader
                        fontSize="lg"
                        fontWeight="bold"
                        color="gray.700"
                    >
                        Delete Profile
                    </AlertDialogHeader>

                    <AlertDialogBody color="gray.700">
                        Are you sure? You can't undo this action afterwards.
                    </AlertDialogBody>

                    <AlertDialogFooter>
                        <Button
                            color="gray.700"
                            ref={cancelRef}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            colorScheme="red"
                            onClick={onDeleteClicked}
                            ml={3}
                        >
                            Delete
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialogOverlay>
        </AlertDialog>
    )
}
