import React, { useState, useRef } from "react"
import Form from 'react-bootstrap/Form'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import * as yup from 'yup'
import FormButtons from './FormButtons'


interface Props {
    user: User | null,
    edit: boolean,
    refresh:  () => void,
    translation: {[key:string]: string},
}

interface FormValues {
    firstName: string,
    lastName: string,
    email: string,
    username: string,
    admin: boolean,
    modifyPassword: boolean,
    password: string,
    passwordConfirmation: string,
}

export default function UserForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null);

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const t = props.translation

    const schema = yup.object({
        firstName: yup.string().required(t._required).matches(/^([a-zA-Z0-9]+[ -_]?)+$/, t._special_char_error),
        lastName: yup.string().required(t._required).matches(/^([a-zA-Z0-9]+[ -_]?)+$/, t._special_char_error),
        email: yup.string().required(t._required).email("Email invalid"),
        username: yup.string().required(t._required).matches(/^[a-zA-Z0-9]+$/, t._only_char_number_error),
        admin: yup.boolean(),
        modifyPassword: yup.boolean(),
        password: yup.string().when("modifyPassword", {is: true, then : yup.string().required(t._required).min(8, t._min_password_error).max(32, t._max_password_error), otherwise: yup.string().nullable()}),
        passwordConfirmation: yup.string().when("modifyPassword", {is: true, then: yup.string().required(t._required).oneOf([yup.ref("password")], t._matching_password_error), otherwise: yup.string().nullable()}),
    });

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(false)
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        let token = ""
        await fetch("/smf/admin/user/" + (
            props.edit && props.user ? "edit/" + props.user.id : "new"
        ), {method: "GET"}).then(response => {return response.text()}).then(data => {token = data})
        formData.append("_token", token)
        if (!values.modifyPassword){
            formData.delete("password")
        }
        formData.delete("modifyPassword")
        formData.delete("passwordConfirmation")
        fetch("/smf/admin/user/" + (
            props.edit && props.user ? "edit/" + props.user.id : "new"
        ), {
            method:'POST',
            headers: {
                enctype: "multipart/form-data"
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(t._error_form);
            }
        }).then(data => {
                setSubmitting(false);
                setMessageAlert(data);
                setVariantAlert("success");
                setShowAlert(true);
                setTimeout(props.refresh, 1000);
            })
        .catch(error =>  {
            setSubmitting(false);
            setVariantAlert("danger");
            setMessageAlert(error+"");
            setShowAlert(true);
            setTimeout(()=>setShowAlert(false),3000);
        });
    }

   return <Formik validationSchema={schema}
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
                    passwordConfirmation: "",
                    admin: props.user ? props.user.admin : false,
                    modifyPassword: !props.edit,
                }
        }>{({
            handleSubmit,
            handleChange,
            handleReset,
            values,
            errors,
            isSubmitting
        }) => <Form noValidate
                onSubmit={handleSubmit}
                ref={formRef}>
                <Form.Row>
                    <Form.Group controlId="validationFormikFirstName" as={Col}>
                        <Form.Control required name="firstName" type="text" placeholder={t._first_name}
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
                        <Form.Control required name="lastName" type="text" placeholder={t._last_name}
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
                    <Form.Group controlId="validationFormikEmail" as={Row}>
                        <Col>
                        <Form.Control required name="email" type="email" placeholder={t._email}
                            value={
                                values.email
                            }
                            isInvalid={!!errors.email}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                   <Form.Group controlId="validationFormikUsername" as={Row}>
                       <Col>
                   <InputGroup>
                        <InputGroup.Prepend>
                        <InputGroup.Text>@</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control required name="username" type="text" placeholder={t._username}
                            value={
                                values.username
                            }
                            isInvalid={!!errors.lastName}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.lastName}
                        </Form.Control.Feedback>
                        </InputGroup>
                        </Col>
                    </Form.Group>
                <Form.Group controlId="validationFormikModifyPassword" as={Row} hidden={!props.edit}>
                    <Col>
                    <Form.Check type="switch" name="modifyPassword" label={t._modify_password}
                        checked={
                            values.modifyPassword
                        }
                        onChange={
                            handleChange
                        }/>
                        </Col>
                </Form.Group>
                <Form.Group controlId="validationFormikPassword1" as={Row} hidden={!values.modifyPassword}>
                    <Col>
                    <Form.Control required name="password" type="password" placeholder={props.edit? t._new_password : t._password}
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
                <Form.Group controlId="validationFormikPassword2" as={Row} hidden={!values.modifyPassword}>
                    <Col>
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
                <Form.Group controlId="validationFormikAdmin" as={Row}>
                    <Col>
                    <Form.Check type="switch" name="admin" label={t._admin_right}
                        checked={
                            values.admin
                        }
                        onChange={
                            handleChange
                        }/>
                        </Col>
                        </Form.Group>
                <Form.Row>
                <FormButtons isSubmitting={isSubmitting}
                            submitting={submitting}
                            showAlert={showAlert}
                            messageAlert={messageAlert}
                            variantAlert={variantAlert}
                            handleReset={handleReset}
                            translation={t}
                            type='user'/>
                </Form.Row>
            </Form>}
        </Formik>
}
