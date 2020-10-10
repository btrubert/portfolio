import React from "react";
import {Navbar, Nav, NavDropdown, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';


const Menu = () => (
    <Navbar bg="light" expand="lg">
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
                <NavDropdown as={NavItem} title="Add a new ..." id="nav-dropdown">
                    <NavDropdown.Item as={Link} eventKey="create_cat" to="/new/category">Category</NavDropdown.Item>
                    <NavDropdown.Item as={Link} eventKey="create_photo" to="/new/photo">Photo</NavDropdown.Item>
                </NavDropdown>
            </Nav>
        </Navbar.Collapse>
    </Navbar>
);

export default Menu;
