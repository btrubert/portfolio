import React from "react";
import {Helmet} from "react-helmet";
import {Link} from 'react-router-dom';
import {Container, Row, Col, Image} from 'react-bootstrap/';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import {ThemeConsumer} from "react-bootstrap/esm/ThemeProvider";


export default class New extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Category's name",
            isPublic: false,
            initialValues: null
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        fetch("/category/new", {
            method: 'POST',
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            status: "submitted",
            body: JSON.stringify(
                {'name': this.state.name, 'public': this.state.isPublic}
            )
        }).then(response => console.log(response));
    }

    render() {
        return (
            <form onSubmit={
                this.handleSubmit
            }>
                <label>
                    Name:
                    <input type="text" name="name"
                        value={
                            this.state.name
                        }
                        onChange={
                            this.handleChange
                        }/>
                </label>
                <label>
                    Public ?
                    <input type="checkbox" name="isPublic"
                        checked={
                            this.state.isPublic
                        }
                        onChange={
                            this.handleChange
                        }/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        );
    }
}
