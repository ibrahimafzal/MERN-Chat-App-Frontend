import { WarningTwoIcon } from '@chakra-ui/icons'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ConfirmationModal = ({ children, deleteChat, chat, fetchChats }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'} alignItems="center" gap={'10px'}>
                        <WarningTwoIcon fontSize={"30px"} color={"red"} />
                        Warning!
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} justifyContent={'center'} flexDir={'column'} alignItems={'center'}>
                        Are you sure you want to delete this Chat?
                        <span>This action cannot be undone.</span>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            size={'sm'}
                            colorScheme='red'
                            mr={3}
                            onClick={() => {
                                deleteChat(chat?._id)
                                fetchChats()
                                onClose()
                             }}
                            >
                            YES
                        </Button>
                        <Button size={'sm'} colorScheme='whatsapp' mr={3} onClick={onClose}>
                            NO
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ConfirmationModal