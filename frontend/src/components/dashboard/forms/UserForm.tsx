import React, {useState, useRef} from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import {Container, Row, Col, Button} from 'react-bootstrap/';
import {Formik} from 'formik';
import * as yup from 'yup';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert'


interface Props {
    user: User | null,
    edit: boolean,
    refresh:  () => void,
    adminUrl: string,
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

    const [showAlert, setShowAlert] = useState(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")

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

    const handleSubmitForm = async (values: FormValues, actions: any) => {
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
                throw new Error("verify your form info or try again later!");
            }
        }).then(data => {
                actions.setSubmitting(false);
                setMessageAlert(data);
                setVariantAlert("success");
                setShowAlert(true);
                setTimeout(props.refresh, 1000);
            })
        .catch(error =>  {
            actions.setSubmitting(false);
            setVariantAlert("danger");
            setMessageAlert(error+"");
            setShowAlert(true);
            setTimeout(()=>setShowAlert(false),3000);
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
                    passwordConfirmation: "",
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
                    <Form.Group controlId="validationFormikEmail" as={Row}>
                        <Col>
                        <Form.Control required name="email" type="email" placeholder="Email"
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
                        </Col>
                    </Form.Group>
                <Form.Group controlId="validationFormikModifyPassword" as={Row} hidden={!props.edit}>
                    <Col>
                    <Form.Check type="switch" name="modifyPassword" label="Modify password"
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
                        <Form.Control required name="password" type="password" placeholder={props.edit? "Enter new password" : "Password"}
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
                        <Form.Control required name="passwordConfirmation" type="password" placeholder="Confirm password"
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
                    <Form.Check type="switch" name="admin" label="Give this user admin rights ?"
                        checked={
                            values.admin
                        }
                        onChange={
                            handleChange
                        }/>
                        </Col>
                        </Form.Group>
                <Form.Row>
                <Col sm={4}>
                    <OverlayTrigger
                        key="savedPop"
                        show={isSubmitting}
                        placement="right"
                        overlay={
                            <Popover id="savedPop">
                            <Popover.Content>
                                <Spinner animation="border" role="status" variant="success">
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            </Popover.Content>
                            </Popover>
                        }
                        >
                        <Button type="submit" disabled={isSubmitting}>Save User</Button>
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
