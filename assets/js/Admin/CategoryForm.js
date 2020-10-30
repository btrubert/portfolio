import React, {useState} from "react";
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/';
import {Formik} from 'formik';
import * as yup from 'yup';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert'


export default function CategoryForm (props) {

    const formRef = React.createRef();

    const [showAlert, setShowAlert] = useState(false);
    const [variantAlert, setVariantAlert] = useState("warning");
    const [messageAlert, setMessageAlert] = useState("");

    const schema = yup.object({
        name: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        public: yup.boolean(),
        user: yup.number().when('public', {is: false, then:yup.number().required("Required").min(0, "Select a user"), otherwise: yup.number().nullable()}),
    });

    const handleSubmitForm = async (values, actions) => {
        let formData = new FormData(formRef.current);
        if (values.public){
            formData.delete("user");
        }
        let token = "";
        await fetch("/admin/dashboard/categories/" + (
            props.edit ? "edit/" + props.category.id : "new"
        ), {method: "GET"}).then(response => {return response.text()}).then(data => {token = data});
        formData.append("_token", token);
        fetch("/admin/dashboard/categories/" + (
            props.edit ? "edit/" + props.category.id : "new"
        ), {
            method:'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json()
            } else {
                throw new Error("verify your form info or try again later!");
            }
        }).then(data => {
                actions.setSubmitting(false);
                setMessageAlert(data);
                setVariantAlert("success");
                setShowAlert(true);
                setTimeout(props.refresh, 3000);
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
                    <Form.Group as={Row} controlId="validationFormikName">
                        <Col>
                        <Form.Control required name="name" type="text" placeholder="Category's name"
                            value={
                                values.name
                            }
                            isInvalid={!!errors.name}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                <Form.Group controlId="validationFormikIsPublic" as={Row}>
                    <Col>
                    <Form.Check type="switch" name="public" label="Make this category public ?"
                        checked={
                            values.public
                        }
                        onChange={
                            handleChange
                        }/>
                        </Col>
                </Form.Group>
                <Form.Group controlId="validationFormikUser" as={Row} hidden={values.public}>
                        <Col>
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
                        <Button type="submit" disabled={isSubmitting}>Save Category</Button>
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
