import React from "react";
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Table from 'react-bootstrap/Table';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

export default function PhotosList(props) {

    return (
        <Container className="main-content">
            <Table borderless hover striped responsive="lg" variant="dark">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Date taken</th>
                        <th>Preview</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>{props.photos &&
                    props.photos.map(p => <tr>
                        <th>{p.title}</th>
                        <th>{p.category.name}</th>
                        <th>{p.exifs.date}</th>
                        <th>
                        <OverlayTrigger trigger={["hover", "focus"]}
                            key={p.id}
                            placement="top"
                            overlay={
                                <Popover id={`popover-positioned-${p.id}`}>
                                <Popover.Content>
                                <Image loading="lazy" src={"/img/" + p.path} fluid/>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button variant="success">preview</Button>
                        </OverlayTrigger>
                            </th>
                        <th><Button className="mr-2" variant="outline-info" onClick={() => props.editClicked(p)}>Edit</Button> Delete</th>
                    </tr>)
                }</tbody>
            </Table>
        </Container>
    );  
}
