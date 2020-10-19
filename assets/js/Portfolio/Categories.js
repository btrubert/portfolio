import React from "react";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';
import {Container, Row, Col, Image} from 'react-bootstrap/';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import Carousel from 'react-bootstrap/Carousel';


export default class Categories extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            categories: null,
            loading: true,
            play: []
        };
    }

    componentDidMount() {
        if (this.state.loading) {
            fetch("/api/categories").then(response => {
                return response.json();
            }).then(data => {
                this.setState({
                    categories: data,
                    loading: false,
                    play: Array(data.length).fill(null)
                });
            });
        }
    }

    handlePlay(index) {
        const play = this.state.play.slice();
        play[index] = 500;
        this.setState({play: play});
    }

    handleStop(index) {
        const play = this.state.play.slice();
        play[index] = null;
        this.setState({play: play});
    }

    render() {
        if (this.state.loading) {
            return <Spinner animation="border" role="status" variant="success">
                <span className="sr-only">Loading...</span>
            </Spinner>;
        } else {
            return (
                <Container className="main-content">
                    <Row> {
                        this.state.categories.map((c, index) => <Col className="category-cards"
                            sm={12}
                            md={6}
                            lg={4}>
                            <Link to={
                                    "/gallery/" + c.name
                                }
                                onMouseOver={
                                    () => this.handlePlay(index)
                                }
                                onMouseOut={
                                    () => this.handleStop(index)
                                }
                                onTouchStart={
                                    () => this.handlePlay(index)
                                }
                                onTouchEnd={
                                    () => this.handleStop(index)
                            }>
                                <Card className="text-white category-card">
                                    <Carousel indicators={false}
                                        wrap={true}
                                        interval={
                                            this.state.play[index]
                                        }
                                        controls={false}
                                        pause={false}>
                                        {
                                        c.photos.map(p => <Carousel.Item>
                                            <Card.Img loading="lazy" src={
                                                    "/build/uploads/img/" + p.path
                                                }
                                                alt="Card image"
                                                className="category-card-img"/>
                                        </Carousel.Item>)
                                    } </Carousel>

                                    <Card.ImgOverlay className="category-card-text">
                                        <Card.Text className="text-center" as="h3">
                                            {
                                            c.name
                                        }</Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Link>
                        </Col>)
                    } </Row>
                </Container>
            );
        }
    }
}
