import React, {useState, useRef} from 'react'
import Form from 'react-bootstrap/Form'
import {Container, Row, Col, Button} from 'react-bootstrap/'
import {Formik} from 'formik'
import * as yup from 'yup'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'


interface Props {
    category: Category | null,
    edit: boolean,
    refresh:  () => void,
    users: Array<User>,
}

interface FormValues {
    name: string,
    public: boolean,
    user?: number,
}

export default function CategoryForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)

    const [showAlert, setShowAlert] = useState<boolean>(false);
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning');
    const [messageAlert, setMessageAlert] = useState<string>("");

    const schema = yup.object({
        name: yup.string().required("Required").matches(/^([a-zA-Z0-9]+[ -_]?)+$/, 'Cannot contain special characters, or double space/dash'),
        public: yup.boolean(),
        user: yup.number().when('public', {is: false, then:yup.number().required("Required").min(0, "Select a user"), otherwise: yup.number().nullable()}),
    });

    const handleSubmitForm = async (values: FormValues, actions: any) => {
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        if (values.public){
            formData.delete("user")
        }
        let token = "";
        await fetch("/api/admin/" + (
            props.edit && props.category ? "edit/category/" + props.category.id : "new/category"
        ), {method: "GET"}).then(response => {return response.text()}).then(data => {token = data})
        formData.append("_token", token)
        fetch("/api/admin/" + (
            props.edit && props.category ? "edit/category/" + props.category.id : "new/category"
        ), {
            method:'POST',
            headers: {
                enctype: "multipart/form-data",
                'Content-Type': "multipart/form-data",
            },
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error("verify your form info or try again later!")
            }
        }).then(data => {
                actions.setSubmitting(false)
                setMessageAlert(data)
                setVariantAlert("success")
                setShowAlert(true)
                setTimeout(props.refresh, 3000)
            })
        .catch(error =>  {
            actions.setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(error+"")
            setShowAlert(true)
            setTimeout(()=>setShowAlert(false),3000)
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
                    user: props.category && props.category.user ? props.category.user.id : -1,
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
                            <option hidden value="-1">Choose a user</option>
                            {
                            props.users.map((u, index: number) => <option value={u.id}
                                key={index}>
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
