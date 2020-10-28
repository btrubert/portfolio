import React from "react";
import Form from 'react-bootstrap/Form';
import {Formik} from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap/';



export default function PhotoForm(props) {

    const formRef = React.createRef();

    const schema = yup.object({
        title: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        description: yup.string(),
        category: yup.number().required().min(0, "You must choose a category"),
        path: yup.mixed().required("You must select a photo")
    });

    const handleSubmitForm = () => {
        let formData = new FormData(formRef.current);
        fetch("/admin/dashboard/photos/" + (
        props.edit ? "edit/" + props.photo.id : "new"
    ), {
            method: 'POST',
            headers: {
                enctype: "multipart/form-data"
            },
            body: formData
        });

    };


    return (
        <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    title: props.photo ? props.photo.title : "",
                    description: props.photo ? props.photo.description || "" : "",
                    category: props.photo ? props.photo.category.id : "-1",
                    path: props.photo? props.photo.path : "",
                }
        }>
            {({
                handleSubmit,
                handleChange,
                values,
                errors,
                isSubmitting
            }) => <Form noValidate
                onSubmit={handleSubmit} ref={formRef}>
                <Form.Row>
                    <Form.Group controlId="validationFormikTitle" as={Col}>
                        <Form.Label>Title</Form.Label>
                        <Form.Control name="title" type="text" placeholder="Photo's title"
                            value={
                                values.title
                            }
                            isInvalid={
                                !!errors.title
                            }
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.title
                        } </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationFormikDescription" as={Col}>
                        <Form.Label>Description</Form.Label>
                        <Form.Control name="description" type="text" placeholder="Description"
                            value={
                                values.description
                            }
                            onChange={handleChange}/>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationFormikFile" as={Col}>
                        <Form.Label>Photo</Form.Label>
                        <Form.Control name="path" type="file"
                            onChange={
                                (event) => {
                                    setFieldValue("path", event.currentTarget.files[0]);
                                }
                            }
                            disabled={
                                props.edit
                            }
                            isInvalid={
                                !!errors.path
                            }
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.path
                        } </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationFormikCategory" as={Col}>
                        <Form.Label>Category</Form.Label>
                        <Form.Control name="category" as="select" custom
                            value={
                                values.category
                            }
                            isInvalid={
                                !!errors.category
                            }
                            onChange={handleChange}>
                            <option hidden value="-1">Choose a category</option>
                            {
                            props.categories.map(c => <option value={
                                c.id
                            }>
                                {
                                c.name
                            }</option>)
                        } </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.category
                        } </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Button type="submit"
                    disabled={isSubmitting}>Save Photo</Button>
            </Form>}
        </Formik>
    );
}
