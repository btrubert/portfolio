import React, {useState} from 'react'
import { GetServerSideProps } from 'next'
import { InferGetServerSidePropsType } from 'next'
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

function Dashboard (props: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const [categories, setCategories] = useState<Array<Category>>(props.categories)
    const [photos, setPhotos] = useState<Array<Photo>>(props.photos)
    const [users, setUsers] = useState<Array<User>>(props.users)
    const imgBaseUrl: string = props.imgBaseUrl
    const [activeTab, setActiveTab] = useState<'categories' | 'photos' | 'users'>('categories')
    const [showForm, setShowForm] = useState<boolean>(false)
    const [activeForm, setActiveForm] = useState<'Category' | 'Photo' | 'User'>('Category')
    const [formType, setFormType] = useState<'New' | 'Edit'>('New')
    const [currentItem, setCurrentIten] = useState<Category | Photo | User | null>(null)


    const handleShow = (type: 'New' | 'Edit') => {
        setFormType(type)
        setShowForm(true)
    }

    const handleEdit = (item: Item) => {
        setCurrentIten(item)
        handleShow('Edit');
    }

    const handleDelete = async (item: Item) => {
        const response = await fetch("/admin/delete/" + activeTab + "/" + item.id, {method: 'GET'})
        const token = response.text()
        fetch("/admin/delete/" + activeTab + "/" + item.id,
        {method: 'POST',
        headers: {'Content-type': 'application/json'},
        body: JSON.stringify({_token: token})}
        ).then(response => {
            if (response.ok) {
                handleRefresh();
            }
        });
    }

    const handleClick = (tab: 'categories' | 'photos' | 'users') => {
        if (tab != activeTab) {
            switch (tab) {
                case 'photos':
                    setActiveForm('Photo')
                    break;
                case 'categories':
                    setActiveForm('Category')
                    break;
                case 'users':
                    setActiveForm('User')
                    break;
            }
            setActiveTab(tab)
        }
    }

    const handleRefresh = () => {
        setShowForm(false)
        setCurrentIten(null)
        // fetch("/admin/dashboard/" + this.state.activeTab).then(response => {
        //     return response.json();
        // }).then(data => this.setState({[this.state.activeTab]: data}));
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
                    refresh={handleRefresh}/>;
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
                </Spinner>;
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
                    users={users}/>
            case 'photos':
                return <PhotoForm photo={
                        currentItem as Photo
                    }
                    edit={
                        formType === 'Edit'
                    }
                    refresh={() => handleRefresh()}
                    categories={categories}/>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
    let response = await fetch(process.env.SYMFONY_URL+"/admin/dashboard/categories")
    const categories: Array<Category> = await response.json()
    response = await fetch(process.env.SYMFONY_URL+"/admin/dashboard/photos")
    const photos: Array<Photo> = await response.json()
    response = await fetch(process.env.SYMFONY_URL+"/admin/dashboard/users")
    const users: Array<User> = await response.json()
    const imgBaseUrl: string = process.env.SYMFONY_URL + "/uploads/"

    return {
        props: {categories, photos, users, imgBaseUrl},
    }
}

export default Dashboard