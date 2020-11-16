import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'react-bootstrap/Image'
import {Container, Row, Col} from 'react-bootstrap/'
import Collapse from 'react-bootstrap/Collapse'

interface Props {
    photos: Array<Photo>,
    index: number,
    onHide: () => void,
    show: boolean,
}

export default function Photo(props: Props) {
    const [currentPhoto, setCurrentPhoto] = useState<Photo>(props.photos[props.index]);
    // Exifs caption options
    const [open, setOpen] = useState<boolean>(false);
    const [show, setShow] = useState<'Show' | 'Hide'>('Show');

    const handleSlide = (selectedIndex: number) => {
        setCurrentPhoto(props.photos[selectedIndex]);
    };


    return (

        <Modal dialogClassName="modal-carousel"
            show={
                props.show
            }
            onEnter={
                () => setCurrentPhoto(props.photos[props.index])
            }
            onHide={
               props.onHide
            }
	    centered>
            <Modal.Header closeButton />
            <Modal.Body>
                <Carousel defaultActiveIndex={
                        props.index
                    }
                    interval={null}
                    indicators={false}
                    fade={true}
                    onSlide={handleSlide}
                    wrap={true}>
                    {
                    props.photos.map((p, index) => <Carousel.Item key={index}>
                        <Image loading="lazy"
                            src={"/uploads/" + p.path} fluid/>
                        <Carousel.Caption>
                            <Collapse in={open}>
                                <Container className="exifs-info" id="collapse-exifs">
                                    <Row>
                                        <Col>
                                            {(currentPhoto.exifs.brand=="FUJIFILM"? currentPhoto.exifs.brand+" ": "") +
                                            currentPhoto.exifs.model
                                        } </Col>
                                        <Col>
                                            {
                                            currentPhoto.exifs.focal
                                        } </Col>
                                        <Col>
                                            {
                                            currentPhoto.exifs.iso
                                        }</Col>
                                        <Col>
                                            {
                                            currentPhoto.exifs.shutter
                                        } </Col>
                                        <Col>
                                            {
                                            currentPhoto.exifs.aperture
                                        } </Col>
                                    </Row>
                                </Container>
                            </Collapse>
                            <Button variant="outline-success"
                                onClick={
                                    () => {
                                        setOpen(!open);
                                        setShow(open ? "Show" : "Hide");
                                    }
                                }
                                aria-controls="collapse-exifs"
                                aria-expanded={open}>
                                {show}
                                Exifs
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>)
                } </Carousel>
            </Modal.Body>
        </Modal>
    );
}
