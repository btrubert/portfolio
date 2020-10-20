import React, {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Navbar, Nav} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Switch, Route, Link} from 'react-router-dom';
import PhotosList from './PhotosList';
import PostsList from './PostsList';
import UsersList from './UsersList';
import CategoriesList from './CategoriesList';
import PhotoForm from './PhotoForm';
import CategoryForm from './CategoryForm';
import {Modal} from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "categories",
            loading: true,
            filterBy: "id",
            asc: true,
            data: null,
            showForm: false,
            activeForm: "Category",
            formType: "",
            currentItem: null
        };
    }

    handleShow(type) {
        this.setState({showForm: true, formType: type});
    }

    handleClose() {
        this.setState({showForm: false, currentItem: null});
    }

    handleEdit(item) {
        this.setState({currentItem: item});
        this.handleShow("Edit");
    }

    handleClick(tab) {
        if (tab != this.state.activeTab) {
            this.setState({loading: true});
            fetch("/admin/dashboard/" + tab).then(response => {
                return response.json();
            }).then(data => this.setState({
                data: data,
                loading: false,
                activeTab: tab,
                filterBy: "id",
                asc: true
            }));
            switch (this.state.activeTab) {
                case "photos": this.setState({activeForm: "Photo"});
                case "categories": this.setState({activeForm: "Category"});
                case "posts": this.setState({activeForm: "Post"});
                case "users": this.setState({activeForm: "User"});
            }
        }
    }

    handleRefresh() {
        fetch("/admin/dashboard/" + this.state.activeTab).then(response => {
            return response.json();
        }).then(data => this.setState({data: data, loading: false}));
    }

    componentDidMount() {
        fetch("/admin/dashboard/categories").then(response => {
            return response.json();
        }).then(data => this.setState({data: data, loading: false}));
    }

    getTab() {
        const editClicked = (item) => this.handleEdit(item);
        switch (this.state.activeTab) {
            case "photos":
                return <PhotosList photos={
                        this.state.data
                    }
                    editClicked={editClicked}/>;
            case "posts":
                return <PostsList/>;
            case "categories":
                return <CategoriesList categories={
                        this.state.data
                    }
                    editClicked={editClicked}/>
            case "users":
                return <UsersList editClicked={editClicked}/>
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
                }/>;
            case "posts":
                return <PostsForm post={
                    this.state.currentItem
                }/>;
            case "categories":
                return <CategoryForm category={
                    this.state.currentItem
                }/>
            case "users":
                return <UsersForm user={
                    this.state.currentItem
                }/>
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
                                <Nav.Link eventKey="posts"
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
