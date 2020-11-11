import React from 'react'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

interface Props {
    users: Array<User> | null,
    editClicked: (item: User) => void,
    deleteClicked: (item: User) => void,
    refresh:  () => void,
}

export default function UsersList (props: Props) {

    return (
        <Table borderless hover striped responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>Name</th>
                    <th>email</th>
                    <th>Roles</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{props.users &&
                props.users.map((u, index: number) => (
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
