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
                    <Route path="/portfolio" component={Categories} />
                    <Route path="/blog" component={Blog} />
                    <Route path="/contact" component={Contact} />
                    <Route path="/category/:cat" component={Photos} />
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
