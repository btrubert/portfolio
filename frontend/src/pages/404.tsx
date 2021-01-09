import React, { useEffect } from 'react'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { getTranslation } from 'utils/Translation'
import { useTranslation } from 'utils/TranslationContext'
import { useRouter } from 'next/router'
import Icon from '@mdi/react'
import { mdiAlertCircleOutline } from '@mdi/js'

export default function Error(props: InferGetStaticPropsType<typeof getStaticProps>) {
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

    return <>
    <h1><Icon path={mdiAlertCircleOutline} size={2} spin/> Error 404 : </h1>
    <h3>{trans.common._404}</h3>
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    return {
        props: {commonT},
        revalidate: 60,
    }
  }