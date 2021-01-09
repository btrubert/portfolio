import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import Editor from 'components/blog/Editor'
 
function PostEditor (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [trans, dispatch] = useTranslation()
    const [state, dispatchS] = useSession()
    const [post, setPost] = useState<Post>()
    const [token, setToken] = useState<string>('')
    const [addedPhoto, setAddedPhoto] = useState<boolean>(false)
    const [photos, setPhotos] = useState<Array<Photo> | null>(null)
    const router = useRouter()
    const t = JSON.parse(props.blogT)

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])

    useEffect(() => {
        if (!state.loading && !state.admin) {
            router.push('/')
        }
    }, [state.admin, state.loading])

    const fetchContent = async (id: string) => {
        const response = await fetch("/smf/admin/blog/edit/" + id)
        const data = await response.json()
        if (data.content) {
            setPost(data.content)
            setToken(data.token)
            setAddedPhoto(!addedPhoto)
        } else {
            router.push('/')
        }
    }

    useEffect(() => {
        if (typeof(props.id) === 'string'){
            fetchContent(props.id)
        } else {
            router.push('/')
        }
    }, [])

    const fectchImages = async () => {
        if (post?.category) {
            const response = await fetch("/smf/gallery/" + post.category.name)
            const data = await response.json()
            setPhotos(data)
        }
    }

    useEffect(() => {
        fectchImages()
    }, [addedPhoto])

    if (state.loading || !state.admin || !post) {
        return <></>
    } else {
        return <Editor translation={t}
                formTrans={props.dashboardT}
                post={post}
                token={token}
                updatePhotos={() => setAddedPhoto(!addedPhoto)}
                photos={photos}/>
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const blogT = getTranslation('blog', locale)
    const dashboardT = getTranslation('dashboard', locale)
    const id = context.params?.slug
    return {
        props: {commonT, blogT, dashboardT, id},
    }
}

export default PostEditor