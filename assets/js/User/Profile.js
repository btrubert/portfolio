import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {user: props.user};
    }

    render() {
        return (
            <Container>
                <h2>Profile of {this.state.user.firstName} {this.state.user.lastName}.</h2>
            </Container>
        );
    }
}
