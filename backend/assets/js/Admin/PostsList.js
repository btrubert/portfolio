import React from "react";
import Image from 'react-bootstrap/Image';
import {Container, Row, Col} from 'react-bootstrap/';
import Table from 'react-bootstrap/Table';

export default class PostsList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            photos: null,
            loading: false,
            show: false,
            index: 0
        };
        if (this.props.photos) {
            this.setState({photos: this.props.location.photos, loading: false});
        }
    }

    

    render() {
        if (this.state.loading) {
            return null;
        } else {
            return (
                <Container className="main-content">
                    <Table borderless hover striped responsive="lg" variant="dark">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Private</th>
                                <th>Date published</th>
                                <th>Date edited</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                            <tr>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </tbody>
                    </Table>
                </Container>
            );
        }
    }
}
