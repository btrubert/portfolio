import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import { Formik } from 'formik'
import * as yup from 'yup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import FormButtons from './FormButtons'
import Alert from 'react-bootstrap/Alert'


interface Props {
    photo: Photo | null,
    edit: boolean,
    refresh:  () => void,
    categories: Array<Category>,
    translation: {[key:string]: string},
}

interface FormValues {
    title: string,
    description: string,
    category: number,
    path: any,
    quality: number,
    changeQuality: boolean,
    original: boolean,
}

export default function PhotoForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const t = props.translation
    const originalFile = props.photo ? props.photo.originalPath !== "": true
    const categoryChoice = props.categories.length === 1

    const schema = yup.object({
        title: yup.string().required(t._required).matches(/^([a-zA-Z0-9àçéèëêùïû]+[ -_]?)+$/, t._special_char_error),
        description: yup.string(),
        category: yup.number().required().min(0, t._choose_category_error),
        path: yup.mixed().required(t._select_photo_error),
        changeQuality: yup.boolean(),
        quality: yup.number().when("changeQuality", {is: true, then: yup.number().required().min(50).max(100), otherwise: yup.number().nullable()}),
        original: yup.boolean().required(),
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
        if (!formData.get("category")) {
            formData.set("category", values.category+'')
        }
        if (!values.changeQuality) {
            formData.delete("quality")
        }
        formData.delete("changeQuality")
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
                throw new Error(t._error_form)
            }
        }).then(data => {
                setSubmitting(false)
                setMessageAlert(data)
                setVariantAlert("success")
                setShowAlert(true)
                setTimeout(props.refresh, 1000)
            })
        .catch(error =>  {
            setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(error+"")
            setShowAlert(true)
            setTimeout(()=>setShowAlert(false),3000)
        })
    }

    if (props.categories.length < 1) {
        return <Alert show={true} variant="danger">{t._missing_category}</Alert>
    }
    return <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    title: props.photo ? props.photo.title : "",
                    description: props.photo ? props.photo.description || "" : "",
                    category: categoryChoice?  (props.categories[0].id ?? -1) : (props.photo && props.photo.category.id? props.photo.category.id : -1),
                    path: props.photo? props.photo.path : "",
                    quality: 100,
                    changeQuality: !props.edit,
                    original: originalFile,
                }
        }>
            {({
                handleSubmit,
                handleChange,
                handleReset,
                setFieldValue,
                values,
                errors
            }) => <Form noValidate
                onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group controlId="validationFormikTitle" as={Row}>
                        <Col>
                        <Form.Control name="title" type="text" placeholder={t._photo_title}
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
                        <Form.Control name="description" type="text" placeholder={t._description}
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
                    <Form.Group controlId="validationFormikOriginal" as={Row}>
                        <Col>
                        <Form.Check type="switch" name="original" label={t._keep_original}
                            checked={
                                values.original
                            }
                            onChange={
                                handleChange
                            }
                            disabled={props.edit && !originalFile}/>
                            </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikChangeQuality" as={Row} hidden={!props.edit}>
                        <Col>
                        <Form.Check type="switch" name="changeQuality" label={t._change_quality}
                            checked={
                                values.changeQuality
                            }
                            onChange={
                                handleChange
                            }
                            disabled={props.edit && !originalFile}/>
                            </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikQuality" as={Row} hidden={!values.changeQuality}>
                        <Col sm={2}>
                            <Form.Label>{t._quality} : {values.quality}</Form.Label>
                        </Col>
                        <Col sm={10}>
                            <Form.Control name="quality" type="range"
                            min="50" max="100" step="10"
                            onChange={handleChange}
                            value={values.quality}/>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikCategory" as={Row}>
                        <Col>
                        <Form.Control name="category" as="select" custom
                            disabled={categoryChoice}
                            value={
                                values.category
                            }
                            isInvalid={
                                !!errors.category
                            }
                            onChange={handleChange}>
                            <option hidden value="-1">{t._choose_category}</option>
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
                <FormButtons submitting={submitting}
                            showAlert={showAlert}
                            messageAlert={messageAlert}
                            variantAlert={variantAlert}
                            handleReset={handleReset}
                            translation={t}
                            type='photo'/>
                </Form.Row>
            </Form>}
        </Formik>
}
