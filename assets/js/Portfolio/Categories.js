import React from "react";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';

export default class Categories extends React.Component {
    constructor(props, context) {
        super(props, context);
        if (this.props.categories) {
            this.state = {
                categories: this.props.categories,
                loading: false
            };
        } else {
            this.state = {
                categories: null,
                loading: true
            };
        }
    }

    componentDidMount() {
        if (this.state.loading) {
            fetch("/api/categories").then(response => {
                return response.json();
            }).then(data => {
                this.setState({categories: data, loading: false});
            });
        }
    }

    render() {
        if (this.state.loading) {
            return <div>Loading...</div>;
        } else {
            return (
                <div> {
                    this.state.categories.map(c => <Link to={"/category/"+c.name}>{c.name}</Link>)
                } </div>
            );
        }
    }
}
