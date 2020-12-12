import React, { useRef, useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Layout from './Layout'
import { Formik } from 'formik'
import * as yup from 'yup'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import PhotoForm from 'components/dashboard/forms/PhotoForm'
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import { mdiFormatSize, mdiNumeric1Box , mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box } from '@mdi/js'
import { mdiFormatBold, mdiFormatItalic, mdiCodeTags, mdiFormatQuoteClose } from '@mdi/js'
import { mdiFormatListBulleted, mdiFormatListNumbered, mdiKeyboardTab } from '@mdi/js'
import { mdiLink, mdiImageMultipleOutline } from '@mdi/js'


interface Props {
    post: Post,
    token: string,
    translation: {[key:string]: string},
    formTrans: string,
    photos: Array<Photo> | null,
    updatePhotos: () => void,
}

interface FormValues {
    content: string,
}

function Editor (props: Props) {
    const formRef = useRef<HTMLFormElement>(null)
    const textRef = useRef<HTMLTextAreaElement>(null)
    const t = props.translation
    const published = props.post.published
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'success' | 'danger'>('success')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [showForm, setShowForm] = useState<boolean>(false)
    const category = props.post.category

    const [submitting, setSubmitting] = useState<boolean>(false)
    const schema = yup.object({
        content: yup.string().required(),
    })

    const handleSubmitForm = (values: FormValues) => {
        setSubmitting(true)
        if (!formRef.current){
            // if the form is not initialised do nothing
            return;
        }
        let formData = new FormData(formRef.current)
        formData.append("_token", props.token)
        formData.append("author", props.post.author)
        formData.append("title", props.post.title)
        formData.append("locale", props.post.locale)
        fetch("/smf/admin/blog/edit/" + props.post.id,
        {
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
                setMessageAlert(t._saved)
                setVariantAlert("success")
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 3000)
            })
        .catch(error =>  {
            setSubmitting(false)
            setMessageAlert(t._error_saved)
            setVariantAlert("danger")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
        })
    }

    const handlePublish = () => {

    }

    const modifyText = (prefixe: string, suffixe: string='') => {
            if (textRef.current && textRef.current.selectionStart > 0) {
                let text = prefixe
                if (textRef.current.selectionStart !== textRef.current.selectionEnd) {
                    text += textRef.current.value.slice(textRef.current.selectionStart, textRef.current.selectionEnd).trim()
                }
                text += suffixe
                textRef.current.setRangeText(text)
            }
    }

    const titleClicked = (n: 1 | 2 | 3 | 4) => {modifyText("\n" + '#'.repeat(n) + ' ', "\n")}

    const boldClicked = () => {
            if (textRef.current && textRef.current.selectionStart < textRef.current.selectionEnd) {
                modifyText(" **", "** ")
            }
    }

    const italicClicked = () => {
            if (textRef.current && textRef.current.selectionStart < textRef.current.selectionEnd) {
                modifyText(" _", "_ ")
            }
    }

    const codeClicked = () => {modifyText(" `", "` ")}
    const quoteClicked = () => {modifyText("\n> ","\n")}
    const ulClicked = () => {modifyText("\n* ", "\n* \n")}
    const olClicked = () => {modifyText("\n1. ", "\n2. \n")}

    const tabClicked = () => {
        if (textRef.current && textRef.current.selectionStart < textRef.current.selectionEnd) {
            let text = '  '
            text += textRef.current.value.slice(textRef.current.selectionStart, textRef.current.selectionEnd).replace('\n', "\n  ")
            textRef.current.setRangeText(text)
        }
    }

    const untabClicked = () => {
        if (textRef.current && textRef.current.selectionStart < textRef.current.selectionEnd) {
            const text = textRef.current.value.slice(textRef.current.selectionStart, textRef.current.selectionEnd).replace(/  /g, '')
            textRef.current.setRangeText(text)
        }
    }

    const linkClicked = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (textRef.current && textRef.current.selectionStart === textRef.current.selectionEnd) {
            const formData = new FormData(event.currentTarget)
            if (formData.get('url') !== '') {
                const url = formData.get("url")
                const text = formData.get("text") !== ''? formData.get("text") : formData.get("url")
                const alt = formData.get("alt") !== ''? `"${formData.get("alt")}"` : ''
                modifyText(` [${text}](${url} ${alt}) `)
            }
        }
    }

    const imageClicked = (p: Photo) => {
        if (textRef.current && textRef.current.selectionStart === textRef.current.selectionEnd) {
            const url = "/uploads/" + p.path
            const text = `"${p.title}"`
            const alt = p.description && p.description !== ''? p.description : ''
            modifyText(` ![${alt}](${url} ${text}) `)
        }
    }

    const handleAddImage = () => {
        setShowForm(true)
    }

    return <>
        <Row>
            <div className="editButton">
            <Dropdown>
                <Dropdown.Toggle variant='Secondary' id="dropdown-title" as="div">
                    <Icon path={mdiFormatSize} size={.8} color="white" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item  onClick={() => titleClicked(1)}>
                        <Icon path={mdiNumeric1Box} size={1} color="black" /><h1>{t._title}</h1>
                    </Dropdown.Item>
                    <Dropdown.Item  onClick={() => titleClicked(2)}>
                        <Icon path={mdiNumeric2Box} size={1} color="black" /><h2>{t._title}</h2>
                    </Dropdown.Item>
                    <Dropdown.Item  onClick={() => titleClicked(3)}>
                        <Icon path={mdiNumeric3Box} size={1} color="black" /><h3>{t._title}</h3>
                    </Dropdown.Item>
                    <Dropdown.Item  onClick={() => titleClicked(4)}>
                        <Icon path={mdiNumeric4Box} size={1} color="black" /><h4>{t._title}</h4>
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </div>
            <div className="editButton" onClick={boldClicked}>
                <Icon path={mdiFormatBold} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={italicClicked}>
                <Icon path={mdiFormatItalic} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={codeClicked}>
                <Icon path={mdiCodeTags} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={quoteClicked}>
                <Icon path={mdiFormatQuoteClose} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={ulClicked}>
                <Icon path={mdiFormatListBulleted} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={olClicked}>
                <Icon path={mdiFormatListNumbered} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={tabClicked}>
                <Icon path={mdiKeyboardTab} size={.8} color="white" />
            </div>
            <div className="editButton" onClick={untabClicked}>
                <Icon path={mdiKeyboardTab} size={.8} color="white" horizontal />
            </div>
            <OverlayTrigger
            trigger="click"
            rootClose
            key="link"
            placement="bottom"
            overlay={
                <Popover id="link">
                <Popover.Content>
                <Form onSubmit={linkClicked}>
                    <Form.Control type="text" placeholder={t._url_link} name="url" className="mr-2" />
                    <Form.Control type="text" placeholder={t._url_text} name="text" className="mr-2" />
                    <Form.Control type="text" placeholder={t._url_hover} name="alt" className="mr-2" />
                    <Form.Control type="submit" value="Insert"/>
                </Form>
                </Popover.Content>
                </Popover>
            }
            >
            <div className="editButton">
                <Icon path={mdiLink} size={.8} color="white" rotate={90} />
            </div>
            </OverlayTrigger>
            <OverlayTrigger
            trigger="click"
            rootClose
            key="image"
            placement="bottom"
            overlay={
                <Popover id="image">
                <Popover.Title>
                {t._image_selection} <span className="addImage" onClick={handleAddImage}>{t._add_new_image}</span>
                </Popover.Title>
                <Popover.Content>
                    <Row>
                    {props.photos && 
                    props.photos.map((p, index:number) => 
                        <Col key={index} sm={6} md={6} lg={4}>
                            <Image src={`/smf/img/${p.path}`}
                                width="128" height="128" unoptimized
                                onClick={() => imageClicked(p)} />
                        </Col>
                    )}
                    </Row>
                </Popover.Content>
                </Popover>
            }
            >
            <div className="editButton">
                <Icon path={mdiImageMultipleOutline} size={.8} color="white" />
            </div>
            </OverlayTrigger>
            <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert>
        </Row>
        <Formik validationSchema={schema}
                onSubmit={handleSubmitForm}
                validationOnBlur={false}
                validationOnChange={false}
                initialValues={
                    {
                        content: props.post.content,
                    }
                }>{({
                    handleSubmit,
                    handleChange,
                    values,
                    errors
                }) => <Form noValidate
                        onSubmit={handleSubmit}
                        ref={formRef}>
                        <Row>
                            <Col>
                                <Form.Group controlId="validationFormikContent">
                                    <Form.Control required as="textarea"
                                        name="content"
                                        value={values.content}
                                        onChange={handleChange}
                                        rows={23}
                                        ref={textRef}>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Layout content={values.content} />
                            </Col>
                        </Row>
                        <Row>
                            <Col className="text-right" sm={6}>
                                <Button className="mr-2" variant="outline-success" type="submit" disabled={submitting}>{t._save}</Button>
                                <Button variant="outline-info" onClick={handlePublish} disabled={submitting}>{published? t._unpublish : t._publish}</Button>
                            </Col>
                        </Row>
                    </Form>}
            </Formik>
        <Modal className="custom-form" size="lg"
            show={showForm}
            onHide={() => {setShowForm(false)}}>
            <Modal.Header closeButton>
                {t._photo}
            </Modal.Header>
            <Modal.Body>
                <PhotoForm photo={null} edit={false} refresh={() => {setShowForm(false); props.updatePhotos()}} categories={[category]} translation={JSON.parse(props.formTrans)}/>
            </Modal.Body>
        </Modal>
    </>
}

export default Editor