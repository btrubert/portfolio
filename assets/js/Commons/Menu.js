import React, {useState} from "react";
import {Navbar, Nav, NavDropdown, NavItem} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useCookies} from "react-cookie";
import {Container, Row, Col} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import Login from './Login';


export default function Menu() {
    const [cookies, setCookie, removeCookie] = useCookies(["remember"]);
    const [showLogin, setShowLogin] = useState(false);

    const handleShow = () => setShowLogin(true);
    const handleClose = () => setShowLogin(false);

    return (<>
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
                        <Nav.Link  eventKey="1" as={Link}
                            to="/gallery">Gallery</Nav.Link>
                        <Nav.Link  eventKey="2" as={Link}
                            to="/blog">Blog</Nav.Link>
                        <Nav.Link  eventKey="3" as={Link}
                            to="/contact">Contact</Nav.Link>
                    </Nav>
                    <Nav>
                        <NavDropdown as={NavItem}
                            title="Login"
                            id="nav-dropdown"
                            alignRight>{
                                cookies.rememberme ?
                                <NavDropdown.Item eventKey="4"><Button onClick={removeCookie("rememberme", {path: "/"})}>Logout</Button></NavDropdown.Item>
                                :
                                <NavDropdown.Item eventKey="4"><Button onClick={handleShow}>Login</Button></NavDropdown.Item>
                            }
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
        <Modal size="sm" className="login-form" show={showLogin} onHide={handleClose}>
            <Modal.Body>
            <Login  />
            </Modal.Body>
        </Modal>
        </>
    );
}
