import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Photo from 'components/photo/Photo'


function Photos (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [state, dispatchS] = useSession()
    const [trans, dispatch] = useTranslation()
    const router = useRouter()

    const photos = props.photos 
    const displayPhoto = typeof(router.query.photo) === 'string' && parseInt(router.query.photo) < photos.length
    const [show, setShow] = useState<boolean>(displayPhoto)
    const [currentIndex, setCurrentIndex] = useState<number>(displayPhoto ? parseInt(router.query.photo as string) : 0)

    
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
        {displayPhoto && 
            <Head>
                <meta name="twitter:card" content="summary_large_image" />
                    <meta name="twitter:title" content={`https://benjamintrubert.fr/uploads/${props.photo[parseInt(router.query.photo as string)].title}`} />
                    <meta name="twitter:site" content="@benjamintrubert" />
                    <meta name="twitter:image" content={`https://benjamintrubert.fr/uploads/${props.photo[parseInt(router.query.photo as string)].path}`}
                    />
                    <meta name="twitter:creator" content="@benjamintrubert" />
            </Head>}
                <Row> {
                    photos.map((p: Photo, index: number) => <Col className="gallery" sm={12}
                        md={6}
                        lg={4}
                        key={index}>
                        <Image className="gallery-photo" src={`/uploads/${p.path}`}
                            width="480" height="480" unoptimized
                            onClick={() => {setCurrentIndex(index); setShow(true)}} />
                    </Col>)
                } </Row>
            <Photo photos={photos} index={currentIndex} onHide={() => setShow(false)} show={show}/>
        </>
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const response = await fetch(`${process.env.SERVEUR_URL}/smf/gallery/${context.params?.category}`)
    let photos: Array<Photo> | null = null
    if (response.ok) {
        photos = await response.json()
        if (photos && photos.length > 0) {
            photos.sort((a, b) => {return (a.exifs.date > b.exifs.date) ? -1 : 1})
            return {
                props: {photos, commonT},
            }
        }
    }
    return {
        props: {photos, commonT},
        redirect: { destination: "/gallery", permanent: false }
    }
}

export default Photos
