import React from 'react'
import matter from 'gray-matter'

interface Props {
    content: string
}

function Layout (props: Props) {
    let data: {[key:string]: any}
    let content: string
    const month = ['jan']
    const day = ['mon']

    try {
        const post = matter(props.content)
        data = post.data
        content = post.content
    } catch (e) {
        data = {title: 'n/a', author: 'n/a'}
        content = props.content
    }
    
    return <>
    <h2>{data.title}</h2>
    <h4>{data.author}</h4>
    {content}
    </>
}

export default Layout