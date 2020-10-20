import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';


export default class PhotoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            isPublic: false,
            initialValues: null,
            validated: false
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
            fetch("/admin/category/new", {
                method: 'POST',
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(
                    {'name': this.state.name, 'public': this.state.isPublic}
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
                    <Form.Group controlId="validationCustomName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required name="name" type="text" placeholder="Category's name"
                            value={
                                this.state.name
                            }
                            onChange={
                                this.handleChange
                            }/>
                        <Form.Control.Feedback type="invalid">
                            Please enter a category name.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Check type="checkbox" name="isPublic" label="Make this category public ?"
                        checked={
                            this.state.isPublic
                        }
                        onChange={
                            this.handleChange
                        }/>
                </Form.Row>
                <Button type="submit">Save Photo</Button>
            </Form>
        );
    }
}
