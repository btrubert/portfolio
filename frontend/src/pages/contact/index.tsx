import React, {useEffect} from 'react'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'

function Contact (props: InferGetStaticPropsType<typeof getStaticProps>) {
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
        return <h1 className="text-center">{trans.common._contact}</h1>
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    return {
        props: {commonT},
        revalidate: 60,
    }
  }

export default Contact