import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import '../css/app.css';
import Menu from './Commons/Menu';
import Contact from './Commons/Contact';
import Home from './Commons/Home';
import Categories from './Portfolio/Categories';
import Blog from './Blog/Posts';
import Photos from './Portfolio/Photos';
import Post from './Blog/Post';
import New from './Commons/New';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <BrowserRouter>
                <Menu/>
                <Switch>
                    <Route path="/new/:item" component={New} />
                    <Route path="/gallery/:cat" component={Photos} />
                    <Route path="/gallery" component={Categories} />
                    <Route path="/blog/post/:id" component={Post} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/" component={Home} />
                </Switch>
            </BrowserRouter>
        );
    }

}

ReactDOM.render (
    <App/>,
    document.getElementById('root')
);
