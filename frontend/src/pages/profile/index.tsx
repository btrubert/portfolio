import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Gallery from 'components/profile/gallery'
import Edit from 'components/profile/edit'

function Profile (props: InferGetStaticPropsType<typeof getStaticProps>) {
    const [activeTab, setActiveTab] = useState<'photos' | 'information'>('photos')
    const router = useRouter()
    const [state, ] = useSession()
    const [trans, dispatch] = useTranslation()
    const t = JSON.parse(props.dashboardT)

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])

    useEffect(() => {
        if (!state.loading && state.username === '') {
            router.push('/')
        }
    }, [state.username, state.loading])

    const getTab = () => {
        return activeTab === 'photos'? <Gallery translation={t} category={router.query.gallerie as string}/> : <Edit translation={t}/>
    }

    if (state.loading) return <></>
    return <>
        <h1 className="text-center">{t._perso}</h1>
        <Navbar expand="md" variant="dark" collapseOnSelect>
            <Navbar.Toggle aria-controls="basic-navbar-nav"/>
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="mr-auto" variant="pills" justify defaultActiveKey="photos">
                    <Nav.Item>
                        <Nav.Link eventKey="photos"
                            onSelect={
                                () => setActiveTab("photos")
                        }>{t._photos}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="infos"
                            onSelect={
                                () => setActiveTab("information")
                        }>{t._infos}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        {getTab()}
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const dashboardT = getTranslation('profile', locale)
    return {
        props: {commonT, dashboardT},
    }
}

export default Profile