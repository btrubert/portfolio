import React, { useState, useEffect } from 'react'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
import { useRouter } from 'next/router'
import Layout from 'components/blog/Layout'


function Post (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [state, dispatchS] = useSession()
    const [trans, dispatch] = useTranslation()
    const router = useRouter()

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
                <Layout content={props.post.content} />
        </>
    }
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const response = await fetch(`${process.env.SERVEUR_URL}/smf/post/${context.params?.post}`)
    let post: Post | null = null
    if (response.ok) {
        post = await response.json()
        return {
            props: {post, commonT},
        }
    }
    return {
        props: {post, commonT},
        redirect: { destination: "/blog", permanent: false }
    }
}

export default Post
