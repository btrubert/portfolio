import React, { useEffect } from 'react'
import Head from 'next/head'
import ZoomPhoto from 'components/photo/Zoom'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'


function FullResPhoto (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [state, ] = useSession()
    const [trans, dispatch] = useTranslation()
    const router = useRouter()

    const photo = props.photo

    
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
            <meta name="twitter:title" content={photo.title} />
            <meta name="twitter:description" content={photo.description} />
            <meta name="twitter:site" content="@benjamintrubert" />
            <meta name="twitter:image" content={`https://benjamintrubert.fr/uploads/${photo.path}`} />
            <meta name="twitter:creator" content="@benjamintrubert" />
            <meta name="og:title" content={photo.title} key="title"/>
            <meta name="og:description" content={photo.description} />
            <meta name="og:image" content={`https://benjamintrubert.fr/uploads/${photo.path}`} />
    </Head>

    
    if (state.loading) {
        return metaHeader
    }
    return <>
    {props.displayPhoto && 
        metaHeader}
    <ZoomPhoto photo={photo} linkHref={`/gallerie/${encodeURIComponent(photo.category.name)}?photo=${photo.id}`} linkAs={`/gallerie/${photo.category.name}?photo=${photo.id}`} />
    </>
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const response = await fetch(`${process.env.SERVEUR_URL}/smf/photo/${context.params?.id}`)
    let photo: Photo | null = null
    if (response.ok) {
        photo = await response.json()
        if (photo) {
            return {
                props: {photo, commonT},
            }
        }
    }
    return {
        props: {photo, commonT},
        redirect: { destination: "/", permanent: false }
    }
}

export default FullResPhoto
