import React, { useState, useEffect } from "react"
import Table from 'react-bootstrap/Table'
import ActionButtons from './ActionButtons'
import { useRouter } from 'next/router'
import Icon from '@mdi/react'
import { mdiImageFilterTiltShift , mdiFilterVariant } from '@mdi/js'

interface Props {
    posts: Array<Post> | null,
    deleteClicked: (item: Post) => void,
    translation: {[key:string]: string},
}

type Field = 'title' | 'author' | 'created_at' | ''

export default function PostsList (props: Props) {
    const [sortBy, setSortBy] = useState<Field>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
    const posts = props.posts
    const t = props.translation

    const router = useRouter()
    const prefix = router.locale === 'fr'? '/fr': ''
    const editClicked = (p: Post) => window.location.assign(`${prefix}/admin/blog/${p.id}`)

    useEffect(() => {
        const asc = orderAsc? 1 : -1
        switch (sortBy) {
            case 'title': sortByTitle(asc); break
            case 'author': sortByUser(asc); break
            case 'created_at': sortByDate(asc); break
        }
        setLoading(false)
    }, [loading])

    useEffect(() => {
        setOrderAsc(false)
        setSortBy('')
    }, [posts])

    const sortByTitle = (asc: number) => {
        posts?.sort((a, b) => {return (a.title < b.title)? -asc : asc})
    }

    const sortByUser = (asc: number) => {
        posts?.sort((a, b) => {return (a.author < b.author)? -asc : asc})
    }

    const sortByDate = (asc: number) => {
        posts?.sort((a, b) => {return (a.createdAt.timestamp < b.createdAt.timestamp)? -asc : asc})
    }

    const filter = (item: Field) => {
        if(!loading){
            if (item === sortBy){
                setOrderAsc(!orderAsc)
            }
            else {
                setSortBy(item)
                setOrderAsc(true)
            }
            setLoading(true)
        }   
    }

    const getCaret = (item: Field) => {
        if (item === sortBy) {
            return mdiFilterVariant
        } else {
            return mdiImageFilterTiltShift
        }
    }

    const timestampToString = (ts: number) => {
        let d = new Date(ts*1000)
        console.log(d)
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    }

    return <Table borderless hover striped responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>{t._post_title} <span className="filterButton" onClick={() => filter('title')}>
                        <Icon path={getCaret('title')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._post_author} <span className="filterButton" onClick={() => filter('author')}>
                        <Icon path={getCaret('author')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._date_update} <span className="filterButton" onClick={() => filter('created_at')}>
                        <Icon path={getCaret('created_at')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._published}</th>
                    <th>{t._action}</th>
                </tr>
            </thead>
            <tbody>{posts &&
                posts.map((p, index: number) => (
                    <tr key={index}>
                        <th>{p.title}  ({p.locale})</th>
                        <th>{p.author}</th>
                        <th>{timestampToString(p.createdAt.timestamp)}{p.updatedContent? ` (${timestampToString(p.updatedContent.timestamp)})` : ''}</th>
                        <th>{p.published? t._published : t._private}</th>
                        <th>
                            <ActionButtons item={p} editClicked={() => editClicked(p)} deleteClicked={() => props.deleteClicked(p)} translation={t} />
                        </th>
                    </tr>
                ))
            }</tbody>
        </Table>
}
