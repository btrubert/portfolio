import React, {useState, useEffect} from 'react'
import Image from 'react-bootstrap/Image'
import {Container, Row, Col} from 'react-bootstrap/'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import {mdiImageFilterTiltShift , mdiFilterVariant} from '@mdi/js'

interface Props {
    photos: Array<Photo> | null,
    editClicked: (item: Photo) => void,
    deleteClicked: (item: Photo) => void,
}

type Item = 'title' | 'category' | 'date' | ''

export default function PhotosList (props: Props) {
    const [sortBy, setSortBy] = useState<Item>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const photos = props.photos

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
                        <th>Title <span className="filterButton" onClick={() => filter('title')}>
                        <Icon path={getCaret('title')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>Category <span className="filterButton" onClick={() => filter('category')}>
                        <Icon path={getCaret('category')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>Date taken <span className="filterButton" onClick={() => filter('date')}>
                        <Icon path={getCaret('date')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                        <th>Preview</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{photos &&
                    photos.map((p, index: number) => <tr key={index}>
                        <th>{p.title}</th>
                        <th>{p.category.name}</th>
                        <th>{p.exifs.date}</th>
                        <th>
                        <OverlayTrigger trigger={["hover", "focus"]}
                            key={index}
                            placement="top"
                            overlay={
                                <Popover id={index+''}>
                                <Popover.Content>
                                <Image src={"/smf/img/" + p.path} loading="lazy" fluid />
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button variant="success">preview</Button>
                        </OverlayTrigger>
                            </th>
                        <th><Button className="mr-2" variant="outline-info" onClick={() => props.editClicked(p)}>Edit</Button>
                        <OverlayTrigger trigger={"focus"}
                            key={'d'+p.id}
                            placement="top"
                            overlay={
                                <Popover id={'d'+p.id}>
                                <Popover.Content>
                                    <Button className="mr-2" variant="success" onClick={() => props.deleteClicked(p)}>Confirm</Button>
                                    <Button variant="warning">Cancel</Button>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button  variant="outline-danger">Delete</Button>
                        </OverlayTrigger>
                        </th>
                    </tr>)
                }</tbody>
            </Table>
        </Container>
    );  
}
