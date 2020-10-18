import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            _remember_me: false,
            validated: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const target = event.currentTarget;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;;
        if (form.checkValidity() === true) {
            form.submit();
            this.setState({validated: true});
        }
    }

    render() {
        return (
            <Container>
                <Form validated={
                        this.state.validated
                    }
                    onSubmit={
                        this.handleSubmit
                    }
                    action="/login"
                    method="POST">
                    <Form.Row>
                        <Form.Group controlId="validationCustomUsername">
                            <Form.Control required name="username" type="text" placeholder="username" autoComplete="username"
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
                            <Form.Control required name="password" type="password" placeholder="password" autoComplete="current-password"
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
                            <Form.Check type="checkbox" name="_remember_me" label="Remember me"
                                checked={
                                    this.state._remember_me
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
            </Container>
        );
    }
}
