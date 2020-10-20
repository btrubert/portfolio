import React, {useState} from 'react';
import {Container, Row, Col} from 'react-bootstrap';
import {Navbar, Nav} from 'react-bootstrap';
import {Button} from 'react-bootstrap';
import {Switch, Route, Link} from 'react-router-dom';
import PhotosList from './PhotosList';
import PostsList from './PostsList';
import UsersList from './UsersList';
import CategoriesList from './CategoriesList'

export default class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab: "categories",
            loading: true,
            filterBy: "id",
            asc: true,
            data: null
        };
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
        if (!this.state.loading) {
            switch (this.state.activeTab) {
                case "photos":
                    return <PhotosList photos={
                        this.state.data
                    }/>;
                case "posts":
                    return <PostsList/>;
                case "categories":
                    return <CategoriesList categories={
                        this.state.data
                    }/>
                case "users":
                    return <UsersList/>
                default:
                    return <></>;
            }
        }
        return <></>
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
                                <Nav.Link eventKey="users">Users</Nav.Link>
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
                            <Button variant="outline-info">New</Button>
                        </Nav.Item>
                    </Nav>
                </Navbar>
                <Container className="main-content">
                    {
                    this.getTab()
                }</Container>
            </Container>
        );
    }
}
