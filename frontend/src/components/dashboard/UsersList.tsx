import React, { useState, useEffect } from 'react'
import Table from 'react-bootstrap/Table'
import ActionButtons from './ActionButtons'
import Icon from '@mdi/react'
import { mdiImageFilterTiltShift , mdiFilterVariant } from '@mdi/js'

interface Props {
    users: Array<User> | null,
    editClicked: (item: User) => void,
    deleteClicked: (item: User) => void,
    translation: {[key:string]: string},
}

type Field = 'username' | 'name' | 'email' | 'role' | ''

export default function UsersList (props: Props) {
    const [sortBy, setSortBy] = useState<Field>('')
    const [orderAsc, setOrderAsc] = useState<boolean>(true)
    const [loading, setLoading] = useState<boolean>(true)
    const users = props.users
    const t = props.translation

    useEffect(() => {
        const asc = orderAsc? 1 : -1
        switch (sortBy) {
            case 'username': sortByUsername(asc); break
            case 'name': sortByName(asc); break
            case 'email': sortByEmail(asc); break
            case 'role': sortByRole(asc); break
        }
        setLoading(false)
    }, [loading])

    useEffect(() => {
        setOrderAsc(true)
        setSortBy('')
    }, [users])

    const sortByUsername = (asc: number) => {
        users?.sort((a, b) => {return (a.username < b.username)? -asc : asc})
    }

    const sortByName = (asc: number) => {
        users?.sort((a, b) => {return (a.lastName === b.lastName)? (a.firstName < b.firstName? -asc : asc)
            : (a.lastName < b.lastName)? -asc : asc})
    }

    const sortByEmail = (asc: number) => {
        users?.sort((a, b) => {return (a.email < b.email)? -asc : asc})
    }

    const sortByRole = (asc: number) => {
        users?.sort((a, b) => {return (a.admin === b.admin)? ((a.username < b.username)? -1 : 1) :
            (a.admin)? asc : -asc})
    }

    const filter = (item: Field) => {
        if (!loading) {
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

    return <Table borderless hover striped responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>{t._username} <span className="filterButton" onClick={() => filter('username')}>
                        <Icon path={getCaret('username')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._full_name} <span className="filterButton" onClick={() => filter('name')}>
                        <Icon path={getCaret('name')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._email} <span className="filterButton" onClick={() => filter('email')}>
                        <Icon path={getCaret('email')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._roles} <span className="filterButton" onClick={() => filter('role')}>
                        <Icon path={getCaret('role')}
                            size={.8}
                            vertical={orderAsc}
                            color="white"
                        /></span></th>
                    <th>{t._action}</th>
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
                        <th>
                            <ActionButtons item={u} editClicked={() => props.editClicked(u)} deleteClicked={() => props.deleteClicked(u)} translation={t} />
                        </th>
                    </tr>
                ))
            }</tbody>
        </Table>
}
