import React, { useState, useRef } from 'react'
import { useSession } from 'utils/SessionContext'
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import * as yup from 'yup'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import { mdiAccountCircle } from '@mdi/js'

interface Props {
    translation: {[key: string]: string},
}

interface FormValues {
    firstName: string,
    lastName: string,
    email: string,
    modifyPassword: boolean,
    username: string,
    password: string,
    passwordConfirmation: string,
}

function Edit (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)
    const [state, dispatch] = useSession()
    const [edit, setEdit] = useState<boolean>(false)

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const t = props.translation
    const max_text = 255
    const max_username = 180
    const schema = yup.object({
        firstName: yup.string().required(t._required).max(max_text, t._max_char_error),
        lastName: yup.string().required(t._required).max(max_text, t._max_char_error),
        email: yup.string().required(t._required).email(t._invalid_email).max(max_text, t._max_char_error),
        username: yup.string().required(t._required).matches(/^[a-zA-Z0-9]+$/, t._only_char_number_error).max(max_username, t._max_char_error),
        modifyPassword: yup.boolean(),
        password: yup.string().when("modifyPassword", {is: true, then : yup.string().required(t._required).min(8, t._min_password_error).max(32, t._max_password_error), otherwise: yup.string().nullable()}),
        passwordConfirmation: yup.string().when("modifyPassword", {is: true, then: yup.string().required(t._required).oneOf([yup.ref("password")], t._matching_password_error), otherwise: yup.string().nullable()}),
    });

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(false)
        let token = ""
        await fetch("/api/profile/edit", {method: "GET"})
        .then(response => {return response.text()}).then(data => {token = data})
        let formData: {[key:string]: string} = {_token: token, username: values.username, email: values.email, firstName: values.firstName, lastName: values.lastName}
        if (values.modifyPassword) {
            formData.password = values.password
        }
        fetch("/api/profile/edit", {
            method:'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(t._error_form)
            }
        }).then(data => {
                setSubmitting(false)
                setMessageAlert(data)
                setVariantAlert("success")
                setShowAlert(true)
                setEdit(false)
                dispatch({
                    type: 'setSession',
                    payload: {
                        username: values.username,
                        firstName: values.firstName,
                        lastName: values.lastName,
                        email: values.email,
                        token: state.token,
                    }
                })
                setTimeout(()=>setShowAlert(false),3000)
            })
        .catch(error =>  {
            setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(error+"")
            setShowAlert(true)
            setTimeout(()=>setShowAlert(false),3000)
        });
    }

    return <>
    <Row>
        <Col className="text-center mb-3">
            <Icon path={mdiAccountCircle} color="white" size={3} />
        </Col>
    </Row>
    <Row>
        <Col sm={{ offset: 3, span: 6 }}>
            <Formik validationSchema={schema}
                        onSubmit={handleSubmitForm}
                        validateOnBlur={false}
                        validateOnChange={false}
                        enableReinitialize
                        initialValues={
                            {
                                firstName: !state.loading ? state.firstName : "",
                                lastName: !state.loading ? state.lastName : "",
                                email: !state.loading ? state.email : "",
                                username: !state.loading ? state.username : "",
                                modifyPassword: false,
                                password: "",
                                passwordConfirmation: "",
                            }
                    }>{({
                        handleSubmit,
                        handleChange,
                        handleReset,
                        values,
                        errors
                    }) => <Form noValidate
                            onSubmit={handleSubmit}
                            ref={formRef}>
                            <Row>
                                <Col className="text-center mb-3">
                                    <Button variant="outline-success" onClick={() => {setEdit(!edit); handleReset()}}>{edit? t._cancel : t._edit}</Button>
                                </Col>
                            </Row>
                            <Form.Row>
                                <Form.Group controlId="validationFormikFirstName" as={Col}>
                                    <Row>
                                        <Form.Label className="profileLabel" srOnly={edit} column>{t._first_name}</Form.Label>
                                        <Col>
                                            <Form.Control required name="firstName" type="text" placeholder={t._first_name}
                                                value={
                                                    values.firstName
                                                }
                                                isInvalid={!!errors.firstName}
                                                onChange={handleChange}
                                                maxLength={max_text}
                                                readOnly={!edit} plaintext={!edit}/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.firstName}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <Form.Group controlId="validationFormiklastName" as={Col}>
                                    <Row>
                                        <Form.Label className="profileLabel" srOnly={edit} column>{t._last_name}</Form.Label>
                                        <Col>
                                            <Form.Control required name="lastName" type="text" placeholder={t._last_name}
                                                value={
                                                    values.lastName
                                                }
                                                isInvalid={!!errors.lastName}
                                                onChange={handleChange}
                                                maxLength={max_text}
                                                readOnly={!edit} plaintext={!edit}/>
                                            <Form.Control.Feedback type="invalid">
                                                {errors.lastName}
                                            </Form.Control.Feedback>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Form.Row>
                                <Form.Group controlId="validationFormikEmail" as={Row}>
                                    <Form.Label className="profileLabel" srOnly={edit} column>{t._email}</Form.Label>
                                    <Col>
                                    <Form.Control required name="email" type="email" placeholder={t._email}
                                        value={
                                            values.email
                                        }
                                        isInvalid={!!errors.email}
                                        onChange={handleChange}
                                        maxLength={max_text}
                                        readOnly={!edit} plaintext={!edit}/>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                    </Col>
                                </Form.Group>
                            <Form.Group controlId="validationFormikUsername" as={Row}>
                                <Form.Label className="profileLabel" srOnly={edit} column>{t._username}</Form.Label>
                            <Col>
                                <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text hidden={!edit}>@</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control required name="username" type="text" placeholder={t._username}
                                            value={
                                                values.username
                                            }
                                            isInvalid={!!errors.lastName}
                                            onChange={handleChange}
                                            maxLength={max_username}
                                            readOnly={true} plaintext={!edit}/>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastName}
                                        </Form.Control.Feedback>
                                    </InputGroup>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="validationFormikModifyPassword" as={Row} hidden={!edit}>
                                <Col>
                                <Form.Label srOnly>{t._modify_password}</Form.Label>
                                <Form.Check type="switch" name="modifyPassword" label={t._modify_password}
                                    checked={
                                        values.modifyPassword
                                    }
                                    onChange={
                                        handleChange
                                    }/>
                                    </Col>
                            </Form.Group>
                            <Form.Group controlId="validationFormikPassword1" as={Row} hidden={!edit || !values.modifyPassword}>
                                <Col>
                                <Form.Label srOnly>{t._new_password}</Form.Label>
                                <Form.Control required name="password" type="password" placeholder={t._new_password}
                                    value={
                                        values.password
                                    }
                                    isInvalid={!!errors.password}
                                    onChange={handleChange}/>
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Form.Group controlId="validationFormikPassword2" as={Row} hidden={!edit || !values.modifyPassword}>
                                <Col>
                                <Form.Label srOnly>{t._confirm_password}</Form.Label>
                                <Form.Control required name="passwordConfirmation" type="password" placeholder={t._confirm_password}
                                    value={
                                        values.passwordConfirmation
                                    }
                                    isInvalid={!!errors.passwordConfirmation}
                                    onChange={handleChange}/>
                                <Form.Control.Feedback type="invalid">
                                    {errors.passwordConfirmation}
                                </Form.Control.Feedback>
                                </Col>
                            </Form.Group>
                            <Row>
                                <Col md={4} xs={6} hidden={!edit}>
                                    <OverlayTrigger
                                        key="savedPop"
                                        show={submitting}
                                        placement="right"
                                        overlay={
                                            <Popover id="savedPop">
                                            <Popover.Content>
                                                <Spinner animation="border" role="status" variant="success">
                                                    <span className="sr-only">{t._loading}</span>
                                                </Spinner>
                                            </Popover.Content>
                                            </Popover>
                                        }
                                        >
                                        <Button type="submit" disabled={submitting}>{t._save}</Button>
                                    </OverlayTrigger>
                                </Col>
                                <Col className="text-right" md={{span: 4, offset: 4}} xs={6} hidden={submitting || showAlert || !edit}>
                                    <Button type="button" onClick={handleReset}>{t._reset}</Button>
                                </Col>
                                <Col xs={8}>
                                    <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                                </Col>
                            </Row>
                        </Form>}
                    </Formik>
                </Col>
            </Row>
        </>
}

export default Edit