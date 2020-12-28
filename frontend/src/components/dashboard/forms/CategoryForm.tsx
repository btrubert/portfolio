import React, { useState, useRef } from 'react'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import * as yup from 'yup'
import FormButtons from './FormButtons'


interface Props {
    category: Category | null,
    edit: boolean,
    refresh:  () => void,
    users: Array<User>,
    translation: {[key:string]: string},
}

interface FormValues {
    name: string,
    public: boolean,
    user?: number,
}

export default function CategoryForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const t = props.translation

    const schema = yup.object({
        name: yup.string().required(t._required).matches(/^([a-zA-Z0-9àçéèëêùïû]+[ -_]?)+$/, t._special_char_error),
        public: yup.boolean(),
        user: yup.number().when('public', {is: false, then:yup.number().required(t._required).min(0, t._select_user), otherwise: yup.number().nullable()}),
    });

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(true)
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        if (values.public){
            formData.delete("user")
        }
        let token = "";
        await fetch("/smf/admin/category/" + (
            props.edit && props.category ? "edit/" + props.category.id : "new"
        ), {method: "GET"}).then(response => {return response.text()}).then(data => {token = data})
        formData.append("_token", token)
        fetch("/smf/admin/category/" + (
            props.edit && props.category ? "edit/" + props.category.id : "new"
        ), {
            method:'POST',
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
        });
    }            

  
   return <Formik validationSchema={schema}
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
            handleReset,
            values,
            errors
        }) => <Form noValidate
                onSubmit={handleSubmit}
                ref={formRef}>
                    <Form.Group as={Row} controlId="validationFormikName">
                        <Col>
                        <Form.Control required name="name" type="text" placeholder={t._category_name}
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
                    <Form.Check type="switch" name="public" label={t._public_choice}
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
                            <option hidden value="-1">{t._choose_user}</option>
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
                <FormButtons submitting={submitting}
                            showAlert={showAlert}
                            messageAlert={messageAlert}
                            variantAlert={variantAlert}
                            handleReset={handleReset}
                            translation={t}
                            type='category'/>
                </Form.Row>
            </Form>}
        </Formik>
}
