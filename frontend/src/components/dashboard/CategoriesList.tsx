import React from "react"
import {Container, Row, Col} from 'react-bootstrap/'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

interface Props {
    categories: Array<Category> | null,
    editClicked: (item: Category) => void,
    deleteClicked: (item: Category) => void,
    refresh:  () => void,
}

export default function CategoriesList (props: Props) {
    return (
        <Table borderless hover striped responsive="lg" variant="dark">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Private (associated user)</th>
                    <th>Number of photos</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>{props.categories &&
                props.categories.map((c, index: number) => (
                    <tr key={index}>
                        <th>{
                            c.name
                        }
                        {/* TODO click to category */}
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
