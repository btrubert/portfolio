import React, { useState, useEffect } from 'react'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/blog/Layout'
import Container from 'react-bootstrap/Container'
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

    
    if (state.loading) {
        return <></>
    } else {
        return <>
                <Layout content={props.post.content} createdAt={props.post.createdAt}/>
            <Row>
                {photos &&
                <h2 className="mt-5 mb-3">{trans.common._gallery}</h2>
                }
            </Row>
            <Row className="mb-5">
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
