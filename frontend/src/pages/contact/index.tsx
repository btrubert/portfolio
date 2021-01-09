import React, { useEffect, useState } from 'react'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import { Formik } from 'formik'
import * as yup from 'yup'
import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'

interface FormValues {
    subject: string,
    email: string,
    message: string,
}


function Contact (props: InferGetStaticPropsType<typeof getStaticProps>) {
    const [trans, dispatch] = useTranslation()
    const router = useRouter()
    const [submitting, setSubmitting] = useState<boolean>(false)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'success' | 'danger'>('success')
    const [messageAlert, setMessageAlert] = useState<string>("")

    const max_subject = 64
    const max_message = 2048
    const schema = yup.object({
        subject: yup.string().required(trans.common._required).max(max_subject),
        email: yup.string().required(trans.common._required).email(trans.common._email_invalid),
        message: yup.string().required(trans.common._required).max(max_message),
    })

    useEffect(() => {
        if (!trans.commonTrans) {
            dispatch({
                type: 'setCommon',
                payload: JSON.parse(props.commonT),
            })
        }
    }, [router.locale])

    const handleSubmitForm = (values: FormValues) => {
        setSubmitting(true)
        fetch("api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({subject: values.subject, email: values.email, message: values.message, locale: router.locale})
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(''+response.status)
            }
        }).then(data => {
            setMessageAlert(trans.common._message_sent)
            setVariantAlert('success')
            setShowAlert(true)
            setSubmitting(false)
            setTimeout(()=>setShowAlert(false), 3000)
        }).catch(e => {
            setMessageAlert(trans.common._error_server)
            setVariantAlert('danger')
            setShowAlert(true)
            setSubmitting(false)
            setTimeout(()=>setShowAlert(false), 3000)
        })
    }

    return <>
        <h1 className="text-center mb-3">{trans.common._contact}</h1>
        <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    subject: '',
                    email: '',
                    message: ''
                }
            }>{
                ({
                    handleSubmit,
                    handleChange,
                    handleReset,
                    values,
                    errors
                }) => <Form noValidate
                        onSubmit={handleSubmit}>
                            <Form.Row>
                                <Form.Group controlId="validationFormikSubject" as={Col} xs={{ offset: 3, span: 6 }}>
                                    <Form.Label srOnly>{trans.common._subject}</Form.Label>
                                    <Form.Control required name="subject" type="text"
                                        maxLength={max_subject}
                                        placeholder={trans.common._subject}
                                        value={values.subject}
                                        isInvalid={!!errors.subject}
                                        onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.subject}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group controlId="validationFormikEmail" as={Col} xs={{ offset: 3, span: 6 }}>
                                    <Form.Label srOnly>{trans.common._email}</Form.Label>
                                    <Form.Control required name="email" type="text"
                                        placeholder={trans.common._email}
                                        value={values.email}
                                        isInvalid={!!errors.email}
                                        onChange={handleChange}/>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.email}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                                <Form.Group controlId="validationFormikMessage" as={Col} xs={{ offset: 3, span: 6 }}>
                                    <Form.Label srOnly>{trans.common._message_content}</Form.Label>
                                    <Form.Control required name="message" as="textarea"
                                        placeholder={trans.common._message_content}
                                        value={values.message}
                                        isInvalid={!!errors.message}
                                        onChange={handleChange}
                                        rows={13}
                                        maxLength={max_message}/>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>
                            <Form.Row>
                            <Col sm={{ offset: 3, span: 3 }}>
                                <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                            </Col>
                            <Col sm={3} className="text-right">
                                <OverlayTrigger
                                    key="sentMail"
                                    show={submitting}
                                    placement="right"
                                    overlay={
                                        <Popover id="sentMail">
                                        <Popover.Content>
                                            <Spinner animation="border" role="status" variant="success">
                                                <span className="sr-only">{trans.common._loading}</span>
                                            </Spinner>
                                        </Popover.Content>
                                        </Popover>
                                    }
                                    >
                                    <Button className="mr-2" type="submit" variant="outline-success" disabled={submitting}>{trans.common._send}</Button>
                                </OverlayTrigger>
                                <Button type="button" variant="outline-info" onClick={handleReset}>{trans.common._reset}</Button>
                            </Col>
                            </Form.Row>
                        </Form>
            }</Formik>
    </>
}

export const getStaticProps: GetStaticProps = async (context) => {
    const defaultLocale = context.defaultLocale ?? 'fr'
    const locale = context.locale ?? defaultLocale
    const commonT = getTranslation('common', locale)
    return {
        props: {commonT},
        revalidate: 60,
    }
  }

export default Contact
