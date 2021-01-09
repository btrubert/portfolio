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
    const [titleFilter, setTitleFilter] = useState<string>('')
    const [languageFilter, setLanguageFilter] = useState<string>(router.locale ?? '')

    const capitalize = (s: string) => s.length > 1 ? s[0].toUpperCase()+s.slice(1) : s.toUpperCase()

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
        setLanguageFilter(router.locale ?? '')
    }, [router.locale])

    return <>
        <h1 className="text-center">Blog</h1>
        <Row>
            <Col>
            <Form inline className="mb-3">
                <Form.Group>
                        <Form.Label column>{t._filter_language} :</Form.Label>
                        <Form.Control as="select" value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.currentTarget.value)}
                        className="filterBlogInput custom-select-disabled-bg">
                            <option value={router.locales?.join(" + ")} className="filterBlogChoice">{router.locales?.map((l: string) => capitalize(l)).join(' + ')}</option>
                            {router.locales?.map((l: string) => <option value={l} className="filterBlogChoice">{capitalize(l)}</option>)}
                        </Form.Control>
                    </Form.Group>
                </Form>
            </Col>
            <Col>
                <Form inline className="mb-3 justify-content-end">
                    <Form.Group>
                        <Form.Label column>{t._search_article} :</Form.Label>
                        <Form.Control type="text" placeholder={t._title} value={titleFilter}
                        onChange={(e) => setTitleFilter(e.currentTarget.value)}
                        className="filterBlogInput"/>
                    </Form.Group>
                </Form>
            </Col>
        </Row>
        <Row> {posts && 
            posts.filter((p: Post) => languageFilter.includes(p.locale)).filter((p: Post) => p.title.toLowerCase().includes(titleFilter.toLowerCase())).map((p: Post, index: number) => 
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

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch(process.env.SERVEUR_URL+"/smf/posts")
    let posts: Array<Category> = []
    if (response.ok) {
        posts =  await response.json()
    }
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const blogT = getTranslation('blog', locale)
    return {
        props: {posts, commonT, blogT},
        revalidate: 60,
    }
}
  

export default Blog
