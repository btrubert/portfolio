import React from "react"
import {Navbar, Nav, NavDropdown} from 'react-bootstrap'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Login from './Login'
import {SessionContext} from '../services/SessionContext'


interface State {
    showLogin: boolean,
    csrfToken: string
}

export default class Menu extends React.Component<{}, State> {
    static contextType = SessionContext
    constructor(props) {
        super(props)
        this.state = {
            showLogin: false,
            csrfToken: "",
        }
    }

    componentDidMount() {
        const [state, dispatch] = this.context
        if (state.user){
            fetch("/api/profile_info")
            .then(response => {return response.json()})
            .then(data => {
                this.setState({csrfToken: data.token})
                if (data.user) {
                    dispatch({
                        type: 'setSession',
                        payload: {
                            username: data.user.username,
                            firstName: data.user.firstName,
                            lastName: data.user.lastName,
                            email: data.user.email,
                            admin: data.user.admin,
                        }
                    })
                }
            })
        }
    }

    toggleShow(show) {
        this.setState({showLogin: show})
    }

    handleLogout () {
        fetch("/api/logout", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({_csrf_token: this.state.csrfToken})
        })
        .then(response => {window.location.assign('/')})
    }

    render() {
        const [state, dispatch] = this.context
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
                                    state.admin ? <Link href="/admin/dashboard" passHref>
                                        <NavDropdown.Item eventKey="4">Dashboard</NavDropdown.Item>
                                    </Link> : <Link href="/profile" passHref>
                                        <NavDropdown.Item eventKey="4">Profile</NavDropdown.Item>
                                    </Link>
                                }
                                    <NavDropdown.Item onClick={() => this.handleLogout()}>Logout</NavDropdown.Item>
                                </> : <NavDropdown.Item eventKey="4"
                                    onClick={() => this.toggleShow(true)}>Login</NavDropdown.Item>
                            } </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal size="sm" className="custom-form"
                show={this.state.showLogin}
                onHide={() => this.toggleShow(false)}>
                <Modal.Body>
                    <Login token={this.state.csrfToken} />
                </Modal.Body>
            </Modal>
            </>
            );
        }
}