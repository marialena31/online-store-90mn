import React from 'react'
import {Box} from 'gestalt';
import { RingLoader } from 'react-spinners'

const Loader = ({show}) => (
    show && <Box
    position="fixed"
    dangerouslySetInlineStyle={{__style: {
        bottom: 400,
        left: '50%',
        transform: "translate("-50%")"
        }}}
    >
        <RingLoader color="darkorange" size={200} />
    </Box>
)

export default Loader