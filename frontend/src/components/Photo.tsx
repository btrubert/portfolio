import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'next/image'
import {Container, Row, Col} from 'react-bootstrap/'
import Collapse from 'react-bootstrap/Collapse'

interface Props {
    photos: Array<Photo>,
    index: number,
    onHide: () => void,
    show: boolean,
    imgBaseUrl: string,
}

export default function Photo(props: Props) {
    const [currentPhoto, setCurrentPhoto] = useState(props.photos[props.index]);
    // Exifs caption options
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState('Show');

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
               props.onHide()
            }
	    centered>
            <Modal.Header></Modal.Header>
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
                        <Image className="carousel-photo"
                            src={"/uploads/" + p.path} layout="fill" unoptimized/>
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
