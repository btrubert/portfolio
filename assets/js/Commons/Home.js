import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import Image from 'react-bootstrap/Image';

export default function Home (props) {

    return (
        <Container className="main-content">
        <h1>Welcome !</h1>
        <Row>
            <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
            Un paragraphe lsdfkl sdfklk;lfds dsfl;kdfsl;kdsf
            sdojkfdsjkldsf kljsdfjkldfs dfkjldfkljfg 
            kjlfgdklj dfgkjldfgskljgfds 
            dfkljgfdjklfdgklj 
            fdgjhkdfggjkhfdgjhkfdgjkhdfg
            </Col>
        </Row>
        <Row>
            <Image src="/build/uploads/profile_pic.jpg"/>
        </Row>
        <Row>
            <Col sm={{ span: 8, offset: 2 }} md={{ span: 6, offset: 3 }}>
            Un deuxieme
            </Col>
        </Row>
        </Container>
        );
}

