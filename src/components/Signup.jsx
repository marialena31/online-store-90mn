import React from 'react'
import {Container, Box, Button, Heading, Text, TextField} from "gestalt";
import {getToken, setToken} from "../utils/utils";
import ToastMessage from "./ToastMessage";
import Strapi from "strapi-sdk-javascript/build/main";
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

const Signup = ({history}) => {
    const [username, setUsername] = React.useState('')
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [toast, setToast] = React.useState(false)
    const [toastMessage, setToastMessage] = React.useState('')
    const [loading, setLoading] = React.useState(false)
    const [token, setToken] = React.useState(() => getToken())

    const handleChange = ({event, value}) => {
        const targetId = event.target.getAttribute('id')
        event.persist()
        switch (targetId) {
            case 'username': setUsername(value)
                            break;
            case 'password': setPassword(value)
                            break;
            case 'email' : setEmail(value)
                            break;
        }
    }

    const isFormEmpty = (username,email,password) => {
        return !username || !email || !password
    }

    const redirectUser = path => {
        history.push(path)
    }

    const showToast = toastMessage => {
        setToast(true)
        setToastMessage(toastMessage)
        setTimeout(() => {
            setToast(false)
            setToastMessage('false')
        }, 5000)
    }

    const handleSubmit =  event => {
        event.preventDefault()
        if (isFormEmpty(username, email, password)) {
            showToast('Fill in all fields')
            return
        }
        // Sign up user
        async function createUser()  {
            try {
                // set loading true
                setLoading(true)
                // make request to register user with strapi
                const response = await strapi.register(username, email, password)
                console.log(response)
                // set loading false
                setLoading(false)
                // put token (to manage user session) in locale storage
                setToken(response.jwt)
            } catch (err) {
                // set loading false
                setLoading(false)
                // show error message with toast message
                showToast(err.message)
            }
        }
        createUser().then()
        redirectUser("/")
    }

    return(
        <Container>
            <Box dangerouslySetInlineStyle={{__style: {
                backgroundColor: '#ebe2da'
                }}}
                 margin={5}
                 padding={4}
                 shape="rounded"
                 display="flex"
                 justifyContent="center"
                 >
                {/*Sign Up Form*/}
                <form style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    maxWidth: 450
                    }}
                    onSubmit={handleSubmit}
                >
                    <Box
                        marginBottom={2}
                        display="flex"
                        direction="column"
                        alignItems="center"
                        >
                        <Heading color="midnight">Let's Get Started</Heading>
                        <Text italic color="orchid">Sign up to order some brews !</Text>
                    </Box>
                    {/* Username input */}
                    <TextField
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Username"
                        onChange={handleChange}
                    />
                    <TextField
                        id="email"
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        onChange={handleChange}
                    />
                    <TextField
                        id="password"
                        type="password"
                        name="password"
                        placeholder="password"
                        onChange={handleChange}
                    />
                    <Button inline disabled={loading} typecolor="blue"
                            text="submit"
                            type="submit"
                    />
                </form>
            </Box>
            <ToastMessage show={toast} message={toastMessage}/>
        </Container>
    )
}

export default Signup;