import React from "react";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';
import {Container, Row, Col, Image} from 'react-bootstrap/';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';

export default class Categories extends React.Component {
    constructor(props) {
        super(props);
        if (this.props.categories) {
            this.state = {
                categories: this.props.categories,
                loading: false
            };
        } else {
            this.state = {
                categories: null,
                loading: true
            };
        }
    }

    componentDidMount() {
        if (this.state.loading) {
            fetch("/api/categories").then(response => {
                return response.json();
            }).then(data => {
                this.setState({categories: data, loading: false});
            });
        }
    }

    render() {
        if (this.state.loading) {
            return <Spinner animation="border" role="status" variant="success">
                <span className="sr-only">Loading...</span>
            </Spinner>;
        } else {
            return (
                    <Row >
                        {
                        this.state.categories.map(c => <Col className="category-cards" sm={12} md={6} lg={4}>
                            <Link to={
                                "/gallery/" + c.name
                            }>
                                <Card className="text-white category-card">
                                    <Card.Img src={"/build/uploads/img/" +c.photos[0].path} alt="Card image" className="category-card-img" />
                                    <Card.ImgOverlay className="category-card-text">
                                        <Card.Text className="text-center" as="h3">{c.name}</Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </Link>
                        </Col>)
                    } </Row>
            );
        }
    }
}
