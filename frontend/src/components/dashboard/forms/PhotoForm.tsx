import React, {useState, useRef} from 'react'
import Form from 'react-bootstrap/Form'
import {Formik} from 'formik'
import * as yup from 'yup'
import Button from 'react-bootstrap/Button'
import {Container, Row, Col} from 'react-bootstrap/'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'


interface Props {
    photo: Photo | null,
    edit: boolean,
    refresh:  () => void,
    categories: Array<Category>,
}

interface FormValues {
    title: string,
    description: string,
    category: number,
    path: any,
}

export default function PhotoForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)

    const schema = yup.object({
        title: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        description: yup.string(),
        category: yup.number().required().min(0, "You must choose a category"),
        path: yup.mixed().required("You must select a photo")
    })

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(true)
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        let token = "";
        await fetch("/smf/admin/photo/" + (
            props.edit && props.photo ? "edit/" + props.photo.id : "new"
        ), {method: "GET"}).then(response => {return response.text()}).then(data => {token = data})
        formData.append("_token", token)
        fetch("/smf/admin/photo/" + (
        props.edit && props.photo ? "edit/" + props.photo.id : "new"
    ), {
            method: 'POST',
            headers: {                
                enctype: "multipart/form-data",
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error("verify your form info or try again later!")
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
        })

    }


    return (
        <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    title: props.photo ? props.photo.title : "",
                    description: props.photo ? props.photo.description || "" : "",
                    category: props.photo ? props.photo.category.id : -1,
                    path: props.photo? props.photo.path : "",
                }
        }>
            {({
                handleSubmit,
                handleChange,
                setFieldValue,
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
                                (event: any) => {
                                    setFieldValue("path", event.currentTarget.files[0]);
                                }
                            }
                            disabled={
                                props.edit
                            }
                            isInvalid={
                                !!errors.path
                            }/>
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
                            props.categories.map((c, index: number) => <option value={
                                c.id
                            }
                            key={index}>
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
                        show={isSubmitting || submitting}
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
                        <Button type="submit" disabled={isSubmitting || submitting}>Save Photo</Button>
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
