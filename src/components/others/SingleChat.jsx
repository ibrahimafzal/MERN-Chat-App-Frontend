import React, { useEffect, useState } from 'react'
import { ChatState } from '../../context/ChatContext'
import { Avatar, Box, FormControl, IconButton, Input, InputGroup, Spinner, useToast } from '@chakra-ui/react'
import WelcomePage from './WelcomePage'
import { ArrowBackIcon, ArrowRightIcon } from "@chakra-ui/icons"
import ProfileModal from "./ProfileModal"
import UpdateGroupChatModal from './UpdateGroupChatModal'
import BG from "../../images/bg.jpg"
import axios from 'axios'
import '../styles.css'
import ScrollableChat from './ScrollableChat'
import { getOtherUserImage, getSender, getSenderFull } from '../chatLogics/logics'
import io from "socket.io-client"
import notificationSound from "../../images/iphone_messages.mp3"


const ENDPOINT = "https://mern-chat-app-backend-xi.vercel.app"
var socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {

    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState('')
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [playRingtone, setPlayRingtone] = useState(false);


    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const toast = useToast()

    useEffect(() => {
        socket = io()
        socket.emit("setup", user?.data)
        socket.on("connected", () => setSocketConnected(true))
        socket.on("typing", () => setIsTyping(true))
        socket.on("stop typing", () => setIsTyping(false))

    }, [])

    // Fetch Messages
    const fetchMessages = async () => {
        if (!Object.keys(selectedChat).length) return

        try {
            const config = {
                headers: {
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            setLoading(true)
            const { data } = await axios.get(`https://mern-chat-app-backend-xi.vercel.app/message/${selectedChat?._id}`, config)
            setMessages(data)
            setLoading(false)
            socket.emit("join chat", selectedChat?._id)
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: 'Failed to load the Messages',
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }
    }

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on("message recieved", (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare?._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setPlayRingtone(true)
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    useEffect(() => {
        if (playRingtone) {
            const audio = new Audio(notificationSound);
            audio.play();

            // After playing the audio, set playRingtone back to false
            audio.addEventListener('ended', () => {
                setPlayRingtone(false);
            });

            return () => {
                audio.pause(); // Pause the audio when the component unmounts
            };
        }
    }, [playRingtone]);

    // Send a Message
    const PressEntersendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            socket.emit("stop typing", selectedChat?._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${user?.data?.token}`
                    }
                }

                setNewMessage("")
                const { data } = await axios.post("https://mern-chat-app-backend-xi.vercel.app/message", {
                    content: newMessage,
                    chatId: selectedChat?._id
                }, config)

                socket.emit("new message", data)
                setMessages([...messages, data])
            } catch (error) {
                toast({
                    title: "Error Occured!",
                    description: 'Failed to send the Message',
                    status: 'warning',
                    position: 'bottom',
                    isClosable: true,
                    duration: 5000
                })
            }
        }
    }

    const sendMessage = async () => {
        socket.emit("stop typing", selectedChat?._id)
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user?.data?.token}`
                }
            }

            setNewMessage("")
            const { data } = await axios.post("https://mern-chat-app-backend-xi.vercel.app/message", {
                content: newMessage,
                chatId: selectedChat?._id
            }, config)

            socket.emit("new message", data)
            setMessages([...messages, data])
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: 'Failed to send the Message',
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }

    }


    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        // Typing Indicator logic
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true)
            socket.emit("typing", selectedChat?._id)
        }

        let lastTypingTime = new Date().getTime()
        var timerLength = 3000
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDifference = timeNow - lastTypingTime

            if (timeDifference >= timerLength && typing) {
                socket.emit("stop typing", selectedChat?._id)
                setTyping(false)
            }
        }, timerLength)
    }


    return (
        <>
            {
                Object.keys(selectedChat).length > 0 ? (
                    <>
                        <Box
                            fontSize={"20px"}
                            py={2}
                            px={2}
                            w={'100%'}
                            fontFamily={'Poppins'}
                            display={'flex'}
                            justifyContent={{ base: "space-between" }}
                            alignItems={'center'}
                            bg='#179848'
                            color={'white'}
                        >
                            {/* 1 */}


                            {
                                !selectedChat?.isGroupChat ? (
                                    <>
                                        <div style={{ textTransform: 'capitalize', display: 'flex', alignItems: 'center', fontSize: '20px', fontWeight: "500" }}>
                                            <IconButton
                                                display={{ base: 'flex', md: 'none' }}
                                                bg={'none'}
                                                color={'white'}
                                                _hover={{ background: 'none' }}
                                                fontSize={'25px'}
                                                icon={<ArrowBackIcon />}
                                                onClick={() => setSelectedChat("")}
                                            />
                                            <Avatar
                                                marginRight={"10px"}
                                                size={'sm'}
                                                src={getOtherUserImage(selectedChat, user?.data)}
                                            />
                                            <div style={{ display: "flex", flexDirection: "column" }}>

                                                {getSender(user?.data, selectedChat?.users)}

                                                {isTyping ? (
                                                    <span>
                                                        <span style={{ fontSize: "10px", display: "flex" }}>typing...</span>
                                                    </span>
                                                ) : (<></>)
                                                }
                                            </div>
                                        </div>

                                        <ProfileModal user={getSenderFull(user?.data, selectedChat?.users)} />
                                    </>
                                ) : (
                                    <>
                                        <Box textTransform={'capitalize'} display={'flex'} alignItems={"center"}>
                                        <IconButton
                                                display={{ base: 'flex', md: 'none' }}
                                                bg={'none'}
                                                color={'white'}
                                                _hover={{ background: 'none' }}
                                                fontSize={'25px'}
                                                icon={<ArrowBackIcon />}
                                                onClick={() => setSelectedChat("")}
                                            />
                                            <Avatar
                                                marginRight={"10px"}
                                                size={'sm'}
                                                src={getOtherUserImage(selectedChat, user?.data)}
                                            />
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                {selectedChat?.chatName}
                                                {isTyping ? (
                                                    <span>
                                                        <span style={{ fontSize: "10px", display: "flex" }}>typing...</span>
                                                    </span>
                                                ) : (<></>)
                                            }
                                            </div>
                                        </Box>
                                        <UpdateGroupChatModal
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                            fetchMessages={fetchMessages}
                                        />
                                    </>
                                )
                            }
                        </Box>

                        <Box
                            display={'flex'}
                            flexDir={'column'}
                            justifyContent={'flex-end'}
                            py={3}
                            px={1}
                            bg={'white'}
                            w={'100%'}
                            h={'100%'}
                            overflowY={'hidden'}
                            backgroundImage={BG}
                            backgroundSize={'cover'}
                            backgroundPosition={'contain'}
                        >
                            {
                                loading ? (
                                    <Spinner
                                        size={'xl'}
                                        w={20}
                                        h={20}
                                        alignSelf={'center'}
                                        margin={'auto'}
                                        color='#179848'
                                    />
                                ) : (
                                    <div className='messages'>
                                        <ScrollableChat messages={messages} fetchMessages={fetchMessages} />
                                    </div>
                                )
                            }

                            <FormControl
                                onKeyDown={PressEntersendMessage}
                                isRequired
                                mt={3}
                            >
                                <InputGroup gap={''}>
                                    <Input
                                        placeholder='Message'
                                        variant={'filled'}
                                        bg={'#E0E0E0'}
                                        onChange={typingHandler}
                                        value={newMessage}
                                        fontSize={'14px'}
                                    />
                                    <IconButton variant={'filled'} onClick={sendMessage}>
                                        <ArrowRightIcon fontSize={'25px'} color={'#179848'} />
                                    </IconButton>
                                </InputGroup>
                            </FormControl>
                        </Box>
                    </>
                ) : (
                    <WelcomePage />
                )
            }
        </>
    )
}

export default SingleChat