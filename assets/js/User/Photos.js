import React from "react";
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Spinner from 'react-bootstrap/Spinner';
import Photo from '../Portfolio/Photo';

export default class Photos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: null,
            loading: true,
            show: false,
            index: 0
        };
    }

    componentDidMount() {
        if (this.state.loading) {
            fetch("/profile/categories/").then(response => {
                return response.json();
            }).then(data => {
                this.setState({
                    categories: data,
                    loading: false,
                });
            });
        }
    }

        setModalShow(show, index){
            this.setState({show: show, index: index})
        }

        render() {
            if (this.state.loading) {
                return <Spinner animation="border" role="status" variant="success">
                    <span className="sr-only">Loading...</span>
                </Spinner>;
            } else {
                return (<Container className="main-content">
                            <Row> {this.state.categories.photos.map((p, index) => <Col className="gallery" sm={12}
                                    md={6}
                                    lg={4}>
                                    <Image className="gallery-photo" loading="lazy" src={"/img/" + p.path} onClick={() => this.setModalShow(true, index)} />
                                </Col>)
                            } </Row>
                        <Photo photos={this.state.categories.photos} index={this.state.index} onHide={(i) => this.setModalShow(false, i)} show={this.state.show}/>
                        </Container>
                );
            }
        }
    }
