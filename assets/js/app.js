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
import {CookiesProvider} from 'react-cookie';
import {Container, Row, Col} from 'react-bootstrap';
import loader from 'sass-loader';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            loading: true
        };
    }

    componentDidMount() {
        fetch("/login").then(response => {
            return response.json();
        }).then(data => {
            this.setState({user: data.currentUser, loading: false})
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
                    }/>
                    <Switch>
                        <Route path="/profile"
                            component={Profile}/>
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
    <CookiesProvider>
        <App/>
    </CookiesProvider>,
    document.getElementById('root')
);
