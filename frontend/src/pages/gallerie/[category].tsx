import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
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
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'


function Photos (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [state, ] = useSession()
    const [trans, dispatch] = useTranslation()
    const router = useRouter()

    const photos = props.photos 
    const [show, setShow] = useState<boolean>(props.displayPhoto)
    const [currentIndex, setCurrentIndex] = useState<number>(props.indexPhoto)

    
    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
      }, [router.locale])

      const metaHeader = <Head>
            <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={photos[props.indexPhoto].title} />
                <meta name="twitter:description" content={photos[props.indexPhoto].description} />
                <meta name="twitter:site" content="@benjamintrubert" />
                <meta name="twitter:image" content={`https://benjamintrubert.fr/uploads/${photos[props.indexPhoto].path}`} />
                <meta name="twitter:creator" content="@benjamintrubert" />
                <meta name="og:title" content={photos[props.indexPhoto].title} key="title"/>
                <meta name="og:description" content={photos[props.indexPhoto].description} />
                <meta name="og:image" content={`https://benjamintrubert.fr/uploads/${photos[props.indexPhoto].path}`} />
        </Head>
    
    if (state.loading) {
        return metaHeader
    }
    return <>
    {props.displayPhoto && 
        metaHeader}
        <h1 className="text-center">{router.query.category}</h1>
        <Row>
            <Col>
                <Link href="/gallerie" passHref>
                    <div className="mb-2 iconCursor" >
                        <Icon path={mdiArrowLeft} color="black" size={1} />{trans.common._gallery}
                    </div>
                </Link>
            </Col>
        </Row>
        <Row> {
            photos.map((p: Photo, index: number) => <Col className="gallery" sm={12}
                md={6}
                lg={4}
                key={index}>
                <Image className="gallery-photo" src={`/uploads/${p.path}`}
                    width="480" height="480" unoptimized alt={p.title}
                    onClick={() => {setCurrentIndex(index); setShow(true); router.replace({pathname: router.pathname, query: {category: router.query.category, photo: photos[index].id}}, `/gallerie/${router.query.category}?photo=${photos[index].id}`, {shallow: true})}} />
            </Col>)
        } </Row>
        <Photo photos={photos} index={currentIndex} onHide={() => {setShow(false); router.replace({pathname: router.pathname, query: {category: router.query.category}}, `/gallerie/${router.query.category}`, {shallow: true})}} show={show} gallery={true}/>
    </>
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const response = await fetch(`${process.env.SERVEUR_URL}/smf/gallery/${context.params?.category}`)
    let photos: Array<Photo> | null = null
    if (response.ok) {
        photos = await response.json()
        if (photos && photos.length > 0) {
            photos.sort((a, b) => {return (a.exifs.date > b.exifs.date) ? -1 : 1})
            const displayPhoto = typeof(context.query.photo) === 'string'
            let indexPhoto: number = 0
            if (displayPhoto) {
                const index = parseInt(context.query.photo as string)
                for (let i = 0; i < photos.length; i++) {
                    if (photos[i].id === index) {
                        indexPhoto = i
                    }
                }
            }
            return {
                props: {photos, commonT, displayPhoto, indexPhoto},
            }
        }
    }
    return {
        props: {photos, commonT},
        redirect: { destination: "/gallerie", permanent: false }
    }
}

export default Photos
