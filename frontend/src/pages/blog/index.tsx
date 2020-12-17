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



function Blog(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const [state, dispatchS] = useSession()
    const posts = props.posts
    const [trans, dispatch] = useTranslation()
    const router = useRouter()

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
            <Row> {
                posts.map((p: Post, index: number) => 
                <Col  xs={12}
                    lg={6}
                    key={index} >
                    <Link href={`/blog/${p.title}`} as={`/blog/${p.title}`} passHref >
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
    return {
        props: {posts, commonT},
        revalidate: 60,
    }
}
  

export default Blog
