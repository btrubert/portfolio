import React, { useState, useEffect } from 'react'
import Categories from 'components/photo/Categories'
import { useSession } from 'utils/SessionContext'
import Photos from 'components/profile/photos'

interface Props {
    translation: {[key: string]: string},
    category?: string
}

function Gallery (props: Props) {
    const [state, ] = useSession()
    const t = props.translation

    const [categories, setCategories] = useState<Array<Category>>([])
    const [play, setPlay] = useState<Array<number>>([])

    useEffect(() => {
        fetch("/api/profile/categories")
            .then(response => {return response.json()})
            .then(data => {
                setCategories(data)
                if (data.length > 0) {
                    setPlay(Array(data.length).fill(null))
                }
            })
    }, [state.loading])

    const getContent = () => {
        if (props.category && categories.filter((c: Category) => c.name === props.category).length > 0) {
            const category = categories.filter((c: Category) => c.name === props.category)[0]
            return <Photos photos={category.photos}/>
        } else if (categories.length > 0) {
            return <Categories categories={categories} play={play} rootPath="/smf/img/" rootLink="/profile?gallerie="/>
        } else {
            return <p>{t._no_cateogry_available}</p>
        }
    }

    if (state.loading) return <></>
    return <>{getContent()}</>
}

export default Gallery