import React from 'react'
import { Box, Text, Heading, Image, Button } from 'gestalt'
import { NavLink, withRouter } from "react-router-dom"
import DisplayStaticContent from './DisplayStaticContent'
import {getToken, clearToken, clearCart} from '../utils/utils'

const AuthNav = ({handleSignOut}) => {
    return(
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape="roundedBottom"
        >
            <NavLink activeClassName="active" to="/checkout">
                <Text size="xl" color="white">
                    Checkout
                </Text>
            </NavLink>
            <NavLink activeClassName="active" to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50}>
                        <DisplayStaticContent name="Logo"/>
                    </Box>
                    <Heading color="orange">
                        BrewHaha
                    </Heading>
                </Box>

            </NavLink>
            <Button
                onClick={handleSignOut}
                color="white"
                text="Sign Out"
                inline size="md"
            />
        </Box>
    )
}

const UnAuthNav = () => {
    return(
        <Box
            display="flex"
            alignItems="center"
            justifyContent="around"
            height={70}
            color="midnight"
            padding={1}
            shape="roundedBottom"
        >
            <NavLink activeClassName="active" to="/signin">
                <Text size="xl" color="white">
                    Sign In
                </Text>
            </NavLink>
            <NavLink activeClassName="active" to="/">
                <Box display="flex" alignItems="center">
                    <Box height={50} width={50}>
                        <DisplayStaticContent name="Logo"/>
                    </Box>
                    <Heading color="orange">
                        BrewHaha
                    </Heading>
                </Box>

            </NavLink>
            <NavLink activeClassName="active" to="/signup">
                <Text size="xl" color="white">
                    Sign Up
                </Text>
            </NavLink>
        </Box>
    )
}

const Navbar = ({history}) => {
    const handleSignOut = () => {
        // Clear token
        clearToken()
        // Clear Cart
        clearCart()
        // Redirect Home
        history.push("/")
    }

    return getToken() ? <AuthNav handleSignOut={handleSignOut}/> : <UnAuthNav/>
}

export default withRouter(Navbar);