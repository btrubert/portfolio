import React, {useState} from "react";
import Form from 'react-bootstrap/Form';
import {Formik} from 'formik';
import * as yup from 'yup';
import Button from 'react-bootstrap/Button';
import {Container, Row, Col} from 'react-bootstrap/';
import Spinner from 'react-bootstrap/Spinner';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Alert from 'react-bootstrap/Alert'



export default function PhotoForm(props) {

    const formRef = React.createRef();

    const [showAlert, setShowAlert] = useState(false);
    const [variantAlert, setVariantAlert] = useState("warning");
    const [messageAlert, setMessageAlert] = useState("");

    const schema = yup.object({
        title: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        description: yup.string(),
        category: yup.number().required().min(0, "You must choose a category"),
        path: yup.mixed().required("You must select a photo")
    });

    const handleSubmitForm = (values, actions) => {
        let formData = new FormData(formRef.current);
        fetch("/admin/dashboard/photos/" + (
        props.edit ? "edit/" + props.photo.id : "new"
    ), {
            method: 'POST',
            headers: {
                enctype: "multipart/form-data"
            },
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

    };


    return (
        <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    title: props.photo ? props.photo.title : "",
                    description: props.photo ? props.photo.description || "" : "",
                    category: props.photo ? props.photo.category.id : "-1",
                    path: props.photo? props.photo.path : "",
                }
        }>
            {({
                handleSubmit,
                handleChange,
                values,
                errors,
                isSubmitting
            }) => <Form noValidate
                onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group controlId="validationFormikTitle" as={Row}>
                        <Col>
                        <Form.Control name="title" type="text" placeholder="Photo's title"
                            value={
                                values.title
                            }
                            isInvalid={
                                !!errors.title
                            }
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.title
                        } </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikDescription" as={Row}>
                        <Col>
                        <Form.Control name="description" type="text" placeholder="Description"
                            value={
                                values.description
                            }
                            onChange={handleChange}/>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikFile" as={Row}>
                        <Col>
                        <Form.Control name="path" type="file"
                            onChange={
                                (event) => {
                                    setFieldValue("path", event.currentTarget.files[0]);
                                }
                            }
                            disabled={
                                props.edit
                            }
                            isInvalid={
                                !!errors.path
                            }
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.path
                        } </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikCategory" as={Row}>
                        <Col>
                        <Form.Control name="category" as="select" custom
                            value={
                                values.category
                            }
                            isInvalid={
                                !!errors.category
                            }
                            onChange={handleChange}>
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
                        <Button type="submit" disabled={isSubmitting}>Save Photo</Button>
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
