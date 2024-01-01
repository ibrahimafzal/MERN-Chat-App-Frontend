import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Link, Text, VStack, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [data, setData] = useState({ name: "", email: "", mobile: "", password: "", pic: "" })
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)


    const toast = useToast()
    const navigate = useNavigate()

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value })
    }

    const handleClick = () => {
        setShow(!show)
    }

    const postDetails = (pic) => {
        setLoading(true)
        if (pic === undefined) {
            toast({
                title: "Please select an image!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
        }

        if (pic.type === "image/jpeg" || pic.type === "image/png") {
            const formData = new FormData()
            formData.append('file', pic)
            formData.append('upload_preset', 'upload')
            formData.append('cloud_name', 'cloudinaryphoto')
            fetch("https://api.cloudinary.com/v1_1/cloudinaryphoto/image/upload", {
                method: 'post',
                body: formData
            })
                .then((res) => res.json())
                .then((res) => {
                    setData({ ...data, pic: res.url.toString() })
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                })
        } else {
            toast({
                title: "Please select an image!",
                status: 'warning',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })
            setLoading(false)
        }
    }

    // Sign up //
    const registerHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (!data?.name || !data?.email || !data?.password || !data?.mobile) {
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

            const response = await axios.post("http://localhost:5000/user/register", data, config)
            toast({
                title: "Registeration Successfully!",
                status: 'success',
                position: 'bottom',
                isClosable: true,
                duration: 5000
            })

            localStorage.setItem("user", JSON.stringify(response))
            setLoading(false)
            navigate("/chats")
        } catch (error) {
            console.log(error)
            toast({
                title: "Error occured, Check your Email / Mobile",
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
            {/* Full Name */}
            <FormControl id='name' isRequired>
                <FormLabel fontWeight={'semibold'}>Full Name</FormLabel>
                <Input
                    placeholder='Enter Your Full Name'
                    name='name'
                    value={data?.name}
                    type='text'
                    onChange={handleChange}
                />
            </FormControl>

            {/* Email */}
            <FormControl id='email' isRequired>
                <FormLabel fontWeight={'semibold'}>Email</FormLabel>
                <Input
                    placeholder='Enter Your Email'
                    name='email'
                    value={data?.email}
                    type='email'
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
                        value={data?.password}
                        type={show ? 'text' : 'password'}
                        onChange={handleChange}
                    />
                    <InputRightElement width={'4.5rem'}>
                        <Button h={'1.75rem'} size={'sm'} onClick={handleClick}>
                            {show ? 'Hide' : "Show"}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>

            {/* Mobile */}
            <FormControl id='mobile' isRequired>
                <FormLabel fontWeight={'semibold'}>Mobile</FormLabel>
                <Input
                    placeholder='Enter Your Mobile Number'
                    name='mobile'
                    value={data?.mobile}
                    type='tel'
                    onChange={handleChange}
                />
            </FormControl>

            {/* Upload Pic */}
            <FormControl id='pic' isRequired>
                <FormLabel fontWeight={'semibold'}>Upload your Picture</FormLabel>
                <Input
                    placeholder='Enter Your Mobile Number'
                    name='pic'
                    value={data?.pic}
                    p={1.5}
                    type='file'
                    accept='image/*'
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </FormControl>

            <Button
                colorScheme='green'
                width={'100%'}
                style={{ marginTop: 15 }}
                isLoading={loading}
                onClick={registerHandler}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp