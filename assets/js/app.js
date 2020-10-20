import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import '../css/app.scss';
import Menu from './Commons/Menu';
import Contact from './Commons/Contact';
import Home from './Commons/Home';
import Categories from './Portfolio/Categories';
import Blog from './Blog/Posts';
import Photos from './Portfolio/Photos';
import Post from './Blog/Post';
import Profile from './User/Profile';
import Dashboard from './Admin/Dashboard';
import {Container, Row, Col} from 'react-bootstrap';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            admin: false,
            loading: true
        };
    }

    componentDidMount() {
        fetch("/api/profile_info").then(response => {
            return response.json();
        }).then(data => {
            this.setState({user: data.user, admin: data.admin, loading: false})
        });
    }

    render() {
        if (this.state.loading) {
            return null;
        } else {
            return (
                <BrowserRouter>
                    <Menu user={
                        this.state.user
                    }   admin={
                        this.state.admin}/>
                    <Switch>
                        {
                            this.state.admin?
                            <Route path="/admin/dashboard"
                            component={() => <Dashboard user={this.state.user} />}/>
                            :
                            <Route path="/profile"
                            component={() => <Profile user={this.state.user} />}/>
                        }
                        <Route path="/gallery/:cat"
                            component={Photos}/>
                        <Route path="/gallery"
                            component={Categories}/>
                        <Route path="/blog/post/:id"
                            component={Post}/>
                        <Route path="/blog"
                            component={Blog}/>
                        <Route path="/contact"
                            component={Contact}/>
                        <Route path="/"
                            component={Home}/>
                    </Switch>
                </BrowserRouter>
            );
        }
    }

}

ReactDOM.render (
        <App/>,
    document.getElementById('root')
);
