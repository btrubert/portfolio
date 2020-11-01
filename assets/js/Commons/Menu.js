import React, {useState} from "react";
import {Navbar, Nav, NavDropdown, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {Container, Row, Col} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';

import Login from './Login';


export default function Menu(props) {
    const [showLogin, setShowLogin] = useState(false);
    const handleShow = () => setShowLogin(true);
    const handleClose = () => setShowLogin(false);

    const handleLogout = () => {
        let formData = new FormData();
        formData.append("_csrf_token", props.token);
        fetch("/logout", {
            method: 'POST',
            body: formData
        }).then(response => {return response.json()});
    }

    return (
        <>
            <Navbar bg="dark" variant="dark" expand="md" collapseOnSelect>
                <Container>
                    <Navbar.Brand as={Link}
                        to="/">
                        <img src="/build/logo.svg" width="30" height="30" className="d-inline-block align-top" alt="logo"/>{' '}
                        Benjamin Trubert - Photographie
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                        <Nav>
                            <Nav.Link eventKey="1"
                                as={Link}
                                to="/gallery">Gallery</Nav.Link>
                            <Nav.Link eventKey="2" disabled
                                as={Link}
                                to="/blog">Blog</Nav.Link>
                            <Nav.Link eventKey="3" disabled
                                as={Link}
                                to="/contact">Contact</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title={
                                    props.user ? "Signed in as: " + props.user.username : "Login"
                                }
                                id="nav-dropdown"
                                alignRight>
                                {
                                props.user ? <>
                                    {props.admin?
                                    <NavDropdown.Item as={Link} eventKey="4" to="/admin/dashboard">Dashboard</NavDropdown.Item>
                                      :  <NavDropdown.Item as={Link} eventKey="4" to="/profile">Profile</NavDropdown.Item>
                                    }
                                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                                </> : <NavDropdown.Item eventKey="4"
                                    onClick={handleShow}>Login</NavDropdown.Item>
                            } </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal size="sm" className="custom-form"
                show={showLogin}
                onHide={handleClose}>
                <Modal.Body>
                    <Login token={props.token} />
                </Modal.Body>
            </Modal>
        </>
    );
}
