import React, { Component } from 'react';
import {Link} from 'react-dom'
import {Container, Box, Heading, Card, Image, Text, SearchField, Icon} from 'gestalt';
import './App.css';
import Strapi from 'strapi-sdk-javascript/build/main';
const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl);

function App () {
    const [brands, setBrands] = React.useState([])
    const [searchTerm, setSearchTerm] = React.useState('')
    React.useEffect(() => {
        try {
            async function callStrapiApi () {
                const response = await strapi.request('POST', '/graphql', {
                    data: {
                        query: `query {
                              brands{
                                _id
                                name
                                Description
                                createdAt
                                Image {
                                  name
                                  url
                                }
                              }
                            }`
                    }
                })
                setBrands(response.data.brands)
            }
            callStrapiApi().then()
        } catch (err) {
            console.error(err)
        }

    }, [])


    const handleChange = (event) => {
        setSearchTerm(event.value)
    }

    const filteredBrands = ({ searchTerm, brands }) => {
        return brands.filter(brand => {
            return brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                brand.Description.toLowerCase().includes(searchTerm.toLowerCase())
        })
    }

    return (
     <Container>
         {/* Brands Search Field */}
         <Box display="flex" justifyContent="center" marginTop={4}>
             <SearchField accessibilityLabel="Brands Search Field" id="searchField" onChange={handleChange} placeholder="Search Brands" value={searchTerm}/>
             <Box margin={3}>
                 <Icon
                    icon="filter"
                    color={searchTerm ? 'orange' : 'gray'}
                    size={20}
                    accessibilityLabel="Filter"
                 />
             </Box>
         </Box>
       {/* Brands Section */}
       <Box
         display="flex"
         justifyContent="center"
         marginBottom={2}
       >
           {/* Brands Header */}
           <Heading color="midnight" size="md">
               Brew Brands
           </Heading>
       </Box>
         {/* Brands */}
         <Box
            dangerouslySetInlineStyle={{__style: {backgroundColor: "#d6c8ec"}}}
             shape="rounded" wrap display="flex" justifyContent="around">
             {filteredBrands({searchTerm, brands}).map(brand => (
                 <Box margin={2} width={200} key={brand._id}>
                     <Card
                         image={
                             <Box height={200} width={200}>
                                <Image fit="cover" naturalHeight={1} naturalWidth={1} alt="Brand" src={`${apiUrl}${brand.Image.url}`}/>
                             </Box>
                         }
                     >
                         <Box
                             display="flex"
                             alignItems="center"
                             justifyContent="center"
                             direction="column"
                             >
                             <Text bold size="xl">{brand.name}</Text>
                             <Text >{brand.Description}</Text>
                             <Text bold size="xl">
                                 {/*<Link to={`/${brand._id}`}>See Brews</Link>*/}
                             </Text>
                         </Box>
                     </Card>
                 </Box>
             ))}
         </Box>
     </Container>
    )
}

export default App;
