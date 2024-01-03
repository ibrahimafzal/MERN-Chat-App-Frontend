import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { ChatState } from '../../context/ChatContext'
import { Avatar, Box, IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip, useToast } from '@chakra-ui/react'
import { capitalizeSentences, copyToClipboard, formatTime, isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../chatLogics/logics'
import { ChevronDownIcon } from '@chakra-ui/icons'
import axios from 'axios'

const ScrollableChat = ({ messages, fetchMessages }) => {

    const { user } = ChatState()

    const toast = useToast()


    const deleteMessage = async (id) => {
        try {
            const config = {
                headers: {
                    'Authorization': `Bearer ${user?.data?.token}`
                }
            }
            await axios.delete(`https://mern-chat-app-backend-xi.vercel.app/message/deleteMessage/${id}`, config)
            fetchMessages()
        } catch (error) {
            console.log(error)
        }
    }


    return (
        <ScrollableFeed>
            {messages && messages?.map((m, i) => (
                <div key={i} style={{ display: "flex" }}>
                    {(isSameSender(messages, m, i, user?.data?._id)
                        || isLastMessage(messages, i, user?.data?._id)
                    ) && (
                            <Tooltip
                                label={m?.sender?.name}
                                placement='bottom-start'
                                hasArrow
                                textTransform={'capitalize'}
                            >
                                <Avatar
                                    mt={'7px'}
                                    mr={1}
                                    size={'sm'}
                                    cursor={'pointer'}
                                    name={m?.sender?.name}
                                    src={m?.sender?.pic}
                                />
                            </Tooltip>
                        )}

                    <div style={{
                        backgroundColor: `${m?.sender?._id === user?.data?._id ? "#D9FDD3" : "white"}`,
                        borderRadius: "5px",
                        padding: "4px 9px",
                        minWidth: "25%",
                        maxWidth: "77%",
                        display: 'flex',
                        flexDirection: 'column',
                        fontSize: "13px",
                        marginLeft: isSameSenderMargin(messages, m, i, user?.data?._id),
                        marginTop: isSameUser(messages, m, i, user?.data?._id) ? 3 : 10
                    }}
                    >
                        <Box display="flex" justifyContent="space-between">
                            <span id='copyText'>
                                {capitalizeSentences(m?.content)}
                            </span>
                            <Menu style>
                                <MenuButton as={IconButton} icon={<ChevronDownIcon color={'darkgray'} />} variant="filled" fontSize={'20px'} minWidth={0} height={"18px"} marginLeft={'25px'} />
                                <MenuList minWidth={'0px'}>
                                    <MenuItem onClick={() => {
                                        copyToClipboard(m?._id, m?.content)
                                        toast({
                                            title: "Text copied to clipboard!",
                                            status: 'success',
                                            position: 'bottom',
                                            isClosable: true,
                                            duration: 1000
                                        })
                                    }}
                                    >Copy</MenuItem>
                                    <MenuItem onClick={() => deleteMessage(m?._id)}>Delete</MenuItem>

                                </MenuList>
                            </Menu>
                        </Box>
                        <p style={{ fontSize: "10px", color: "#495057", textAlign: "end", marginLeft: "30px" }}>
                            {m?.createdAt ? formatTime(m?.createdAt) : ""}
                        </p>
                    </div>
                </div>
            ))}
        </ScrollableFeed>
    )
}

export default ScrollableChat


// dele message, show notification on avatar. show lastseen and online. deploy