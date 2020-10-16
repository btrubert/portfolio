import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            rememberMe: false,
            validated: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.currentTarget;
        console.log(target);
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;;
        console.log(form);
        if (form.checkValidity() === true) {
            form.disabled
            this.setState({validated: true});
            fetch("/login", {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(
                    {'username': this.state.username, 'password': this.state.password, 'rememberme': this.state.rememberMe}
                )
            }).then(response => console.log(response));
        }
    }

    render() {
        return ( 
            <Form validated={
                    this.state.validated
                }
                onSubmit={
                    this.handleSubmit
            }>
                <Form.Row>
                    <Form.Group controlId="validationCustomUsername">
                        <Form.Control required name="username" type="text" placeholder="username" autocomplete="username"
                            value={
                                this.state.name
                            }
                            onChange={
                                this.handleChange
                            }/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationCustomPassword">
                        <Form.Control required name="password" type="password" placeholder="password" autocomplete="current-password"
                            value={
                                this.state.password
                            }
                            onChange={
                                this.handleChange
                            }/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Col xs="12">
                        <Form.Check type="checkbox" name="rememberMe" label="Remember me"
                            checked={
                                this.state.rememberMe
                            }
                            onChange={
                                this.handleChange
                            }/>
                    </Col>
                    <Col>
                        <Button type="submit">Login</Button>
                    </Col>
                </Form.Row>
            </Form>
        );
    }
}
