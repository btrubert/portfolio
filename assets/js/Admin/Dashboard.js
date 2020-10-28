import React from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Navbar, Nav} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import PhotosList from './PhotosList';
import PostsList from './PostsList';
import UsersList from './UsersList';
import CategoriesList from './CategoriesList';
import PhotoForm from './PhotoForm';
import CategoryForm from './CategoryForm';
import UserForm from './UserForm';
import {Modal} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "categories",
            filterBy: "id",
            asc: true,
            categories: null,
            photos: null,
            users: null,
            showForm: false,
            activeForm: "Category",
            formType: "",
            currentItem: null
        };
    }

    handleShow(type) {
        if (this.state.categories && this.state.photos && this.state.users) {
            this.setState({showForm: true, formType: type});
        }
    }

    handleClose() {
        this.setState({showForm: false, currentItem: null, edit: false});
    }

    handleEdit(item) {
        if (this.state.categories && this.state.photos && this.state.users) {
            this.setState({currentItem: item, edit: true});
            this.handleShow("Edit");
        }
    }

    handleDelete(item) {
        fetch("/admin/dashboard/" + this.state.activeTab + "/delete/" + item.id, {method: 'DELETE'}).then(response => {
            return response.json();
        });
    }

    handleClick(tab) {
        if (tab != this.state.activeTab) {
            switch (tab) {
                case "photos":
                    this.setState({activeForm: "Photo"});
                    break;
                case "categories":
                    this.setState({activeForm: "Category"});
                    break;
                case "posts":
                    this.setState({activeForm: "Post"});
                    break;
                case "users":
                    this.setState({activeForm: "User"});
                    break;
            }
            this.setState({activeTab: tab, filterBy: "id", asc: true});
        }
    }

    handleRefresh() {
        fetch("/admin/dashboard/" + this.state.activeTab).then(response => {
            return response.json();
        }).then(data => this.setState({[this.state.activeTab]: data}));
    }

    componentDidMount() {
        for (let tab of ["categories", "photos", "users"]) {
            fetch("/admin/dashboard/"+tab).then(response => {
                return response.json();
            }).then(data => this.setState({[tab]: data}));
        }
    }

    getTab() {
        const editClicked = (item) => this.handleEdit(item);
        const deleteClicked = (item) => this.handleDelete(item);
        switch (this.state.activeTab) {
            case "photos":
                return <PhotosList photos={
                        this.state.photos
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={this.handleRefresh}/>;
            case "posts":
                return <PostsList posts={
                        this.state.posts
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={this.handleRefresh}/>;
            case "categories":
                return <CategoriesList categories={
                        this.state.categories
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={this.handleRefresh}/>
            case "users":
                return <UsersList users={
                        this.state.users
                    }
                    editClicked={editClicked}
                    deleteClicked={deleteClicked}
                    refresh={this.handleRefresh}/>
            default:
                return <Spinner animation="border" role="status" variant="success">
                    <span className="sr-only">Loading...</span>
                </Spinner>;
        }
    }

    getForm() {
        switch (this.state.activeTab) {
            case "photos":
                return <PhotoForm photo={
                        this.state.currentItem
                    }
                    edit={
                        this.state.edit
                    }
                    refresh={this.handleRefresh}
                    categories={this.state.categories}/>;
            case "posts":
                return <PostForm post={
                        this.state.currentItem
                    }
                    edit={
                        this.state.edit
                    }
                    refresh={this.handleRefresh}/>;
            case "categories":
                return <CategoryForm category={
                        this.state.currentItem
                    }
                    edit={
                        this.state.edit
                    }
                    refresh={this.handleRefresh}
                    users={this.state.users}/>;
            case "users":
                return <UserForm user={
                        this.state.currentItem
                    }
                    edit={
                        this.state.edit
                    }
                    refresh={this.handleRefresh}/>;
            default:
                return <></>;
        }

    }

    render() {
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
                                        () => this.handleClick("categories")
                                }>Categories</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="photos"
                                    onSelect={
                                        () => this.handleClick("photos")
                                }>Photos</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="posts" disabled
                                    onSelect={
                                        () => this.handleClick("posts")
                                }>Posts</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="users"
                                    onSelect={
                                        () => this.handleClick("users")
                                }>Users</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Navbar.Collapse>
                    <Nav className="justify-content-end">
                        <Nav.Item>
                            <Button className="mr-2" variant="outline-success"
                                onClick={
                                    this.handleRefresh.bind(this)
                            }>Refresh</Button>
                        </Nav.Item>
                        <Nav.Item>
                            <Button variant="outline-info"
                                onClick={
                                    () => this.handleShow("New")
                            }>New</Button>
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Container className="main-content">
                    {
                    this.getTab()
                }</Container>
                <Modal className="custom-form" size="sm"
                    show={
                        this.state.showForm
                    }
                    onHide={
                        this.handleClose.bind(this)
                }>
                    <Modal.Header closeButton>
                        {
                        this.state.formType + " " + this.state.activeForm
                    } </Modal.Header>
                    <Modal.Body> {
                        this.getForm()
                    } </Modal.Body>
                </Modal>
            </Container>
        );
    }
}
