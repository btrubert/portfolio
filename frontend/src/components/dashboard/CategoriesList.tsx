import React, {useState, useEffect} from "react"
import {Container, Row, Col} from 'react-bootstrap/'
import Link from 'next/link'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Icon from '@mdi/react'
import {mdiImageFilterTiltShift , mdiFilterVariant} from '@mdi/js'

interface Props {
    categories: Array<Category> | null,
    editClicked: (item: Category) => void,
    deleteClicked: (item: Category) => void,
}

type Item = 'name' | 'user' | 'number' | ''

export default function CategoriesList (props: Props) {
    const [sortBy, setSortBy] = useState<Item>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    let categories = props.categories

    useEffect(() => {
        if (categories) {
            const asc = orderAsc? 1 : -1
            switch (sortBy) {
                case 'name': sortByName(categories, asc); break
                case 'user': sortByUser(categories, asc); break
                case 'number': sortByNumber(categories, asc); break
            }
            setLoading(false)
        }
    }, [loading])

    useEffect(() => {
        setOrderAsc(true)
        setSortBy('')
    }, [categories])

    const sortByName = (cat: Array<Category>, asc: number) => {
        cat.sort((a, b) => {return (a.name < b.name)? -asc : asc})
    }

    const sortByUser = (cat: Array<Category>, asc: number) => {
        cat.sort((a, b) => {return (a.user ? b.user ? (a.user.lastName < b.user.lastName? -asc : asc)
                                                : asc
                                        : -asc)})
    }

    const sortByNumber = (cat: Array<Category>, asc: number) => {
        cat.sort((a, b) => {return (a.photos.length - b.photos.length)*asc})
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
        <Table borderless hover striped responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>Name <span className="filterButton" onClick={() => filter('name')}>
                        <Icon path={getCaret('name')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Private (associated user) <span className="filterButton" onClick={() => filter('user')}>
                        <Icon path={getCaret('user')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Number of photos <span className="filterButton" onClick={() => filter('number')}>
                        <Icon path={getCaret('number')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{categories &&
                categories.map((c, index: number) => (
                    <tr key={index}>
                        <th><Link href={"/gallery/"+c.name}>{
                            c.name
                        }</Link>
                        </th>
                        <th>{
                            c.public ? "Public" : "Private"
                        }
                            {
                            c.user ? " (" + c.user.firstName + " " + c.user.lastName + ")" : ""
                        }</th>
                        <th>{
                            c.photos.length
                        }</th>
                        <th><Button className="mr-2" variant="outline-info" onClick={() => props.editClicked(c)}>Edit</Button>
                        <OverlayTrigger trigger={"focus"}
                            key={'d'+c.id}
                            placement="top"
                            overlay={
                                <Popover id={'d'+c.id}>
                                <Popover.Content>
                                    <Button className="mr-2" variant="success" onClick={() => props.deleteClicked(c)}>Confirm</Button>
                                    <Button variant="warning">Cancel</Button>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button  variant="outline-danger">Delete</Button>
                        </OverlayTrigger></th>
                    </tr>
                ))
            }</tbody>
        </Table>
    );
}
