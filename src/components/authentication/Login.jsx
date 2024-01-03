import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'


const Login = () => {
  const [data, setData] = useState({ email: "", password: "" })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const toast = useToast()

  const togglePassword = () => {
    setShow(!show)
  }

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value })
  }

  const loginHandler = async (e) => {
    e.preventDefault()
    setLoading(true)
    if(!data?.email || !data?.password ) {
      toast({
          title: "Please Fill all the Fields!",
          status: 'warning',
          position: 'bottom',
          isClosable: true,
          duration: 5000
      })
      setLoading(false)
      return;
  }

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      const response = await axios.post("https://mern-chat-app-backend-xi.vercel.app/user/login", data, config)
      setLoading(false)
      toast({
        title: "Login Successfully!",
        status: 'warning',
        position: 'bottom',
        isClosable: true,
        duration: 5000
    })

      localStorage.setItem("user", JSON.stringify(response))
      navigate("/chats")

    } catch (error) {
      toast({
        title: "Something went wrong, Please try again!",
        status: 'warning',
        position: 'bottom',
        isClosable: true,
        duration: 5000
    })

    }

    setLoading(false)
  }

  return (
    <VStack spacing={'20px'}>

      {/* Email */}
      <FormControl id='email' isRequired>
        <FormLabel fontWeight={'semibold'}>Email or Mobile</FormLabel>
        <Input
          placeholder='Email or Mobile Number'
          name='email'
          type='email'
          value={data?.email}
          onChange={handleChange}
        />
      </FormControl>

      {/* Password */}
      <FormControl id='password' isRequired>
        <FormLabel fontWeight={'semibold'}>Password</FormLabel>
        <InputGroup>
          <Input
            placeholder='Enter Strong Password'
            name='password'
            type={show ? 'text' : 'password'}
            value={data?.password}
            onChange={handleChange}
          />
          <InputRightElement width={'4.5rem'}>
            <Button h={'1.75rem'} size={'sm'} onClick={togglePassword}>
              {show ? 'Hide' : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <Button
        colorScheme='green'
        width={'100%'}
        style={{ marginTop: 15 }}
        onClick={loginHandler}
        isLoading={loading}
      >
        Login
      </Button>
    </VStack>
  )
}

export default Login