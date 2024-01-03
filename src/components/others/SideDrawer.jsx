import React, { useState } from 'react'
import { Button, Text, Menu, MenuButton, MenuList, Avatar, MenuItem, MenuDivider, Drawer, useDisclosure, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Input, DrawerFooter, useToast, Spinner } from "@chakra-ui/react"
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons"
import { Box } from "@chakra-ui/layout"
import { ChatState } from '../../context/ChatContext'
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from './ChatLoading'
import UserListItem from './UserListItem'
import { getSender } from '../chatLogics/logics'


const SideDrawer = () => {
    const [search, setSearch] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [loadingChat, setLoadingChat] = useState(false)

    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef()

    const { user, chats, setChats, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const navigate = useNavigate()
    const toast = useToast()

    const logout = () => {
        localStorage.removeItem('user')
        navigate("/")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!query) {
            return
        }

        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.data?.token}`
                }
            }

            const { data } = await axios.get(`https://mern-chat-app-backend-xi.vercel.app/user/all-users?search=${search}`, config)
            setLoading(false)
            setSearchResults(data)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: 'Failed to load the search results',
                status: 'warning',
                position: 'bottom-left',
                isClosable: true,
                duration: 5000
            })
        }
    }

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true)
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user?.data?.token}`
                }
            }
            const { data } = await axios.post('https://mern-chat-app-backend-xi.vercel.app/chat/', { userId }, config)

            if (!chats.find((c) => c._id === data?._id)) setChats([data, ...chats])

            setSelectedChat(data)
            setLoadingChat(false)
            onClose()
        } catch (error) {
            console.log(error)
            toast({
                title: "Error Occured!",
                description: 'Failed to start the Chat',
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }
    }

    
    return (
        <>
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bg={'white'}
                w={'100%'}
                p={'5px 10px 5px 10px'}
                borderWidth={'5px'}
            >
                <Button ref={btnRef} onClick={onOpen}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <Text display={{ base: 'none', md: 'flex' }} px={'2'}>Start new Chat</Text>
                </Button>

                <Text fontSize={'2xl'}>WhatsApp</Text>

                <div>
                    <Menu>
                        <MenuButton p={1} position={'relative'}>
                            {notification?.length > 0 &&
                                <span style={{ position: "absolute", background: "#179848", padding: "2px", borderRadius: "100%", color: "white", top: "-1px", left: "-2px", fontSize: "13px", width: "22px" }}>
                                    {notification?.length}
                                </span>
                            }
                            <BellIcon fontSize={'2xl'} m={1} />
                        </MenuButton>
                        <MenuList pl={2} fontSize={'sm'}>
                            {!notification.length && "No New Messages"}
                            {notification?.map((noti) => (
                                <MenuItem key={noti?._id} onClick={() => {
                                    setSelectedChat(noti.chat)
                                    setNotification(notification.filter((n) => n !== noti))
                                }}>
                                    {noti?.chat?.isGroupChat
                                        ? `New Message in ${noti?.chat?.chatName}`
                                        : `New Message from ${getSender(user?.data, noti?.chat?.users)}`
                                    }
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size={'sm'}
                                cursor={'pointer'}
                                name={user?.data?.name}
                                src={user?.data?.pic}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user?.data}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>
            {/* Drawer */}
            <Drawer
                isOpen={isOpen}
                placement='left'
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader borderBottomWidth={'1px'}>
                        Search Users here....
                        <span>okokook</span>
                        </DrawerHeader>

                    <DrawerBody p={'10px'}>
                        <Input
                            placeholder='Search by Name or Email'
                            mr={2}
                            mb={2}
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {
                            loading ? (<ChatLoading />) : (
                                searchResults?.map((searchUser) => (
                                    <UserListItem
                                        key={searchUser?._id}
                                        searchUser={searchUser}
                                        handleFunction={() => accessChat(searchUser?._id)}
                                    />
                                ))
                            )
                        }
                        {loadingChat && <Spinner ml={'auto'} display={'flex'} />}
                    </DrawerBody>

                    <DrawerFooter px={1}>
                        <Button colorScheme='whatsapp' mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>

    )
}

export default SideDrawer