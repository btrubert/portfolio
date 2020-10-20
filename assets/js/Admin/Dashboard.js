import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Navbar, Nav} from 'react-bootstrap';
import {Switch, Route} from 'react-router-dom';
import Photos from './Photos';


export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        return (
        <Container>
            <h2>Dashboard</h2>
            <Navbar expand="md" variant="dark">
            <Nav variant="pills" justify defaultActiveKey="photos">
                <Nav.Item>
                <Nav.Link eventKey="photos" to="#photos">Photos</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="posts"to="#posts">Posts</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                <Nav.Link eventKey="users" to="#users" disabled>Users</Nav.Link>
                </Nav.Item>
            </Nav>
            </Navbar>

            <Switch>
                <Route path="#photos" component={Photos} />
                <Route path="#posts" component={Photos} />
                <Route path="#users" component={Photos} />
            </Switch>
        </Container>);
    }
}