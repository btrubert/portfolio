import React, {useState, useEffect} from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Icon from '@mdi/react'
import {mdiImageFilterTiltShift , mdiFilterVariant} from '@mdi/js'

interface Props {
    users: Array<User> | null,
    editClicked: (item: User) => void,
    deleteClicked: (item: User) => void,
}

type Item = 'username' | 'name' | 'email' | 'role' | ''

export default function UsersList (props: Props) {
    const [sortBy, setSortBy] = useState<Item>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const users = props.users

    useEffect(() => {
        if (users) {
            const asc = orderAsc? 1 : -1
            switch (sortBy) {
                case 'username': sortByUsername(users, asc); break
                case 'name': sortByName(users, asc); break
                case 'email': sortByEmail(users, asc); break
                case 'role': sortByRole(users, asc); break
            }
            setLoading(false)
        }
    }, [loading])

    useEffect(() => {
        setOrderAsc(true)
        setSortBy('')
    }, [users])

    const sortByUsername = (cat: Array<User>, asc: number) => {
        cat.sort((a, b) => {return (a.username < b.username)? -asc : asc})
    }

    const sortByName = (cat: Array<User>, asc: number) => {
        cat.sort((a, b) => {return (a.lastName === b.lastName)? (a.firstName < b.firstName? -asc : asc)
            : (a.lastName < b.lastName)? -asc : asc})
    }

    const sortByEmail = (cat: Array<User>, asc: number) => {
        cat.sort((a, b) => {return (a.email < b.email)? -asc : asc})
    }

    const sortByRole = (cat: Array<User>, asc: number) => {
        cat.sort((a, b) => {return (a.admin === b.admin)? ((a.username < b.username)? -1 : 1) :
            (a.username)? asc : -asc})
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
                    <th>Username <span className="filterButton" onClick={() => filter('username')}>
                        <Icon path={getCaret('username')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Name <span className="filterButton" onClick={() => filter('name')}>
                        <Icon path={getCaret('name')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>email <span className="filterButton" onClick={() => filter('email')}>
                        <Icon path={getCaret('email')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Roles <span className="filterButton" onClick={() => filter('role')}>
                        <Icon path={getCaret('role')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{users &&
                users.map((u, index: number) => (
                    <tr key={index}>
                        <th>{
                            u.username
                        }</th>
                        <th>{
                            u.firstName +" "+ u.lastName
                        }</th>
                        <th>
                            {
                            u.email
                        }</th>
                        <th>{u.admin && "Admin"}</th>
                        <th><Button className="mr-2" variant="outline-info" onClick={() => props.editClicked(u)}>Edit</Button>
                        <OverlayTrigger trigger={"focus"}
                            key={'d'+u.id}
                            placement="top"
                            overlay={
                                <Popover id={'d'+u.id}>
                                <Popover.Content>
                                    <Button className="mr-2" variant="success" onClick={() => props.deleteClicked(u)}>Confirm</Button>
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
    )
}
