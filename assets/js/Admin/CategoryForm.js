import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';


export default class CategoryForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: props.category ? props.category.name : "",
            isPublic: props.category ? props.category.public : false,
            edit: props.edit,
            id: props.category ? props.category.id : null,
            user: null,
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
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            form.disabled
            this.setState({validated: true});
            let formData = new FormData(form);
            fetch("/admin/dashboard/categories/" + (
            this.state.edit ? "edit/" + this.state.id : "new"
        ), {
                method: (this.state.edit ? 'POST' : 'POST'),
                headers: {
                    enctype: "multipart/form-data",
                },
                body: formData
            });
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
                <Form.Row> {/* TODO add user */} </Form.Row>
                <Button type="submit">Save Category</Button>
            </Form>
        );
    }
}
