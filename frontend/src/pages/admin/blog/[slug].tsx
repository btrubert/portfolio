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
    const [savedContent, setSavedContent] = useState<boolean>(true)
    const [content, setContent] = useState<{content: string, published: boolean, category: Category}>()
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
        const response = await fetch("/smf/admin/blog/edit/"+id)
        const data = await response.json()
        if (data.content) {
            setContent(data.content)
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
    }, [savedContent])

    if (state.loading || !state.admin || !content) {
        return <></>
    } else {
        return <Editor translation={t} initialContent={content} refresh={() => setSavedContent(!savedContent)}/>
    }
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale? context.defaultLocale : 'en'
    const locale = context.locale? context.locale : defaultLocale
    const commonT = getTranslation('common', locale)
    const blogT = getTranslation('blog', locale)
    const id = context.params?.slug
    return {
        props: {commonT, blogT, id},
    }
}

export default PostEditor