import React from 'react';
import Strapi from 'strapi-sdk-javascript/build/main';
import {Box, Heading, Card, Image, Text, Button, Mask, Icon, IconButton} from 'gestalt';
import {calculatePrice, setCart, getCart} from "../utils/utils";
import {Link} from 'react-router-dom'
import Loader from "./Loader"
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

function Brews ({match}) {
    const brandId = match.params.brandId
    const [brand, setBrand] = React.useState('')
    const [brews, setBrews] = React.useState([])
    const [cartItems, setCartItems] = React.useState(() => getCart())
    const [loadingBrews, setLoadingBrews] = React.useState(true)
    React.useEffect(() => {
        try {
            async function callStrapiApi() {
                const response = await strapi.request('POST', '/graphql', {
                    data: {
                        query: `query {
                                    brand (id: "${brandId}"){
                                        _id
                                        name
                                        brews{
                                            _id
                                            name
                                            description
                                            image {
                                                url
                                            }
                                            price
                                        }
                                    }
                                }`
                    }
                })
                setBrews(response.data.brand.brews)
                setBrand(response.data.brand.name)
                setLoadingBrews(false)
            }

            callStrapiApi().then()
        } catch (err) {
            console.error(err)
            setLoadingBrews(false)
        }
    }, [brandId])

    const addToCart = brew => {
        const alreadyInCart = cartItems ? cartItems.findIndex(item => item._id === brew._id) : -1
        let updatedItems
        if (alreadyInCart === -1) {
            updatedItems = cartItems.concat({...brew, quantity: 1})
        } else {
            updatedItems = [...cartItems]
            updatedItems[alreadyInCart].quantity += 1
        }
        setCartItems(updatedItems)
        setCart(updatedItems)
    }

    const deleteItemFromCart = itemToDeletedId => {
        const filteredItems = cartItems.filter(item => item._id !== itemToDeletedId)
        setCartItems(filteredItems)
        setCart(filteredItems)
    }

        return (
            <Box
                marginTop={4}
                display="flex"
                justifyContent="center"
                alignItems="start"
                dangerouslySetInlineStyle={{__style: {
                    flexwrap: "wrap-reverse"
                    }}}
            >
                {/*Brews Section*/}
                <Box display="flex" direction="column" alignItems="center">
                    <Box margin={2}>
                        <Heading color="orchid">{brand}</Heading>
                    </Box>
                    <Box
                        dangerouslySetInlineStyle={{__style: {backgroundColor: '#bdcdd9'}}} wrap shape="rounded"
                        display="flex" justifyContent="center" padding={4}>
                        {brews.map(brew => (
                            <Box margin={2} width={210} key={brew._id}>
                                <Card
                                    image={
                                        <Box height={250} width={200}>
                                            <Image fit="cover" naturalHeight={1} naturalWidth={1} alt="Brand"
                                                   src={`${brew.image.url}`}/>
                                        </Box>
                                    }
                                >
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        direction="column"
                                    >
                                        <Box marginBottom={2}>
                                            <Text font-weight="bold" size="xl">{brew.name}</Text>
                                        </Box>
                                        <Text>{brew.description}</Text>
                                        <Text color="orchid">{brew.price}</Text>
                                        <Box marginTop={2}>
                                            <Text bold size="xl">
                                                <Button onClick={() => addToCart(brew)}color="blue" text="Add to cart"/>
                                            </Text>
                                        </Box>
                                    </Box>
                                </Card>
                            </Box>
                        ))}
                    </Box>
                </Box>
                <Loader show={loadingBrews} />
                {/* USer Cart */}
                <Box alignSelf="end" marginTop={2} marginLeft={8}>
                    <Mask shape="rounded" wash>
                        <Box display="flex" direction="column" alignItems="center" padding={2}>
                            {/* USer Cart Heading */}
                            <Heading align="center" size="sm">Your Cart</Heading>
                            <Text color="gray" italic>
                                {cartItems.length} items selected
                            </Text>
                             Cart Items
                            {cartItems.map(item => (
                                <Box key={item._id} display="flex" alignItems="center">
                                    <Text>
                                        {item.name} * {item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                                    </Text>
                                    <IconButton
                                        accessibilityLabel="Delete item"
                                        icon="cancel"
                                        size="sm"
                                        iconColor='red'
                                        onClick={() => deleteItemFromCart(item._id)}
                                        />
                                </Box>
                                ))}

                            <Box display="flex" direction="column" alignItems="center" justifyContent="center">
                                <Box margin={2}>
                                    {cartItems.length === 0 && (
                                        <Text color="red">Please select some items</Text>
                                        )}
                                </Box>
                                <Text size="1g">Total: {calculatePrice(cartItems)}</Text>
                                <Text>
                                    <Link to="/checkout">Checkout</Link>
                                </Text>
                                </Box>
                            </Box>

                    </Mask>
                </Box>
            </Box>
        )
}

export default Brews
