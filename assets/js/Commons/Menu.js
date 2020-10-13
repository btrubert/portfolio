import React from "react";
import {Navbar, Nav, NavDropdown, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useCookies} from "react-cookie";
import {Container, Row, Col} from 'react-bootstrap';
import {Collapse} from 'react-bootstrap';


export default function Menu() {
    const [cookies, setCookie, removeCookie] = useCookies(["remember"]);

    // function handleCookie() {
    setCookie("rememberme", true, {path: "/"});

    return (

        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect >
            <Container>
                <Navbar.Brand as={Link}
                    to="/">
                    <img src="/build/logo.svg" width="30" height="30" className="d-inline-block align-top" alt="logo"/>{' '}
                    Benjamin Trubert - Photographie
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse className="justify-content-end" id="basic-navbar-nav">
                    <Nav>
                        <Nav.Link as={Link}
                            to="/gallery">Gallery</Nav.Link>
                        <Nav.Link as={Link}
                            to="/blog">Blog</Nav.Link>
                        <Nav.Link as={Link}
                            to="/contact">Contact</Nav.Link>
                        <NavDropdown as={NavItem}
                            title="Login"
                            id="nav-dropdown"
                            alignRight>
                            <NavDropdown.Item> {
                                cookies.rememberme ? <NavDropdown.Item>Logout</NavDropdown.Item> : <NavDropdown.Item>Login form</NavDropdown.Item>
                            } </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
