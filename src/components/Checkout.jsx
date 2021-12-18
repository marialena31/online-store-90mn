import React from 'react'
import {Container, Box, Button, Heading, Text, TextField, Modal, Spinner} from "gestalt";
import {calculatePrice, getCart} from "../utils/utils";
import ToastMessage from "./ToastMessage";

const Checkout = ({history}) => {
    const [address, setAddress] = React.useState('')
    const [postalCode, setPostalCode] = React.useState('')
    const [city, setCity] = React.useState('')
    const [confirmationEmailAddress, setConfirmationEmailAddress] = React.useState(false)
    const [toastMessage, setToastMessage] = React.useState('')
    const [toast, setToast] = React.useState(false)
    const [cartItems, setCartItems] = React.useState(() => getCart())
    const [orderProcessing, setOrderProcessing] = React.useState(false)
    const [modal, setModal] = React.useState(false)


    const handleChange = ({event, value}) => {
        const targetId = event.target.getAttribute('id')
        event.persist()
        switch (targetId) {
            case 'address': setAddress(value)
                break;
            case 'postalCode': setPostalCode(value)
                break;
            case 'city' : setCity(value)
                break;
            case 'confirmationEmailAddress' : setConfirmationEmailAddress(value)
                break;
        }
    }

    const isFormEmpty = (address,postalCode,city, confirmationEmailAddress) => {
        return !address || !postalCode || !city || !confirmationEmailAddress
    }

    const showToast = toastMessage => {
        setToast(true)
        setToastMessage(toastMessage)
        setTimeout(() => {
            setToast(false)
            setToastMessage('false')
        }, 5000)
    }

    const handleSubmitOrder = () => {
        setModal(false)
    }

    const closeModal = () => {
        setModal(false)
    }

    const ConfirmationModal = ({ orderProcessing, cartItems, closeModal}) => (
        <Modal
        accessibilityModalLabel="Confirm Your Order"
        accessibilityCloseLabel="close"
        heading="Confirm Your Order"
        onDismiss={closeModal}
        footer={
            <Box display="flex" marginRight={-1} marginLeft={-1} justifyContent="center">
                <Box padding={1}>
                    <Button
                        size="lg"
                        color="red"
                        text="Submit"
                        disabled={orderProcessing}
                        onClick={handleSubmitOrder}
                    />
                </Box>
                <Box padding={1}>
                    <Button
                        size="lg"
                        text="Cancel"
                        disabled={orderProcessing}
                        onClick={closeModal}
                    />
                </Box>
            </Box>
        }
        role="alertdialog"
        size="sm"
        >
            {!orderProcessing && (
                <Box display="flex" justifyContent="center" alignItems="center" direction="column" padding={2} color="lightWash">
                    {cartItems.map(item => (
                        <Box key={item._id} padding={1}>
                            <Text size="lg" color="red">
                                {item.name} * {item.quantity} - ${item.quantity * item.price}
                            </Text>
                        </Box>
                    ))}
                    <Box paddingY={2}>
                        <Text size="lg" bold>
                            Total: {calculatePrice(cartItems)}
                        </Text>
                    </Box>
                </Box>
            )}
            <Spinner show={orderProcessing} accessibilityLabel="Order Processing Spinner"/>
            {orderProcessing && <Text align="center" italic>Submitting Order...</Text> }
        </Modal>
    )

    const handleConfirmOrder =  event => {
        event.preventDefault()
        if (isFormEmpty(address, postalCode, city,confirmationEmailAddress )) {
            showToast('Fill in all fields')
            return
        }

        setModal(true)
    }

    return(
        <Container>
            <Box
                color="darkWash"
                 margin={5}
                 padding={4}
                 shape="rounded"
                 display="flex"
                 justifyContent="center"
                alignItems="center"
                direction="column"
            >
                {/*Checkout Form
                */}
                <Heading color="midnight">Checkout</Heading>
                {(cartItems.length > 0) ? <React.Fragment>
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    marginTop={2}
                    marginBottom={6}
                >
                    <Text color="darkGrey" italic>{cartItems.length} Items for Checkout</Text>
                    <Box padding={2}>
                        {cartItems.map(item => (
                            <Box key={item._id} padding={1}>
                                <Text color="midnight">
                                    {item.name} * {item.quantity} - ${item.quantity * item.price}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                    <Text bold>Total Amount: {calculatePrice(cartItems)}</Text>
                </Box>
                <form style={{
                    display: 'inline-block',
                    textAlign: 'center',
                    maxWidth: 450
                }}
                      onSubmit={handleConfirmOrder}
                >
                    {/* Address input */}
                    <TextField
                        id="address"
                        type="text"
                        name="address"
                        placeholder="Shipping Address"
                        onChange={handleChange}
                    />
                    <TextField
                        id="postalCode"
                        type="number"
                        name="postalCode"
                        placeholder="Postal code"
                        onChange={handleChange}
                    />
                    <TextField
                        id="city"
                        type="text"
                        name="city"
                        placeholder="City od Residence"
                        onChange={handleChange}
                    />
                    <TextField
                        id="confirmationEmailAddress"
                        type="email"
                        name="confirmationEmailAddress"
                        placeholder="Confirmation Email Address"
                        onChange={handleChange}
                    />
                    <Button id="stripe__button" type="submit">Submit</Button>
                </form>
                </React.Fragment> : (
                    // default text if nbno items in cart
                    <Box color="darkWash" shape="rounded" padding={4}>
                        <Heading align="center" color="watermelon" size="xs">
                            Your cart is Empty
                        </Heading>
                        <Text align="center" italic color="green">
                            Add some brews!
                        </Text>
                    </Box>
                    )}
                </Box>
            {modal && (
                <ConfirmationModal orderProcessing={orderProcessing} cartItems={cartItems} closeModal={closeModal} handleSubmitOrder={handleSubmitOrder}/>
            )}
            <ToastMessage show={toast} message={toastMessage}/>
        </Container>
    )
}

export default Checkout;