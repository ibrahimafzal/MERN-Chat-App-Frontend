import { CloseIcon, ViewIcon } from '@chakra-ui/icons'
import { Badge, Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import axios from 'axios'
import UserListItem from './UserListItem'

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const { user, selectedChat, setSelectedChat } = ChatState()

    const [groupChatName, setGroupChatName] = useState('')
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [renameLoading, setRenameLoading] = useState(false)

    const toast = useToast()

    // Remove user from group
    const handleRemove = async (user1) => {
        if (selectedChat?.groupAdmin?._id !== user?.data?._id && user1._id !== user?.data?._id) {
            toast({
                title: "Only admins can remove someone!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.put("http://localhost:5000/chat/groupExit", {
                chatId: selectedChat?._id,
                userId: user1?._id
            }, config)

            user1._id === user.data._id ? setSelectedChat([]) : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: 'error',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            setLoading(false)
        }
    }

    // add user to group
    const addUserToGroup = async (user1) => {
        if (selectedChat?.users.find((u) => u._id === user1._id)) {
            toast({
                title: "User Already in group!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            return
        }

        if (selectedChat?.groupAdmin?._id !== user.data._id) {
            toast({
                title: "Only admins can add someone!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.put("http://localhost:5000/chat/addToGroup", {
                chatId: selectedChat?._id,
                userId: user1?._id
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: error.response.data.message,
                status: 'error',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }
    }

    // Rename group name
    const handleRename = async () => {
        if (!groupChatName) return

        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.put("http://localhost:5000/chat/rename", {
                chatId: selectedChat?._id,
                chatName: groupChatName
            }, config)

            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
        } catch (error) {
            toast({
                title: "Failed to rename the Group Name",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            setRenameLoading(false)
            setGroupChatName("")
        }
    }

    // Handle search users //
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

            const { data } = await axios.get(`http://localhost:5000/user/all-users?search=${search}`, config)
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


    return (
        <>
            <IconButton
                onClick={onOpen}
                display={{ base: 'flex' }}
                bg={'transparent'}
                color={'white'}
                fontSize={'20px'}
                icon={<ViewIcon />}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        textTransform={'capitalize'}
                        fontSize={'20px'}
                        fontFamily={'Poppins'}
                        display={'flex'}
                        justifyContent={'center'}
                    >{selectedChat?.chatName}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box display={'flex'} flexWrap={'wrap'} gap={'5px'} alignItems={'center'}>
                            {selectedChat?.users?.map((u) => (
                                <Badge colorScheme='whatsapp'
                                    key={`${u._id}-badge`}
                                    textTransform={'capitalize'}
                                    fontSize={'14px'}
                                    borderRadius={'lg'}
                                    px={2}
                                >
                                    {u.name}
                                    <CloseIcon ml={'5px'} w={'10px'} cursor={'pointer'} onClick={() => handleRemove(u)} />
                                </Badge>
                            ))}
                        </Box>

                        {/* Chat Name input */}
                        <FormControl display={'flex'} my={4}>
                            <Input
                                placeholder='Group Name'
                                value={groupChatName}
                                onChange={(e) => setGroupChatName(e.target.value)}
                            />
                            <Button
                                variant={'solid'}
                                colorScheme='whatsapp'
                                ml={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        {/* search Users Input */}
                        <FormControl mb={4}>
                            <Input
                                placeholder='Add members to group'
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {/* search users list */}
                        {
                            loading ? (
                                <div style={{ display: "flex", alignItems: "center", gap: "5px", justifyContent: "center" }}>
                                    <Spinner size={'sm'} /> Loading...
                                </div>
                            ) : (
                                searchResults?.map((user) => (
                                    <UserListItem
                                        key={user?._id}
                                        searchUser={user}
                                        handleFunction={() => addUserToGroup(user)}
                                    />
                                ))
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            colorScheme='red'
                            mr={0}
                            onClick={() => {
                                setLoading(true)
                                handleRemove(user.data)
                                setLoading(false)
                                onClose()
                            }}
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default UpdateGroupChatModal