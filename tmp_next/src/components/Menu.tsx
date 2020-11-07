import React, {useState} from "react"
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Login from './Login'
import {useSession} from '../services/SessionContext'


export default function Menu(props) {
    const [showLogin, setShowLogin] = useState(false);
    const handleShow = () => setShowLogin(true);
    const handleClose = () => setShowLogin(false);
    const [state, dispatch] = useSession()
    const handleLogout = () => {
        let formData = new FormData();
        formData.append("_csrf_token", props.csrfToken);
        fetch("/api/logout", {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json()
        });
    }

    return (
            <>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Link href="/" passHref>
                        <Navbar.Brand as={
                                Nav.Link
                            }
                           >
                            <img src="/logo.svg" width="30" height="30" className="d-inline-block align-top" alt="logo"/>{' '}
                            Benjamin Trubert - Photographie
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                        <Nav>
                            <Link href="/gallery" passHref>
                                <Nav.Link eventKey="1">Gallery</Nav.Link>
                            </Link>
                            <Link href="/blog" passHref>
                                <Nav.Link eventKey="2" disabled>Blog</Nav.Link>
                            </Link>
                            <Link href="/contact" passHref>
                                <Nav.Link eventKey="3" disabled>Contact</Nav.Link>
                            </Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title={
                                    state.username != "" ? "Signed in as: " + state.username : "Login"
                                }
                                id="nav-dropdown"
                                alignRight>
                                {
                                state.admin ? <> {
                                    state.admin ? <Link href="/admin/dashboard">
                                        <NavDropdown.Item eventKey="4" href="/admin/dashboard">Dashboard</NavDropdown.Item>
                                    </Link> : <Link href="/profile">
                                        <NavDropdown.Item eventKey="4" href="/profile">Profile</NavDropdown.Item>
                                    </Link>
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
                    <Login />
                </Modal.Body>
            </Modal>
            </>
            );
}
