import React, { useState } from 'react'
import { useSession } from 'utils/SessionContext'
import { useRouter } from 'next/router'
import ResetPassword from './ResetPassword'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {Formik} from 'formik'
import * as yup from 'yup'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'
import { useTranslation } from 'utils/TranslationContext'


interface FormValues {
    username: string,
    password: string,
    _remember_me: boolean,
}

export default function Login() {
    const [state, ] = useSession()
    const [trans, ] = useTranslation()
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<string>("warning")
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [passwordForm, setPasswordForm] = useState<boolean>(false)
    const router = useRouter()

    const schema = yup.object({
        username: yup.string().required(trans.common._required),
        password: yup.string().required(trans.common._required),
        _remember_me: yup.boolean()})

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
                throw new Error(trans.common._verify_login)
            }
        }).then(data => {
            const prefix = router.locale === 'en'? '/en': ''
            setSubmitting(false)
            setMessageAlert(trans.common._connected)
            setVariantAlert("success")
            setShowAlert(true)
            setTimeout(() => {window.location.assign(prefix+data)}, 1000)
        }).catch(error => {
            setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(error + "")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        })
    }

    if (passwordForm) {
        return <ResetPassword toggleBack={() => setPasswordForm(false)}/>
    } else {
        return <Formik validationSchema={schema}
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
                            <Form.Label srOnly>{trans.common._username}</Form.Label>
                            <Form.Control required name="username" type="text" placeholder={trans.common._username} autoComplete="username"
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
                            <Form.Label srOnly>{trans.common._password}</Form.Label>
                            <Form.Control required name="password" type="password" placeholder={trans.common._password} autoComplete="password"
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
                    <Row>
                        <Col>
                            <div className="triggerLink" onClick={() => setPasswordForm(true)}>{trans.common._forgotten_password}</div>
                        </Col>
                    </Row>
                    <Form.Row>
                        <Col xs="12">
                            <Form.Label srOnly>{trans.common._remember_me}</Form.Label>
                            <Form.Check type="checkbox" name="_remember_me" label={trans.common._remember_me}
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
                                        <span className="sr-only">{trans.common._loading}</span>
                                    </Spinner>
                                </Popover.Content>
                                </Popover>
                            }
                            >
                            <Button type="submit" disabled={isSubmitting || submitting}>{trans.common._login}</Button>
                        </OverlayTrigger>
                    </Col>
                    <Col sm={{ span: 7, offset: 1 }}>
                        <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                    </Col>
                    </Form.Row>
                </Form>}
            </Formik>
    }
}
