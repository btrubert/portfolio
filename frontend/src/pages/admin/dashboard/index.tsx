import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Button from 'react-bootstrap/Button'
import PhotosList from 'components/dashboard/PhotosList'
import PhotoForm from 'components/dashboard/forms/PhotoForm'
import UsersList from 'components/dashboard/UsersList'
import UserForm from 'components/dashboard/forms/UserForm'
import CategoriesList from 'components/dashboard/CategoriesList'
import CategoryForm from 'components/dashboard/forms/CategoryForm'
import PostsList from 'components/dashboard/PostsList'
import PostForm from 'components/dashboard/forms/PostForm'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'


type Entity = 'categories' | 'photos' | 'users' | 'posts'

function Dashboard (props: InferGetStaticPropsType<typeof getStaticProps>) {
    const router = useRouter()
    const [state, dispatchS] = useSession()
    const [trans, dispatch] = useTranslation()
    const t = JSON.parse(props.dashboardT)

    // Entity lists managment
    const [categories, setCategories] = useState<Array<Category> | null>(null)
    const [refreshCategories, setRefreshCategories] = useState<boolean>(true)
    const [photos, setPhotos] = useState<Array<Photo> | null>(null)
    const [refreshPhotos, setRefreshPhotos] = useState<boolean>(true)
    const [users, setUsers] = useState<Array<User> | null>(null)
    const [refreshUsers, setRefreshUsers] = useState<boolean>(true)
    const [posts, setPosts] = useState<Array<Post> | null>(null)
    const [refreshPosts, setRefreshPosts] = useState<boolean>(true)

    // Form management
    const [activeTab, setActiveTab] = useState<Entity>('categories')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [editForm, setEditForm] = useState<boolean>(false)
    const [currentItem, setCurrentIten] = useState<Item | null>(null)
    const activeForm = {categories: t._category, photos: t._photo, users: t._user, posts: t._post}

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])

    useEffect(() => {
        if (!state.loading && !state.admin) {
            router.push('/')
        }
    }, [state.admin, state.loading])

    const fetchEntity = async (entity: Entity) => {
        const response = await fetch(`/smf/admin/${entity}`)
        const data = await response.json()
        switch (entity) {
            case 'categories': setCategories(data); break
            case 'photos': setPhotos(data); break
            case 'users': setUsers(data); break
            case 'posts': setPosts(data); break
        }
    }

    useEffect(() => {
        fetchEntity('categories')
    }, [refreshCategories])

    useEffect(() => {
        fetchEntity('photos')
    }, [refreshPhotos])

    useEffect(() => {
        fetchEntity('users')
    }, [refreshUsers])

    useEffect(() => {
        fetchEntity('posts')
    }, [refreshPosts])


    const handleShow = (edit: boolean) => {
        if (categories !== null && photos !== null && users !== null) {
            setEditForm(edit)
            setShowForm(true)
        }
    }

    const handleEdit = (item: Item) => {
        if (categories !== null && photos !== null && users !== null) {
            setCurrentIten(item)
            handleShow(true)
        }
    }

    const handleDelete = async (item: Item) => {
        let entity:string
        switch (activeTab){
            case 'categories':  entity = 'category'; break
            case 'photos': entity = 'photo'; break
            case 'users': entity = 'user'; break
            case 'posts': entity = 'post'; break
        }
        const response = await fetch(`/smf/admin/${entity}/delete/${item.id}`, {method: 'GET'})
        const token = await response.text()
        fetch(`/smf/admin/${entity}/delete/${item.id}`,
        {method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: new URLSearchParams({_token: token}).toString(),
        }).then(response => {
            if (response.ok) {
                handleRefresh()
            }
        })
    }

    const handleClick = (tab: Entity) => {
        if (tab != activeTab) {
            setActiveTab(tab)
        }
    }

    const handleRefresh = () => {
        setShowForm(false)
        setCurrentIten(null)
        switch (activeTab) {
            case 'categories': setRefreshCategories(!refreshCategories); break
            case 'photos': setRefreshPhotos(!refreshPhotos); break
            case 'users': setRefreshUsers(!refreshUsers); break
            case 'posts': setRefreshPosts(!refreshPosts); break
        }
    }

    const getTab = () => {
        const editClicked = (item: Item) => handleEdit(item);
        const deleteClicked = (item: Item) => handleDelete(item);
        switch (activeTab) {
            case 'categories':
                return <CategoriesList categories={
                        categories
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    translation={t}/>
            case 'photos':
                return <PhotosList photos={
                        photos
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    translation={t}/>
            case 'users':
                return <UsersList users={
                        users
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    translation={t}/>
            case 'posts':
                return <PostsList posts={posts}
                    deleteClicked={deleteClicked}
                    translation={t}/>
            default:
                return <Spinner animation="border" role="status" variant="success">
                    <span className="sr-only">Loading...</span>
                </Spinner>
        }
    }

    const getForm = () => {
        switch (activeTab) {
            case 'categories':
                return <CategoryForm category={
                        currentItem as Category
                    }
                    edit={editForm}
                    refresh={() => handleRefresh()}
                    users={users as Array<User>}
                    translation={t}/>
            case 'photos':
                return <PhotoForm photo={
                        currentItem as Photo
                    }
                    edit={editForm}
                    refresh={() => handleRefresh()}
                    categories={categories as Array<Category>}
                    translation={t}/>
            case 'users':
                return <UserForm user={
                        currentItem as User
                    }
                    edit={editForm}
                    refresh={() => handleRefresh()}
                    translation={t}/>
            case 'posts':
                return <PostForm users={users as Array<User>}
                        translation={t}
                        refresh={() => handleRefresh()}/>
            default:
                return <></>;
        }

    }

    if (state.loading || !state.admin) {
        return <></>
    } else {
        return <>
                <h1 className="text-center">{t._dashboard}</h1>
                <Navbar expand="md" variant="dark" collapseOnSelect>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" variant="pills" justify defaultActiveKey="categories">
                            <Nav.Item>
                                <Nav.Link eventKey="categories"
                                    onSelect={
                                        () => handleClick("categories")
                                }>{t._categories}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="photos"
                                    onSelect={
                                        () => handleClick("photos")
                                }>{t._photos}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="posts"
                                    onSelect={
                                        () => handleClick("posts")
                                }>{t._posts}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="users"
                                    onSelect={
                                        () => handleClick("users")
                                }>{t._users}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            <Button className="mr-2" variant="outline-success"
                                onClick={
                                    handleRefresh
                            }>{t._refresh}</Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="outline-info"
                                onClick={
                                    () => handleShow(false)
                            }>{t._new}</Button>
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Container className="main-content">
                    {
                    getTab()
                }</Container>
                <Modal className="custom-form" size="lg"
                    show={
                        showForm
                    }
                    onHide={() => {
                        setShowForm(false); setCurrentIten(null)
                    }}>
                    <Modal.Header closeButton>
                        {activeForm[activeTab]}
                    </Modal.Header>
                    <Modal.Body> {
                        getForm()
                    } </Modal.Body>
                </Modal>
        </>
    }
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'en'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    const dashboardT = getTranslation('dashboard', locale)
    return {
        props: {commonT, dashboardT},
    }
}

export default Dashboard
