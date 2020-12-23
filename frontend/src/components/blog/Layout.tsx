import React, { useState } from 'react'
import { useRouter } from 'next/router'
import matter from 'gray-matter'
import markdownToHtml from 'utils/mdToHtml'
import Card from 'react-bootstrap/Card'
import { timestampToStringFull } from 'utils/tsToString'

interface Props {
    content: string,
    createdAt: DateObject,
}

function Layout (props: Props) {
    let data: {[key:string]: any}
    let content: string
    const [postHtml, setPostHtml] = useState<string>('')
    const router = useRouter()

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
    
    return <div className="postLayout">
        <Card className="bg-dark text-white mb-3">
        <Card.Img className="imageHeaderBlog" src={data.cover} />
        <Card.ImgOverlay>
            <Card.Title as="h1">{data.title}</Card.Title>
            <Card.Text className="blogCardAuthor">
                {data.author}, {timestampToStringFull(props.createdAt.timestamp, router.locale)}
            </Card.Text>
            <Card.Text className="blogCardDescription">
                {data.description}
            </Card.Text>
        </Card.ImgOverlay>
        </Card>
    <div dangerouslySetInnerHTML={{ __html: postHtml }}></div>
    </div>
}

export default Layout