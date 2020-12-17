import React, { useState } from 'react'
import matter from 'gray-matter'
import markdownToHtml from 'utils/mdToHtml'

interface Props {
    content: string
}

function Layout (props: Props) {
    let data: {[key:string]: any}
    let content: string
    const [postHtml, setPostHtml] = useState<string>('')

    const month = ['jan']
    const day = ['mon']

    const setContent = async (s: string) => {
        setPostHtml(await markdownToHtml(s))
    }

    try {
        const post = matter(props.content)
        data = post.data
        content = post.content
    } catch (e) {
        data = {title: 'n/a', author: 'n/a'}
        content = props.content
    }
    setContent(content)
    
    return <>
    <h2>{data.title}</h2>
    <h4>{data.author}</h4>
    <div dangerouslySetInnerHTML={{ __html: postHtml }}></div>
    </>
}

export default Layout