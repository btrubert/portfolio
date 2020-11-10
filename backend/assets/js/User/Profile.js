import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Navbar, Nav} from 'react-bootstrap';
import UserDetails from './UserDetails';
import Photos from './/Photos';
import Spinner from 'react-bootstrap/Spinner';


export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: props.user,
            activeTab: "Informations",
            filterBy: "id",
            asc: true,
            categories: null,
            photos: null,
        };
    }


    componentDidMount() {
        // for (let tab of ["categories", "photos", "users"]) {
        //     fetch("/admin/dashboard/"+tab).then(response => {
        //         return response.json();
        //     }).then(data => this.setState({[tab]: data}));
        // }
    }

    handleClick(tab) {
        if (tab != this.state.activeTab) {
            this.setState({activeTab: tab, filterBy: "id", asc: true});
        }
    }

    getTab() {
        switch (this.state.activeTab) {
            case "Informations":
                return <UserDetails user={this.state.user}/>;
            case "Photos":
                return <Photos />;
            default:
                return <Spinner animation="border" role="status" variant="success">
                    <span className="sr-only">Loading...</span>
                </Spinner>;
        }
    }

  
    render() {
        return (
            <Container className="main-content">
                <h2>Profile</h2>
                <Navbar expand="md" variant="dark" collapseOnSelect>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" variant="pills" justify defaultActiveKey="Informations">
                            <Nav.Item>
                                <Nav.Link eventKey="Informations"
                                    onSelect={
                                        () => this.handleClick("Informations")
                                }>Informations</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Photos"
                                    onSelect={
                                        () => this.handleClick("Photos")
                                }>Photos</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Container className="main-content">
                    {
                    this.getTab()
                }</Container>
            </Container>
        );
    }
}
