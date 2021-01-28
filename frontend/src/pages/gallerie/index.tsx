import React, { useEffect } from 'react'
import Categories from 'components/photo/Categories'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'



function Gallery(props: InferGetStaticPropsType<typeof getStaticProps>) {
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
        <h1 className="text-center">{trans.common._gallery}</h1>
        <Categories categories={props.categories} play={props.play}/>
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch(process.env.SERVEUR_URL+"/smf/categories")
    let categories: Array<Category> = []
    let play: Array<number> = []
    if (response.ok) {
        categories =  await response.json()
        play = Array(categories.length).fill(null)
    }
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    return {
        props: {categories, play, commonT},
        revalidate: 60,
    }
}
  

export default Gallery
