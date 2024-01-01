import { ChevronDownIcon, HamburgerIcon, ViewIcon } from '@chakra-ui/icons'
import { Button, IconButton, Image, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react'
import React from 'react'

const ProfileModal = ({ user, children }) => {

    const { isOpen, onOpen, onClose } = useDisclosure()

    return (
        <>
            {
                children ? (
                    <span onClick={onOpen}>{children}</span>
                ) : (
                    <Menu>
                        <MenuButton as={IconButton} icon={<ChevronDownIcon />} variant="filled" fontSize={'30px'} />
                        <MenuList minWidth={'50%'}>
                            <MenuItem color={'black'} fontSize={'13px'} onClick={onOpen}>View Profile</MenuItem>
                        </MenuList>
                    </Menu>
                )
            }
            <Modal
                isCentered
                onClose={onClose}
                isOpen={isOpen}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize={'30px'}
                        display={'flex'}
                        justifyContent={'center'}
                        textTransform={'capitalize'}
                    >
                        {user?.name}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody display={'flex'} alignItems={'center'} flexDirection={'column'}>
                        <Image
                            borderRadius={'full'}
                            boxSize={'100px'}
                            src={user?.pic}
                            alt={user?.name}
                            marginBottom={'25px'}
                        />
                        <Text fontSize={{ base: '15px', md: "30px" }} color={'#6c757d'}><span style={{ fontWeight: "bold" }}>Email:</span> {user?.email}</Text>
                        <Text fontSize={{ base: '15px', md: "30px" }} color={'#6c757d'}><span style={{ fontWeight: "bold" }}>Mobile:</span> +92{user?.mobile}</Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='whatsapp' mr={1} onClick={onClose}>
                            Close
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default ProfileModal