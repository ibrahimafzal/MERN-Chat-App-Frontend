import React, { useEffect, useState } from 'react'
import axios from "axios"
import { ChatState } from '../context/ChatContext'
import { Box } from '@chakra-ui/react'
import SideDrawer from '../components/others/SideDrawer'
import MyChats from '../components/others/MyChats'
import ChatBox from '../components/others/ChatBox'

const ChatPage = () => {

    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false)


    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}
            <Box
                display={'flex'}
                justifyContent={'space-between'}
                w={'100%'}
                h={'92.1vh'}
                p={'10px'}
            >
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </Box>
        </div>
    )
}

export default ChatPage