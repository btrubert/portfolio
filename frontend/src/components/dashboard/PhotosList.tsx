import React, { useState, useEffect } from 'react'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Table from 'react-bootstrap/Table'
import ActionButtons from 'components/dashboard/ActionButtons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import { mdiImageFilterTiltShift , mdiFilterVariant } from '@mdi/js'

interface Props {
    photos: Array<Photo> | null,
    editClicked: (item: Photo) => void,
    deleteClicked: (item: Photo) => void,
    translation: {[key:string]: string},
}

type Item = 'title' | 'category' | 'date' | ''

export default function PhotosList (props: Props) {
    const [sortBy, setSortBy] = useState<Item>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const photos = props.photos
    const t = props.translation

    useEffect(() => {
        if (photos) {
            const asc = orderAsc? 1 : -1
            switch (sortBy) {
                case 'title': sortByTitle(photos, asc); break
                case 'category': sortByCategory(photos, asc); break
                case 'date': sortByDate(photos, asc); break
            }
            setLoading(false)
        }
    }, [loading])

    useEffect(() => {
        setOrderAsc(true)
        setSortBy('')
    }, [photos])

    const sortByTitle = (cat: Array<Photo>, asc: number) => {
        cat.sort((a, b) => {return (a.title < b.title)? -asc : asc})
    }

    const sortByCategory = (cat: Array<Photo>, asc: number) => {
        cat.sort((a, b) => {return (a.category.name === b.category.name)? ((a.title < b.title)? -asc : asc) :
            (a.category.name < b.category.name)? -asc : asc})
    }

    const sortByDate = (cat: Array<Photo>, asc: number) => {
        cat.sort((a, b) => {return (a.exifs.date < b.exifs.date)? -asc : asc})
    }

    const filter = (item: Item) => {
        if (item === sortBy){
            setOrderAsc(!orderAsc)
        }
        else {
            setSortBy(item)
            setOrderAsc(true)
        }
        setLoading(true)  
    }

    const getCaret = (item: Item) => {
        if (item === sortBy) {
            return mdiFilterVariant
        } else {
            return mdiImageFilterTiltShift
        }
    }

    return (
        <Container className="main-content">
            <Table borderless hover striped responsive="lg" variant="dark">
                <thead>
                    <tr>
                        <th>{t._title} <span className="filterButton" onClick={() => filter('title')}>
                        <Icon path={getCaret('title')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>{t._category} <span className="filterButton" onClick={() => filter('category')}>
                        <Icon path={getCaret('category')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>{t._date_taken} <span className="filterButton" onClick={() => filter('date')}>
                        <Icon path={getCaret('date')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>{t._preview}</th>
                        <th>{t._action}</th>
                    </tr>
                </thead>
                <tbody>{photos &&
                    photos.map((p, index: number) => <tr key={index}>
                        <th>{p.title}</th>
                        <th>{p.category.name}</th>
                        <th>{p.exifs.date}</th>
                        <th>
                        <OverlayTrigger trigger={["hover", "focus"]}
                            delay={200}
                            key={index}
                            placement="top"
                            overlay={
                                <Popover id={index+''}>
                                <Popover.Content>
                                <Image src={`/smf/img/${p.path}`} loading="lazy" fluid />
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button variant="success">preview</Button>
                        </OverlayTrigger>
                            </th>
                        <th>
                        <ActionButtons item={p} editClicked={() => props.editClicked(p)} deleteClicked={() => props.deleteClicked(p)} translation={t} />
                        </th>
                    </tr>)
                }</tbody>
            </Table>
        </Container>
    );  
}
