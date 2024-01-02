import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import axios from 'axios'
import { Avatar, Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from "@chakra-ui/icons"
import ChatLoading from "./ChatLoading"
import GroupChatModal from './GroupChatModal'
import { getSender, getOtherUserImage } from '../chatLogics/logics'
import ConfirmationModal from './ConfirmationModal'

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()

  const toast = useToast()

  const truncateText = (text, maxLength) => {
    if (text?.length > maxLength) {
      return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${user?.data?.token}`
        }
      }
      const { data } = await axios.get("https://mern-chat-app-backend-iota.vercel.app/http://localhost:5000/chat/", config)
      setChats(data)
    } catch (error) {
      console.log(error)
      toast({
        title: "Error Occured!",
        description: 'Failed to load the Chats',
        status: 'warning',
        position: 'bottom',
        isClosable: true,
        duration: 5000
      })
    }
  }

  const deleteChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${user?.data?.token}`
        }
      }
      await axios.delete(`http://localhost:5000/chat/deleteChat/${chatId}`, config)
      setSelectedChat([])
    } catch (error) {
      toast({
        title: "Ooopss... Chat not found!",
        status: 'warning',
        position: 'bottom',
        isClosable: true,
        duration: 5000
      })
    }
  }

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('user'))
    setLoggedUser(userInfo.data)
    fetchChats()
  }, [fetchAgain])


  return (
    <Box
      display={{ base: Object.keys(selectedChat).length > 0 ? 'none' : 'flex', md: 'flex' }}
      flexDir={'column'}
      alignItems={'center'}
      py={3}
      bg={'white'}
      w={{ base: "100%", md: '40%' }}
      borderRadius={'lg'}
      borderWidth={'1px'}
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: '19px', md: "22px" }}
        fontFamily={'Poppins'}
        display={'flex'}
        w={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        My Chats
        <GroupChatModal>
          <Button
            display={'flex'}
            fontSize={{ base: '13px', md: '13px', lg: '13px' }}
            rightIcon={<AddIcon mr={'0px'} />}
          >
            New Group
          </Button>
        </GroupChatModal>
      </Box>

      <Box
        display={'flex'}
        flexDir={'column'}
        py={3}
        bg={'#F8F8F8'}
        w={'100%'}
        h={'100%'}
        borderRadius={'lg'}
        overflowY={'hidden'}
      >
        {chats ? (
          <Stack overflowY={'scroll'}>
            {
              chats?.map((chat) => (
                <Box
                  cursor={'pointer'}
                  bg={selectedChat === chat ? "#ced4da" : ""}
                  px={3}
                  display={'flex'}
                  alignItems={'center'}
                  gap={'10px'}
                  py={2}
                  borderRadius={'lf'}
                  key={chat?._id}
                >
                  <Avatar src={getOtherUserImage(chat, user?.data)} />
                  <Box
                    onClick={() => setSelectedChat(chat)}
                    width={'100%'}
                  >

                    <Text textTransform={'capitalize'} fontWeight={'semibold'}>
                      {
                        !chat?.isGroupChat ?
                          (
                            getSender(loggedUser, chat?.users)
                          ) :
                          chat.chatName
                      }
                    </Text>
                    <Text fontSize={'sm'} color={'#495057'}>
                      {truncateText((chat?.latestMessage && chat?.latestMessage?.content), 29)}
                    </Text>
                  </Box>

                  <ConfirmationModal deleteChat={deleteChat} chat={chat} fetchChats={fetchChats}>
                    <DeleteIcon
                      color={'darkgray'}
                      _hover={{ color: 'red' }}
                      _focus={{ color: 'red' }}
                    />
                  </ConfirmationModal>

                </Box>
              ))
            }
          </Stack>
        ) : (
          <ChatLoading />
        )
        }
      </Box>
    </Box>
  )
}

export default MyChats