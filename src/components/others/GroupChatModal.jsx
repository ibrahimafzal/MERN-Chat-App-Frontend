import { Badge, Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import UserListItem from './UserListItem'
import { CloseIcon } from '@chakra-ui/icons'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName, setGroupChatName] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)

    const { user, chats, setChats } = ChatState()
    const toast = useToast()

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.get(`https://mern-chat-app-backend-xi.vercel.app/user/all-users?search=${search}`, config)
            setLoading(false)
            setSearchResults(data)
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                description: 'Failed to load the search results!',
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }
    }
    const handleAddUserToGroup = (userToAdd) => {
        if (selectedUsers?.includes(userToAdd)) {
            toast({
                title: "User already added!",
                status: 'warning',
                position: 'top',
                isClosable: true,
                duration: 5000
            })
            return
        }
        setSelectedUsers([...selectedUsers, userToAdd])
    }

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers) {
            toast({
                title: "Please Fill all the Fields!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            return
        }

        try {
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.post("https://mern-chat-app-backend-xi.vercel.app/chat/createGroup", {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((u) => u._id))
            }, config)

            setChats([data, ...chats])
            onClose()
            toast({
                title: "New Group Created!",
                status: 'warning',
                position: 'top',
                isClosable: true,
                duration: 5000
            })
            
        } catch (error) {
            console.log(error)
            toast({
                title: "Error occured!",
                description: error.response.data,
                status: 'warning',
                position: 'top',
                isClosable: true,
                duration: 5000
            })
        }
    }

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter(u => u?._id !== delUser._id))
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>
            
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent mt={'9rem'}>
                    <ModalHeader
                        fontSize={'20px'}
                        fontFamily={'Poppins'}
                        display={'flex'}
                        justifyContent={'center'}
                    >
                        Create New Group
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        alignItems={'center'}
                        p={'10px'}
                    >
                        {/* Chat Name input */}
                        <FormControl>
                            <Input
                                placeholder='Group Name'
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                        </FormControl>
                        {/* search Users Input */}
                        <FormControl mt={4} mb={selectedUsers.length > 0 ? 0 : 4}>
                            <Input
                                placeholder='Add members'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box display={selectedUsers.length > 0 ? 'flex': 'none'} flexWrap={'wrap'} alignItems={'center'} gap={'10px'} my={4}>
                            {
                                selectedUsers?.map((u) => (
                                    <Badge colorScheme='whatsapp'
                                        key={`${u._id}-badge`}
                                        textTransform={'capitalize'}
                                        fontSize={'14px'}
                                        borderRadius={'lg'}
                                        px={2}
                                    >
                                        {u.name}
                                        <CloseIcon ml={'5px'} w={'10px'} onClick={() => handleDelete(u)} />
                                    </Badge>
                                ))
                            }
                        </Box>
                        {
                            loading ? (
                                <div>Loading...</div>
                            ) : (
                                searchResults?.map((user) => (
                                    <UserListItem
                                        key={user?._id}
                                        searchUser={user}
                                        handleFunction={() => handleAddUserToGroup(user)}
                                    />
                                ))
                            )
                        }
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='whatsapp' onClick={handleSubmit}>
                            Create
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default GroupChatModal