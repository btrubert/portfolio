import React, { useState, useEffect } from 'react'
import ZoomPhoto from 'components/photo/Zoom'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'


function FullResPhotoProfile (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const router = useRouter()
    const [state, ] = useSession()
    const [trans, dispatch] = useTranslation()
    const [photo, setPhoto] = useState<Photo>()

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])

    useEffect(() => {
        if (!state.loading && state.username === '' && !props.id) {
            router.push('/')
        } else {
            fetch(`/smf/photo/${props.id}`)
                .then(response => {
                    if(response.ok) {
                        return response.json()
                } else {
                    router.push('/')
                }})
                .then(data => {
                    setPhoto(data)
                })
        }
    }, [state.username, state.loading])

    
    if (state.loading || !photo) return <></>
    return <>
    <ZoomPhoto photo={photo} linkHref={`/profile?gallerie=${encodeURIComponent(photo.category.name)}`} linkAs={`/profile?gallerie=${photo.category.name}`} />
    </>
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const id = context.params?.id
    return {
        props: {commonT, id},
    }
}


export default FullResPhotoProfile
