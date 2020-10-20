import React from "react";
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Table from 'react-bootstrap/Table';
import {Button} from 'react-bootstrap';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';

export default function CategoriesList(props) {

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
                props.categories.map(c => (
                    <tr>
                        <th>{
                            c.name
                        }</th>
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
                        <OverlayTrigger trigger={"click"}
                            key={'d'+c.id}
                            placement="top"
                            overlay={
                                <Popover id={'d'+c.id}>
                                <Popover.Content>
                                    <Button className="mr-2" variant="warning" onClick={() => props.deleteClicked(c)}>Confirm</Button>
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
