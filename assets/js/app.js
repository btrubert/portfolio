import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import '../css/app.css';
import Menu from './Commons/components/Menu';
import Home from './Commons/components/Home';
import Categories from './Portfolio/containers/Categories';
import Blog from './Blog/containers/Posts';
import Contact from './Commons/components/Contact';
import Photos from './Portfolio/containers/Photos';

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
