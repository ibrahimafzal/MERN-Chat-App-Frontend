import React from 'react'
import { ChatState } from '../../context/ChatContext'
import { Avatar, Box, Text } from '@chakra-ui/react'

const UserListItem = ({ searchUser, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            cursor={'pointer'}
            _hover={{
                background: "lightgray",
            }}
            w={"100%"}
            display={'flex'}
            alignItems={'center'}
            px={3}
            mb={2}
            borderRadius={'lg'}
        >
            <Avatar
            mr={2}
            size={'md'}
            cursor={'pointer'}
            // name={searchUser.name}
            src={searchUser?.pic}
            />
            <Box>
                <Text fontWeight={'semibold'} textTransform={'capitalize'}>{searchUser?.name}</Text>
                <Text fontSize={'xs'}>{searchUser?.email}</Text>
                <Text fontSize={'xs'}>{searchUser?.mobile}</Text>
            </Box>
        </Box>
    )
}

export default UserListItem