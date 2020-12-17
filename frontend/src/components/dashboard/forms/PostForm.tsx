import React, { useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import * as yup from 'yup'
import FormButtons from './FormButtons'


interface Props {
    users: Array<User>,
    refresh:  () => void,
    translation: {[key:string]: string},
}

interface FormValues {
    title: string,
    author: string,
    locale: string,
}

export default function PostForm (props: Props) {

    const formRef = useRef<HTMLFormElement>(null)

    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'warning' | 'success' | 'danger'>('warning')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const t = props.translation
    const router = useRouter()


    const schema = yup.object({
        title: yup.string().required(t._required).matches(/^([a-zA-Z0-9]+[ -_]?)+$/, t._special_char_error),
        author: yup.string().required(t._required).matches(/^([a-zA-Z0-9]+[ -_]*)+$/, t._required),
        locale: yup.string().required(),
    });

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(true)
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        let token = "";
        await fetch("/smf/admin/post/new",
        {method: "GET"}).then(response => {return response.text()}).then(data => {token = data})
        formData.append("_token", token)
        formData.append("content", `---\ntitle: ${values.title}\nauthor: ${values.author}\n---\n`)
        fetch("/smf/admin/post/new",
        {
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
                    title: "",
                    author: "~author",
                    locale:  router.locale ?? 'en',
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
                        <Form.Control required name="title" type="text" placeholder={t._post_title}
                            value={
                                values.title
                            }
                            isInvalid={!!errors.title}
                            onChange={handleChange}/>
                        <Form.Control.Feedback type="invalid">
                            {errors.title}
                        </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                <Form.Group controlId="validationFormikUser" as={Row}>
                        <Col>
                        <Form.Control name="author" as="select" custom
                            value={
                                values.author
                            }
                            isInvalid={
                                !!errors.author
                            }
                            onChange={handleChange}>
                            <option hidden value="~author">{t._post_author}</option>
                            {
                            props.users.map((u, index: number) => <option value={u.firstName + ' ' + u.lastName}
                                key={index}>
                                {
                                u.username
                            }</option>)
                        } </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.author
                        } </Form.Control.Feedback>
                        </Col>
                    </Form.Group>
                    <Form.Group controlId="validationFormikLocale" as={Row}>
                        <Col>
                        <Form.Label>{t._choose_language}</Form.Label>
                        <Form.Control name="locale" as="select" custom
                            value={
                                values.locale
                            }
                            onChange={handleChange}>
                            {router.locales ?
                            router.locales.map((l, index: number) => <option value={l}
                                key={index}>
                                {
                                l
                            }</option>)
                            : <option value={router.locale ?? 'en'}>{router.locale ?? 'en'}</option>
                        } </Form.Control>
                        </Col>
                    </Form.Group>
                <Form.Row>
                <FormButtons submitting={submitting}
                            showAlert={showAlert}
                            messageAlert={messageAlert}
                            variantAlert={variantAlert}
                            handleReset={handleReset}
                            translation={t}
                            type='post'/>
                </Form.Row>
            </Form>}
        </Formik>
}
