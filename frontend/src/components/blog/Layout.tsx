import React, { useState } from 'react'
import markdownToHtml from 'utils/mdToHtml'

interface Props {
    content: string
}

function Layout (props: Props) {
    const [postHtml, setPostHtml] = useState<string>('')

    const month = ['jan']
    const day = ['mon']

    const setContent = async (s: string) => {
        setPostHtml(await markdownToHtml(s))
    }

    setContent(props.content)
    
    return <>
    <div className="postLayout" dangerouslySetInnerHTML={{ __html: postHtml }}></div>
    </>
}

export default Layout