import { createContext, useContext, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const ChatContext = createContext()

const ChatProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [chats, setChats] = useState([])
    const [selectedChat, setSelectedChat] = useState([])
    const [notification, setNotification] = useState([])



    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'))
        setUser(userInfo)

        if (!userInfo) {
            <Navigate to={'/'} replace={true} />
        }
    }, [])

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                chats,
                setChats,
                selectedChat,
                setSelectedChat,
                notification,
                setNotification,
            }}
        >
            {children}
        </ChatContext.Provider>
    )
}


export const ChatState = () => {
    return useContext(ChatContext)
}


export default ChatProvider