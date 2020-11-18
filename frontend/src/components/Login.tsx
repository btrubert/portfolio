import React, {useState} from 'react'
import {useSession} from '../utils/SessionContext'
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/'
import {Formik} from 'formik'
import * as yup from 'yup'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'

interface FormValues {
    username: string,
    password: string,
    _remember_me: boolean,
}

export default function Login() {
    const [state, dispatch] = useSession()
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<string>("warning")
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const schema = yup.object({username: yup.string().required("Required"), password: yup.string().required("Required"), _remember_me: yup.boolean()})

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(true)
        let token = state.token
        fetch("/api/login", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: values.username,
                password: values.password,
                _remember_me: values._remember_me,
                _csrf_token: token
            })
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error("Verify your login info or try again later!")
            }
        }).then(data => {
            setSubmitting(false)
            setMessageAlert("Connected")
            setVariantAlert("success")
            setShowAlert(true)
            setTimeout(() => {window.location.assign(data)}, 1000);
        }).catch(error => {
            setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(error + "")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        })
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
                    isSubmitting,
                }) => <Form noValidate
                    onSubmit={handleSubmit}>
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
                            show={isSubmitting || submitting}
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
                            <Button type="submit" disabled={isSubmitting || submitting}>login</Button>
                        </OverlayTrigger>
                    </Col>
                    <Col sm={8}>
                        <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                    </Col>
                    </Form.Row>
                </Form>}
            </Formik>
        )

    }
