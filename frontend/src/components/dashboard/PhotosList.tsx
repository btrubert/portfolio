import React from 'react'
import Image from 'next/image'
import {Container, Row, Col} from 'react-bootstrap/'
import Table from 'react-bootstrap/Table'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Button from 'react-bootstrap/Button'

interface Props {
    photos: Array<Photo> | null,
    editClicked: (item: Photo) => void,
    deleteClicked: (item: Photo) => void,
    refresh:  () => void,
    imgBaseUrl: string,
}

export default function PhotosList (props: Props) {

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
                    props.photos.map((p, index: number) => <tr key={index}>
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
                                <Image src={props.imgBaseUrl + "/img/" + p.path} unsized />
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
