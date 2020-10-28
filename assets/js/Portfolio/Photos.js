import React from "react";
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Spinner from 'react-bootstrap/Spinner';
import Photo from './Photo';

export default class Photos extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: null,
            loading: true,
            cat: this.props.match.params.cat,
            show: false,
            index: 0
        };
        if (this.props.photos) {
            this.setState({photos: this.props.photos, loading: false});
        }
    }

        componentDidMount() {
            if (this.state.loading) {
                fetch("/api/gallery/" + this.state.cat).then(response => {
                    return response.json();
                }).then(data => {
                    this.setState({photos: data, loading: false});
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
                            <Row> {
                                this.state.photos.map((p, index) => <Col className="gallery" sm={12}
                                    md={6}
                                    lg={4}>
                                    <Image className="gallery-photo" loading="lazy" src={"/img/" + p.path} onClick={() => this.setModalShow(true, index)} />
                                </Col>)
                            } </Row>
                        <Photo photos={this.state.photos} index={this.state.index} onHide={(i) => this.setModalShow(false, i)} show={this.state.show}/>
                        </Container>
                );
            }
        }
    }
