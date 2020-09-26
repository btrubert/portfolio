import React, {useState} from "react";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Collapse from 'react-bootstrap/Collapse';


export default function Photo(props) {
  const [currentPhoto, setCurrentPhoto] = useState(props.photos[props.index]);
  const [open, setOpen] = useState(false);

  const handleSlide = (selectedIndex, e) => {
    setCurrentPhoto(props.photos[selectedIndex]);
  };

    return (
       
      <Modal dialogClassName="modal-75w" show={props.show} onHide={(current) => props.onHide(current)}>
          <Modal.Body>
             <Carousel defaultActiveIndex={props.index} interval={null} indicators={false} onSlid={handleSlide} wrap={true}>
              {props.photos.map(p =>
                <Carousel.Item>
    <Image src={"/build/images/" + p.path} fluid />
    </Carousel.Item>
              )}
             </Carousel>
          </Modal.Body>
          <Modal.Footer>
          <Collapse in={open}>
            <Container id="collapse-exifs">
              <Row>
                <Col>
                Iso: {currentPhoto.exifs.iso}
                </Col>
                <Col>
                Shutter speed: {currentPhoto.exifs.shutter}
                </Col>
                <Col>
                Aperture: {currentPhoto.exifs.aperture}
                </Col>
                <Col>
                Focal: {currentPhoto.exifs.focal}
                </Col>
                <Col>
                Camera: {currentPhoto.exifs.model}
                </Col>
              </Row>
            </Container>
          </Collapse>
          <Button variant="secondary" onClick={() => setOpen(!open)} aria-controls="collapse-exifs"
        aria-expanded={open}>
              Show Exifs
          </Button>
          <Button variant="primary" onClick={props.onHide}>
              close
          </Button>
          </Modal.Footer>
      </Modal>
    );
}
