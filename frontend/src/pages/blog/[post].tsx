import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/blog/Layout'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'next/image'
import Photo from 'components/photo/Photo'


function Post (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [state, dispatchS] = useSession()
    const [trans, dispatch] = useTranslation()
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState<number>(0)
    const [show, setShow] = useState<boolean>(false)
    const photos = props.post.category.photos? props.post.category.photos.sort((p1: Photo, p2: Photo) => p1.exifs.date < p2.exifs.date) : null

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
      }, [router.locale])

    
    const headerMeta = <Head>
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={props.post.title} />
                <meta name="twitter:description" content={props.post.description} />
                <meta name="twitter:site" content="@benjamintrubert" />
                <meta name="twitter:image" content={`https://benjamintrubert.fr/${props.post.cover}`} />
                <meta name="twitter:creator" content="@benjamintrubert" />
                <meta name="og:title" content={props.post.title} />
                <meta name="og:description" content={props.post.description} />
                <meta name="og:image" content={`https://benjamintrubert.fr/${props.post.cover}`} />
            </Head>

    if (state.loading) {
        return headerMeta
    } else {
        return <>
            {headerMeta}
            <Layout content={props.post.content} createdAt={props.post.createdAt}/>
            <Row>
                {photos.length > 0 &&
                <h2 className="mt-5 mb-3">{trans.common._gallery}</h2>
                }
            </Row>
            <Row>
                {photos &&
                photos.map((p: Photo, index: number) => 
                    <Col xs={6} sm={4} md={3} key={index}>
                        <Image className="gallery-photo" src={`/uploads/${p.path}`}
                            width="480" height="480" unoptimized
                            onClick={() => {setCurrentIndex(index); setShow(true)}} />
                    </Col>
                )}
            </Row>
            <Photo photos={photos} index={currentIndex} onHide={() => setShow(false)} show={show}/>
            </>
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    let post: Post | null = null
    if (typeof(context.params?.post) === 'string') {
        const response = await fetch(`${process.env.SERVEUR_URL}/smf/post/${encodeURI(context.params.post)}`)
        if (response.ok) {
            post = await response.json()
            return {
                props: {post, commonT},
            }
        }
    }
    return {
        props: {post, commonT},
        redirect: { destination: "/blog", permanent: false }
    }
}

export default Post
