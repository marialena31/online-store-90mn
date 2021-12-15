import Strapi from "strapi-sdk-javascript";
import React from "react";
import {Image} from "gestalt";
const apiUrl =/* process.env.REACT_APP_API_URL ||*/ 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

function DisplayStaticContent ({name}) {
    const [url, setUrl] = React.useState('')
    React.useEffect(() => {

        try {
            async function callStrapiApi() {
                const response = await strapi.request('POST', '/graphql', {
                    data: {
                        query: `query {
                                  staticContents(where: {
                                    Title: ["${name}"]}) {
                                    _id
                                    Image {
                                      name
                                      url
                                    }
                                  }
                                }`
                    }
                })
                console.log(response.data.staticContents[0].Image.url)
                setUrl(response.data.staticContents[0].Image.url)
            }

            callStrapiApi().then()
        } catch (err) {
            console.error(err)
        }
    }, [name, url])

    return (
        <Image
            src={url}
            alt={`${name} Logo`}
            naturalHeight={1}
            naturalWidth={1}
        />
    )
}
export default DisplayStaticContent