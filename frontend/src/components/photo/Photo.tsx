import React, { useState } from 'react'
import { useTranslation } from 'utils/TranslationContext'
import { useRouter } from 'next/router'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Carousel from 'react-bootstrap/Carousel'
import Image from 'react-bootstrap/Image'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Collapse from 'react-bootstrap/Collapse'
import Icon from '@mdi/react'
import { mdiTwitter, mdiEmail } from '@mdi/js'

interface Props {
    photos: Array<Photo>,
    index: number,
    onHide: () => void,
    show: boolean,
    gallery: boolean,
}

export default function Photo(props: Props) {
    const [currentPhoto, setCurrentPhoto] = useState<Photo>(props.photos[props.index])
    const [indexCarousel, setIndexCarousel] = useState<number>(props.index)
    const [trans, dispatch] = useTranslation()
    const router = useRouter()
    // Exifs caption options
    const [open, setOpen] = useState<boolean>(false)
    const [show, setShow] = useState<string>(trans.common._show_exifs)

    const handleSlide = (selectedIndex: number) => {
        setCurrentPhoto(props.photos[selectedIndex])
        setIndexCarousel(selectedIndex)
        router.replace({pathname: router.pathname, query: {category: currentPhoto.category.name, photo: selectedIndex}}, `/gallerie/${router.query.category}?photo=${selectedIndex}`, {shallow: true})
    }


    return <Modal dialogClassName="modal-carousel"
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
            <Modal.Header closeButton>
                {props.gallery && <>
                <a target="_blank" className="mr-2"
                href={`https://twitter.com/intent/tweet?size=large&text=${currentPhoto.title}&url=https://benjamintrubert.fr${encodeURI(router.asPath)}&via=benjamintrubert&hashtags=photo,${currentPhoto.category.name}`}>
                    <Icon path={mdiTwitter} size={1} color="grey" className="shareIcon"/>
                </a>
                <a target="_blank"
                href={`mailto:?subject=[photo] ${currentPhoto.title}&body=https://benjamintrubert.fr${encodeURIComponent(router.asPath)}`}>
                    <Icon path={mdiEmail} size={1} color="grey" className="shareIcon"/>
                </a>
                </>}
            </Modal.Header>
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
                            src={"/uploads/" + p.path} fluid alt={p.title}/>
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
                                        setShow(open ? trans.common._show_exifs : trans.common._hide_exifs);
                                    }
                                }
                                aria-controls="collapse-exifs"
                                aria-expanded={open}>
                                {show}
                            </Button>
                        </Carousel.Caption>
                    </Carousel.Item>)
                } </Carousel>
            </Modal.Body>
        </Modal>
}
