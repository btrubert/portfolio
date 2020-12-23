import React, { useState, useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Link from 'next/link'
import Container from 'react-bootstrap/Container'
import Modal from 'react-bootstrap/Modal'
import Login from './Login'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import Toast from 'react-bootstrap/Toast'
import Icon from '@mdi/react'
import { mdiEarth } from '@mdi/js'


function Menu () {
    const [state, dispatch] = useSession()
    const [trans, dispatchT] = useTranslation()
    const [showError, setShowError] = useState<boolean>(false)
    const router = useRouter()

    const [showLogin, setShowLogin] = useState<boolean>(false)


    useEffect(() => {
        fetch("/api/profile_info")
        .then(response => {
            if (response.ok) {
                return response.json()
            } else { // if the user was already connected using a remember me token
                setShowError(true)
                return {'token': ''}
            }
        })
        .then(data => {
            if (data.user) {
                dispatch({
                    type: 'setSession',
                    payload: {
                        username: data.user.username,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        admin: data.user.admin,
                        token: data.token,
                    }
                })
            } else {
                dispatch({
                    type: 'setToken',
                    payload: {
                        token: data.token,
                    }
                })
            }
        })
    }, [state.loading])

    const handleLogout = () => {
        fetch("/api/logout", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({_csrf_token: state.token})
        })
        .then(response => {
            if (response.ok) {
                dispatch({
                    type: 'logout'
                })
                window.location.assign('/')
            } else {
                throw new Error("Error while trying to logout.")
            }
        })
        .catch(error => {
            console.log(error)
        })
    }

    const changeLanguage = async () => {
        if (router.locale === 'en') {
            dispatchT({type: 'reset'})
            router.push(router.pathname, router.asPath, {locale: 'fr'})
        } else {
            dispatchT({type: 'reset'})
            router.push(router.pathname, router.asPath, {locale: 'en'})
        }
    }

    
    if (state.loading) {
        return <></>
    } else {
        return (
            <>
            <Head>  
                <title>{trans.common._title}</title>
            </Head>
            <Toast show={showError} onClose={() => setShowError(false)}>
                <Toast.Body>
                    <strong className="mr-auto">{trans.common._server_error}</strong>
                </Toast.Body>
            </Toast>
            <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
                <Container>
                    <Link href="/" passHref>
                        <Navbar.Brand as={Nav.Link}>
                            <img src="/logo.svg" width="30" height="30" className="d-inline-block align-top" alt="logo"/>{' '}
                            <Nav.Item className="d-none d-md-inline">{trans.common._title}</Nav.Item>
                        </Navbar.Brand>
                    </Link>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse className="justify-content-end" id="responsive-navbar-nav">
                        <Nav>
                            <Link href="/gallery" passHref>
                                <Nav.Link>{trans.common._gallery}</Nav.Link>
                            </Link>
                            <Link href="/blog" passHref>
                                <Nav.Link>{trans.common._blog}</Nav.Link>
                            </Link>
                            <Link href="/contact" passHref>
                                <Nav.Link>{trans.common._contact}</Nav.Link>
                            </Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title={
                                    state.username != "" ? trans.common._signed_in_as + state.username : trans.common._login
                                }
                                id="nav-dropdown"
                                alignRight>
                                {
                                state.admin ? <> {
                                    state.admin ? <Link href="/admin/dashboard" passHref>
                                        <NavDropdown.Item>{trans.common._dashboard}</NavDropdown.Item>
                                    </Link> : <Link href="/profile" passHref>
                                        <NavDropdown.Item>{trans.common._profile}</NavDropdown.Item>
                                    </Link>
                                }
                                    <NavDropdown.Item onClick={handleLogout}>{trans.common._logout}</NavDropdown.Item>
                                </> : <NavDropdown.Item eventKey="login"
                                    onClick={() => setShowLogin(true)}>{trans.common._login}</NavDropdown.Item>
                            } </NavDropdown>
                        </Nav>
                        <Nav>
                            <OverlayTrigger trigger={['focus', 'hover']}
                                placement="auto-start"
                                overlay={
                                <Tooltip id="language">
                                    {trans.common._change_language}
                                </Tooltip>}>
                                    <div onClick={changeLanguage} className="language">
                                    <Icon path={mdiEarth} color="white" size={1} />
                                    </div>
                            </OverlayTrigger>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Modal size="sm" className="custom-form"
                show={showLogin}
                onHide={() => setShowLogin(false)}>
                <Modal.Body>
                    <Login />
                </Modal.Body>
            </Modal>
            </>
        )
    }
}

export default Menu