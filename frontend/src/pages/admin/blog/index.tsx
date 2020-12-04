import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import Editor from 'components/blog/Editor'
 
function PostEditor (props: InferGetStaticPropsType<typeof getStaticProps>) {
    const [trans, dispatch] = useTranslation()
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
        router.push("?post title", undefined, {shallow: true})
    }, [])

    return <Editor translation={t}/>
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale? context.defaultLocale : 'en'
    const locale = context.locale? context.locale : defaultLocale
    const commonT = getTranslation('common', locale)
    const blogT = getTranslation('blog', locale)
    return {
        props: {commonT, blogT},
        revalidate: 60,
    }
}

export default PostEditor