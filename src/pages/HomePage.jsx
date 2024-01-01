import { Box, Container, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/authentication/Login'
import SignUp from '../components/authentication/SignUp'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
  const navigate = useNavigate()

    useEffect(() => {
        const userInfo = JSON.parse(localStorage.getItem('user'))

        if (userInfo) {
            navigate("/chats")
        }
    },[navigate])
  return (
    <Container maxW='xl' centerContent>
      <Box
        display={'flex'}
        justifyContent={'center'}
        p={3}
        bg={"green"}
        w={"100%"}
        m={"40px 0 15px 0"}
        borderRadius={"lg"}
        borderWidth={"1px"}
        color={'white'}
      >
        <Text
          fontSize={'4xl'}
          fontFamily={'poppins'}
        >
          WhatsApp
        </Text>
      </Box>

      <Box
        bg={'white'}
        w={"100%"}
        p={4}
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Tabs variant='soft-rounded' colorScheme='green'>
          <TabList mb={'1em'}>
            <Tab width={"50%"}>Login</Tab>
            <Tab width={"50%"}>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}

export default HomePage