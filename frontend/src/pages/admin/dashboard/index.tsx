import React, {useState, useEffect} from 'react'
import { useRouter } from 'next/router'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import {useSession} from '../../../utils/SessionContext'
import {Container, Row, Col} from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import {Button} from 'react-bootstrap'
import PhotosList from '../../../components/dashboard/PhotosList'
import PhotoForm from '../../../components/dashboard/forms/PhotoForm'
import UsersList from '../../../components/dashboard/UsersList'
import UserForm from '../../../components/dashboard/forms/UserForm'
import CategoriesList from '../../../components/dashboard/CategoriesList'
import CategoryForm from '../../../components/dashboard/forms/CategoryForm'
import {Modal} from 'react-bootstrap'
import Spinner from 'react-bootstrap/Spinner'

type Item = Category | Photo | User
type Entity = 'categories' | 'photos' | 'users'

function Dashboard () {
    const [loading, setLoading] = useState<boolean>(true)
    // Entity lists managment
    const [categories, setCategories] = useState<Array<Category> | null>(null)
    const [refreshCategories, setRefreshCategories] = useState<boolean>(true)
    const [photos, setPhotos] = useState<Array<Photo> | null>(null)
    const [refreshPhotos, setRefreshPhotos] = useState<boolean>(true)
    const [users, setUsers] = useState<Array<User> | null>(null)
    const [refreshUsers, setRefreshUsers] = useState<boolean>(true)

    // Form management
    const [activeTab, setActiveTab] = useState<Entity>('categories')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [activeForm, setActiveForm] = useState<'Category' | 'Photo' | 'User'>('Category')
    const [formType, setFormType] = useState<'New' | 'Edit'>('New')
    const [currentItem, setCurrentIten] = useState<Category | Photo | User | null>(null)

    const router = useRouter()
    const [state, dispatch] = useSession()

    useEffect(() => {
        if (!state.loading) {
            if (!state.admin) {
                router.push('/')
            } else {
                setLoading(false)
            }
        }
    }, [state.admin, state.loading])

    const fetchEntity = async (entity: Entity) => {
        const response = await fetch("/smf/admin/"+entity)
        const data = await response.json()
        switch (entity) {
            case 'categories': setCategories(data); setRefreshCategories(false); break
            case 'photos': setPhotos(data); setRefreshPhotos(false); break
            case 'users': setUsers(data); setRefreshUsers(false); break
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


    const handleShow = (type: 'New' | 'Edit') => {
        if (!refreshCategories && !refreshPhotos && !refreshUsers) {
            setFormType(type)
            setShowForm(true)
        }
    }

    const handleEdit = (item: Item) => {
        if (!refreshCategories && !refreshPhotos && !refreshUsers) {
            setCurrentIten(item)
            handleShow('Edit')
        }
    }

    const handleDelete = async (item: Item) => {
        let entity:string
        switch (activeTab){
            case 'categories':  entity = 'category'; break
            case 'photos': entity = 'photo'; break
            case 'users': entity = 'user'; break
        }
        const response = await fetch("/smf/admin/" + entity + "/delete/" + item.id, {method: 'GET'})
        const token = await response.text()
        fetch("/smf/admin/" + entity + "/delete/" + item.id,
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
            switch (tab) {
                case 'photos':
                    setActiveForm('Photo')
                    break
                case 'categories':
                    setActiveForm('Category')
                    break
                case 'users':
                    setActiveForm('User')
                    break
            }
            setActiveTab(tab)
        }
    }

    const handleRefresh = () => {
        setShowForm(false)
        setCurrentIten(null)
        switch (activeTab) {
            case 'categories': setRefreshCategories(true); break
            case 'photos': setRefreshPhotos(true); break
            case 'users': setRefreshUsers(true); break
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
                    refresh={handleRefresh}/>
            case 'photos':
                return <PhotosList photos={
                        photos
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={handleRefresh}/>
            case 'users':
                return <UsersList users={
                        users
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={handleRefresh}/>
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
                    edit={
                        formType === 'Edit'
                    }
                    refresh={() => handleRefresh()}
                    users={users as Array<User>}/>
            case 'photos':
                return <PhotoForm photo={
                        currentItem as Photo
                    }
                    edit={
                        formType === 'Edit'
                    }
                    refresh={() => handleRefresh()}
                    categories={categories as Array<Category>}/>
            case 'users':
                return <UserForm user={
                        currentItem as User
                    }
                    edit={
                        formType === 'Edit'
                    }
                    refresh={() => handleRefresh()}/>
            default:
                return <></>;
        }

    }

    if (loading) {
        return <></>
    } else {
        return (
            <Container className="main-content">
                <h2>Dashboard</h2>
                <Navbar expand="md" variant="dark" collapseOnSelect>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto" variant="pills" justify defaultActiveKey="categories">
                            <Nav.Item>
                                <Nav.Link eventKey="categories"
                                    onSelect={
                                        () => handleClick("categories")
                                }>Categories</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="photos"
                                    onSelect={
                                        () => handleClick("photos")
                                }>Photos</Nav.Link>
                            </Nav.Item>
                            {/* <Nav.Item>
                                <Nav.Link eventKey="posts" disabled
                                    onSelect={
                                        () => handleClick("posts")
                                }>Posts</Nav.Link>
                            </Nav.Item> */}
                            <Nav.Item>
                                <Nav.Link eventKey="users"
                                    onSelect={
                                        () => handleClick("users")
                                }>Users</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            <Button className="mr-2" variant="outline-success"
                                onClick={
                                    handleRefresh
                            }>Refresh</Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="outline-info"
                                onClick={
                                    () => handleShow("New")
                            }>New</Button>
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
                        {
                        formType + " " + activeForm
                    } </Modal.Header>
                    <Modal.Body> {
                        getForm()
                    } </Modal.Body>
                </Modal>
            </Container>
        )
    }
}

export default Dashboard
