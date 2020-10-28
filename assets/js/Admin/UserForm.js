import React from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {Container, Row, Col, Button} from 'react-bootstrap/';
import {Formik} from 'formik';
import * as yup from 'yup';


export default function UserForm (props) {

    const formRef = React.createRef();

    const schema = yup.object({
        firstName: yup.string().required("Required").matches(/^([a-zA-Z]+[ -_]?)+$/, 'Cannot contain numbers, special characters, or double space/dash'),
        lastName: yup.string().required("Required").matches(/^([a-zA-Z]+[ -_]?)+$/, 'Cannot contain numbers, special characters, or double space/dash'),
        email: yup.string().required("Required").email("Email invalid"),
        username: yup.string().required("Required").matches(/^[a-zA-Z0-9]+$/, 'Must contain only letters and numbers'),
        admin: yup.boolean(),
        modifyPassword: yup.boolean(),
        password: yup.string().when("modifyPassword", {is: true, then : yup.string().required("Required").min(8, "Must be at least 8 characters long").max(32, "Must be at most 32 characters long"), otherwise: yup.string().nullable()}),
        passwordConfirmation: yup.string().when("modifyPassword", {is: true, then: yup.string().required("Required").oneOf([yup.ref("password")], "Passwords must match"), otherwise: yup.string().nullable()}),
    });

    const handleSubmitForm = (values) => {
        let formData = new FormData(formRef.current);
        if (!values.modifyPassword){
            formData.delete("password");
        }
        formData.delete("modifyPassword");
        formData.delete("passwordConfirmation");
        fetch("/admin/dashboard/users/" + (
            props.edit ? "edit/" + props.user.id : "new"
        ), {
            method:'POST',
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
                    firstName: props.user ? props.user.firstName : "",
                    lastName: props.user ? props.user.lastName : "",
                    email: props.user ? props.user.email : "",
                    username: props.user ? props.user.username : "",
                    password: "",
                    admin: props.user ? props.user.admin : false,
                    modifyPassword: !props.edit,
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
                    <Form.Group controlId="validationFormikFirstName" as={Col}>
                        <Form.Control required name="firstName" type="text" placeholder="First name"
                            value={
                                values.firstName
                            }
                            isInvalid={!!errors.firstName}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.firstName}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="validationFormiklastName" as={Col}>
                        <Form.Control required name="lastName" type="text" placeholder="Last name"
                            value={
                                values.lastName
                            }
                            isInvalid={!!errors.lastName}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group controlId="validationFormikEmail" as={Col}>
                        <Form.Control required name="email" type="email" placeholder="Email"
                            value={
                                values.email
                            }
                            isInvalid={!!errors.email}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                   <Form.Group controlId="validationFormikUsername" as={Col}>
                   <InputGroup>
                        <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required name="username" type="text" placeholder="username"
                            value={
                                values.username
                            }
                            isInvalid={!!errors.lastName}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                        </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                </Form.Row>
                <Form.Row hidden={!props.edit}>
                <Form.Group controlId="validationFormikModifyPassword" as={Col}>
                    <Form.Check type="switch" name="modifyPassword" label="Modify password"
                        checked={
                            values.modifyPassword
                        }
                        onChange={
                            handleChange
                        }/>
                        </Form.Group>
                </Form.Row>
                <Form.Row hidden={!values.modifyPassword}>
                   <Form.Group controlId="validationFormikPassword1" as={Col}>
                        <Form.Control required name="password" type="password" placeholder={props.edit? "Enter new password" : "Password"}
                            value={
                                values.password
                            }
                            isInvalid={!!errors.password}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row hidden={!values.modifyPassword}>
                   <Form.Group controlId="validationFormikPassword2" as={Col}>
                        <Form.Control required name="passwordConfirmation" type="password" placeholder="Confirm password"
                            value={
                                values.passwordConfirmation
                            }
                            isInvalid={!!errors.passwordConfirmation}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.passwordConfirmation}
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                <Form.Group controlId="validationFormikAdmin" as={Col}>
                    <Form.Check type="switch" name="admin" label="Give this user admin rights ?"
                        checked={
                            values.admin
                        }
                        onChange={
                            handleChange
                        }/>
                        </Form.Group>
                </Form.Row>
                <Button type="submit"
                   >Save User</Button>
            </Form>}
            </Formik>
        );
}
