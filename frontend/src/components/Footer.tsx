import { useTranslation } from 'utils/TranslationContext'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Icon from '@mdi/react'
import { mdiTwitter, mdiInstagram, mdiGithub } from '@mdi/js'

function Footer () {
    const [trans, dispatch] = useTranslation()

    return <Navbar bg="dark" variant="dark" expand="lg" className="footer">
        <Nav className="mr-auto">
        <Nav.Item>
            <img src="/Signature.png" className="signature" />
        </Nav.Item>
        </Nav>
        <Nav className="justify-content-end">
            <Nav.Item className="mr-2">
                {trans.common._social_media} : 
            </Nav.Item>
            <Nav.Item className="mr-2">
                <a href="https://twitter.com/benjamintrubert" target="_blank">
                    <Icon path={mdiTwitter} size={1} color="white" />
                </a>
            </Nav.Item>
            <Nav.Item className="mr-2">
                <a href="https://www.instagram.com/benjamintrubert/" target="_blank">
                    <Icon path={mdiInstagram} size={1} color="white" />
                </a>
            </Nav.Item>
            <Nav.Item className="mr-2">
                <a href="https://github.com/btrubert/portfolio/" target="_blank">
                    <Icon path={mdiGithub} size={1} color="white" />
                </a>
            </Nav.Item>
        </Nav>
    </Navbar>
}

export default Footer