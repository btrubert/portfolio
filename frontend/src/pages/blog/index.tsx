import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import PostCard from 'components/blog/PostCard'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'



function Blog(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const [state, dispatchS] = useSession()
    const posts = props.posts
    const [trans, dispatch] = useTranslation()
    const t = JSON.parse(props.blogT)
    const router = useRouter()
    const [filter, setFilter] = useState<string>('')

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])
    

    if (state.loading) {
        return <></>
    } else {
        return <>
            <h2 className="text-center">Blog</h2>
            <Row className="justify-content-end">
                <Form inline className="mb-3">
                    <Form.Group>
                        <Form.Label column>{t._search_article} :</Form.Label>
                        <Form.Control type="text" placeholder={t._title} value={filter}
                        onChange={(e) => setFilter(e.currentTarget.value)}/>
                    </Form.Group>
                </Form>
            </Row>
            <Row> {posts && 
                posts.filter((p: Post) => p.title.toLowerCase().includes(filter.toLowerCase())).map((p: Post, index: number) => 
                <Col  xs={12}
                    lg={6}
                    key={index} >
                    <Link href={encodeURI(`/blog/${p.title}`)} as={encodeURI(`/blog/${p.title}`)} passHref >
                    <a className="blogCardLink">
                        <PostCard post={p}/>   
                    </a>  
                    </Link>
                </Col>)
            } </Row>
        </>
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch(process.env.SERVEUR_URL+"/smf/posts")
    let posts: Array<Category> = []
    if (response.ok) {
        posts =  await response.json()
    }
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const blogT = getTranslation('blog', locale)
    return {
        props: {posts, commonT, blogT},
        revalidate: 60,
    }
}
  

export default Blog
