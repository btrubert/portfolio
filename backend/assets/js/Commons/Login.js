import React, {useState} from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';
import {Formik} from 'formik';
import * as yup from 'yup';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert'


export default function Login(props) {

    const formRef = React.createRef();

    const [showAlert, setShowAlert] = useState(false);
    const [variantAlert, setVariantAlert] = useState("warning");
    const [messageAlert, setMessageAlert] = useState("");

    const schema = yup.object({username: yup.string().required("Required"), password: yup.string().required("Required"), _remember_me: yup.boolean()});

    const handleSubmitForm = (values, actions) => {
        let formData = new FormData(formRef.current);
        formData.append("_csrf_token", props.token);
        fetch("/login", {
            method: 'POST',
            headers: {
                enctype: "multipart/form-data"
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("verify your login info or try again later!");
            }
        }).then(data => {
            actions.setSubmitting(false);
            setMessageAlert(data);
            setVariantAlert("success");
            setShowAlert(true);
            // setTimeout(redirect, 3000);
        }).catch(error => {
            actions.setSubmitting(false);
            setVariantAlert("danger");
            setMessageAlert(error + "");
            setShowAlert(true);
            setTimeout(() => setShowAlert(false), 3000);
        });
    }

        return (
            <Formik validationSchema={schema}
                onSubmit={handleSubmitForm}
                validateOnBlur={false}
                validateOnChange={false}
                initialValues={
                    {
                        username: "",
                        password: "",
                        _remember_me: true
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
                    <Form.Group controlId="validationFormikUsername"
                        as={Row}>
                        <Col>
                            <Form.Control required name="username" type="text" placeholder="username" autoComplete="username"
                                value={
                                    values.username
                                }
                                onChange={
                                    handleChange
                                }
                                isInvalid={
                                    !!errors.username
                                }/>
                            <Form.Control.Feedback type="invalid">
                                {
                                errors.username
                            } </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikPassword"
                        as={Row}>
                        <Col>
                            <Form.Control required name="password" type="password" placeholder="password" autoComplete="password"
                                value={
                                    values.password
                                }
                                onChange={
                                    handleChange
                                }
                                isInvalid={
                                    !!errors.password
                                }/>
                            <Form.Control.Feedback type="invalid">
                                {
                                errors.password
                            } </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Row>
                        <Col xs="12">
                            <Form.Check type="checkbox" name="_remember_me" label="Remember me"
                                checked={
                                    values._remember_me
                                }
                                onChange={
                                    handleChange
                                }/>
                        </Col>
                        </Form.Row>
                    <Form.Row>
                    <Col sm={4}>
                        <OverlayTrigger
                            key="login"
                            show={isSubmitting}
                            placement="right"
                            overlay={
                                <Popover id="login">
                                <Popover.Content>
                                    <Spinner animation="border" role="status" variant="success">
                                        <span className="sr-only">Loading...</span>
                                    </Spinner>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button type="submit" disabled={isSubmitting}>login</Button>
                        </OverlayTrigger>
                    </Col>
                    <Col sm={8}>
                        <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                    </Col>
                    </Form.Row>
                </Form>}
            </Formik>
        );

    }