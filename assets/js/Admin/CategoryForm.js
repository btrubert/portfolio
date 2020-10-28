import React from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';
import {Formik} from 'formik';
import * as yup from 'yup';


export default function CategoryForm (props) {

    const formRef = React.createRef();

    const schema = yup.object({
        name: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        public: yup.boolean(),
        user: yup.number().when('public', {is: false, then:yup.number().required("Required").min(0, "Select a user"), otherwise: yup.number().nullable()}),
    });

    const handleSubmitForm = (values) => {
        let formData = new FormData(formRef.current);
        if (values.public){
            formData.delete("user");
        }
        fetch("/admin/dashboard/categories/" + (
            props.edit ? "edit/" + props.category.id : "new"
        ), {
            method:'POST',
            headers: {
                enctype: "multipart/form-data",
            },
            body: formData
        });
    }

   return (
       <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    name: props.category ? props.category.name : "",
                    public: props.category ? props.category.public : false,
                    user: props.category && props.category.user ? props.category.user.id : "",
                }
        }>{({
            handleSubmit,
            handleChange,
            values,
            errors,
            isSubmitting
        }) => <Form noValidate
                onSubmit={handleSubmit}
                ref={formRef}>
                <Form.Row>
                    <Form.Group controlId="validationFormikName">
                        <Form.Label>Name</Form.Label>
                        <Form.Control required name="name" type="text" placeholder="Category's name"
                            value={
                                values.name
                            }
                            isInvalid={!!errors.name}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group controlId="validationFormikIsPublic">
                    <Form.Check type="switch" name="public" label="Make this category public ?"
                        checked={
                            values.public
                        }
                        value={
                            values.public
                        }
                        isInvalid={
                            !!errors.public
                        }
                        onChange={
                            handleChange
                        }/>
                        <Form.Control.Feedback type="invalid">
                            {errors.public}
                        </Form.Control.Feedback>
                        </Form.Group>
                </Form.Row>
                <Form.Row hidden={values.public}>
                <Form.Group controlId="validationFormikUser">
                        <Form.Label>User</Form.Label>
                        <Form.Control name="user" as="select" custom
                            value={
                                values.user
                            }
                            isInvalid={
                                !!errors.user
                            }
                            onChange={handleChange}>
                            <option hidden value="">Choose a user</option>
                            {
                            props.users.map(u => <option value={
                                u.id
                            }>
                                {
                                u.username
                            }</option>)
                        } </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.user
                        } </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Button type="submit"
                    disabled={isSubmitting}>Save Category</Button>
            </Form>}
            </Formik>
        );
}
