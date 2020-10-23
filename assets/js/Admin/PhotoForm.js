import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';


export default class PhotoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.photo ? props.photo.title : "",
            description: props.photo ? props.photo.description : "",
            category: props.photo ? props.photo.category.id : "-1",
            validated: false,
            edit: props.edit,
            id: props.photo ? props.photo.id : null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.fileInput = React.createRef();
        this.categories = props.categories;
    }

    handleChange(event) {
        const target = event.currentTarget;
        const value = target.value;
        const name = target.name;
        this.setState({[name]: value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const form = event.currentTarget;;
        console.log(form);
        if (form.checkValidity() === true) {
            // this.setState({validated: true});
            let formData = new FormData(form);
            // formData.append('path', this.fileInput.current.files[0]);
            fetch("/admin/dashboard/photos/" + (
                this.state.edit ? "edit/" + this.state.id : "new"
            ), {
                method: 'POST',
                headers: {
                    enctype: "multipart/form-data"
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
                    <Form.Group controlId="validationCustomTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control required name="title" type="text" placeholder="Photo's titlte"
                            value={
                                this.state.title
                            }
                            onChange={
                                this.handleChange
                            }/>
                        <Form.Control.Feedback type="invalid">
                            Please enter a photo title.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationCustomDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" type="text" placeholder="Description"
                            value={
                                this.state.description
                            }
                            onChange={
                                this.handleChange
                            }/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationCustomFile">
                        <Form.Label>File</Form.Label>
                        <Form.Control required name="path" type="file"
                            ref={
                                this.fileInput
                            }
                            disabled={
                                this.state.edit
                            }/>
                        <Form.Control.Feedback type="invalid">
                            Please select a photo.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationCustomCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control required name="category" as="select" custom
                            defaultValue={
                                this.state.category
                            }
                            value={
                                this.state.category
                            }
                            onChange={
                                this.handleChange
                        }>
                            <option hidden value="-1">Choose a category</option>
                            {
                            this.categories.map(c => <option value={
                                c.id
                            }>
                                {
                                c.name
                            }</option>)
                        } </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please select a category.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Button type="submit">Save Photo</Button>
            </Form>
        );
    }
}
