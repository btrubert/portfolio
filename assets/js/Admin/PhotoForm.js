import React from "react";
import Form from 'react-bootstrap/Form';
import {Formik} from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';


export default function PhotoForm(props) {

    const schema = yup.object({
        title: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters'),
        description: yup.string(),
        category: yup.number().required().min(0, "Required"),
        path: yup.string().required("Required")
    });

    const handleSubmitForm = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        console.log(form);
        form.validate();
        // if (form.checkValidity() === true) { // this.setState({validated: true});
        //     let formData = new FormData(form);
        //     // formData.append('path', this.fileInput.current.files[0]);
        //     fetch("/admin/dashboard/photos/" + (
        //     props.edit ? "edit/" + props.photo.id : "new"
        // ), {
        //         method: 'POST',
        //         headers: {
        //             enctype: "multipart/form-data"
        //         },
        //         body: formData
        //     });
        // }
    };


    return (
        <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            initialValues={
                {
                    title: props.photo ? props.photo.title : "",
                    description: props.photo ? props.photo.description : "",
                    category: props.photo ? props.photo.category.id : "-1",
                    path: props.photo ? props.photo.path : ""
                }
        }>
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                touched,
                isValid,
                errors,
                isSubmitting
            }) => <Form noValidate
            onSubmit={handleSubmit}>
                <Form.Row>
                        <Form.Group controlId="validationFormikTitle">
                            <Form.Label>Title</Form.Label>
                            <Form.Control name="title" type="text" placeholder="Photo's title"
                                value={
                                    values.title
                                }
                                isInvalid={
                                    !!errors.title
                                }/>
                            <Form.Control.Feedback type="invalid">
                                {
                                errors.title
                            } </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="validationFormikDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control name="description" type="text" placeholder="Description"
                                value={
                                    values.description
                                }/>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="validationFormikFile">
                            <Form.Label>Photo</Form.Label>
                            <Form.Control name="path" type="file"
                                value={
                                    values.path
                                }
                                disabled={
                                    props.edit
                                }
                                isInvalid={
                                    !!errors.path
                                }/>
                            <Form.Control.Feedback type="invalid">
                                {
                                errors.path
                            } </Form.Control.Feedback>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group controlId="validationFormikCategory">
                            <Form.Label>Category</Form.Label>
                            <Form.Control name="category" as="select" custom
                                value={
                                    values.category
                                }
                                isInvalid={
                                    !!errors.category
                            }>
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
