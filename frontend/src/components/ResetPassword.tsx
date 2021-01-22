import React, { useState } from 'react'
import { useSession } from 'utils/SessionContext'
import { useRouter } from 'next/router'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import {Formik} from 'formik'
import * as yup from 'yup'
import Spinner from 'react-bootstrap/Spinner'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Alert from 'react-bootstrap/Alert'
import { useTranslation } from 'utils/TranslationContext'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'


interface FormValues {
    usename: string,
}

interface Props {
    toggleBack: () => any
}

export default function ResetPassword(props: Props) {
    const [state, ] = useSession()
    const [trans, ] = useTranslation()
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<string>("warning")
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const router = useRouter()

    const schema = yup.object({usename: yup.string().required(trans.common._required)})

    const handleSubmitForm = async (values: FormValues) => {
        setSubmitting(true)
        let token = state.token
        fetch("/api/reset_password", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                locale: router.locale,
                username: values.usename,
                _csrf_token: token
            })
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(trans.common._verify_login)
            }
        }).then(data => {
            setSubmitting(false)
            setMessageAlert(trans.common._message_sent+"\n"+trans.common._use_contact)
            setVariantAlert("success")
            setShowAlert(true)
            setTimeout(() => router.reload(), 1000)
        }).catch(error => {
            setSubmitting(false)
            setVariantAlert("danger")
            setMessageAlert(trans.common._error_server)
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        })
    }

    return <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validateOnBlur={false}
            validateOnChange={false}
            initialValues={
                {
                    usename: ""
                }
        }>{({
                handleSubmit,
                handleChange,
                values,
                errors,
                isSubmitting,
            }) => <Form noValidate
                onSubmit={handleSubmit}>
                <Row>
                    <Col>
                    <div className="mb-2 iconCursor" onClick={props.toggleBack}>
                        <Icon path={mdiArrowLeft} color="black" size={1} />
                    </div>
                    </Col>
                </Row>
                <Form.Group controlId="validationFormikUsername"
                    as={Row}>
                    <Col>
                        <Form.Label srOnly>{trans.common._username}</Form.Label>
                        <Form.Control required name="usename" type="text" placeholder={trans.common._username} autoComplete="usename"
                            value={
                                values.usename
                            }
                            onChange={
                                handleChange
                            }
                            isInvalid={
                                !!errors.usename
                            }/>
                        <Form.Control.Feedback type="invalid">
                            {
                            errors.usename
                        } </Form.Control.Feedback>
                    </Col>
                </Form.Group>
                <Form.Row>
                <Col sm={4}>
                    <OverlayTrigger
                        key="send"
                        show={isSubmitting || submitting}
                        placement="right"
                        overlay={
                            <Popover id="send">
                            <Popover.Content>
                                <Spinner animation="border" role="status" variant="success">
                                    <span className="sr-only">{trans.common._loading}</span>
                                </Spinner>
                            </Popover.Content>
                            </Popover>
                        }
                        >
                        <Button type="submit" disabled={isSubmitting || submitting}>{trans.common._send}</Button>
                    </OverlayTrigger>
                </Col>
                <Col sm={{ span: 7, offset: 1 }}>
                    <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
                </Col>
                </Form.Row>
            </Form>}
        </Formik>
}
