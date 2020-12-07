import React, { useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Layout from './Layout'
import { Formik } from 'formik'
import * as yup from 'yup'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Icon from '@mdi/react'
import { mdiFormatSize, mdiNumeric1Box , mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box } from '@mdi/js'
import { mdiFormatBold, mdiFormatItalic, mdiCodeTags, mdiFormatQuoteClose } from '@mdi/js'
import { mdiFormatListBulleted, mdiFormatListNumbered, mdiKeyboardTab } from '@mdi/js'
import { mdiLink } from '@mdi/js'


interface Props {
    initialContent: {content: string, published: boolean, category: Category},
    translation: {[key:string]: string},
    refresh: () => void,
}

interface FormValues {
    content: string,
}

function Editor (props: Props) {
    /* list buttons
    - lien [text](url "text optional")
    - image ![text](url "text optional")
    */
    const formRef = useRef<HTMLFormElement>(null)
    const textRef = useRef<HTMLTextAreaElement>(null)
    const t = props.translation

    const schema = yup.object({
        content: yup.string().required(),
    })

    const handleSubmitForm = () => {
            alert("error author/title: cancel/proceed with previous values")
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
                const alt = formData.get("alt") !== ''? `"${formData.get("text")}"` : ''
                modifyText(` [${text}](${url} ${alt}) `)
                textRef.current.focus()
            }
        }
    }

    return <>
    <Row>
        <div className="editButton mr-1">
        <Dropdown>
            <Dropdown.Toggle variant='Secondary' id="dropdown-title" as="div">
                <Icon path={mdiFormatSize} size={1} color="white" />
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
        <div className="editButton mr-1" onClick={boldClicked}>
            <Icon path={mdiFormatBold} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={italicClicked}>
            <Icon path={mdiFormatItalic} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={codeClicked}>
            <Icon path={mdiCodeTags} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={quoteClicked}>
            <Icon path={mdiFormatQuoteClose} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={ulClicked}>
            <Icon path={mdiFormatListBulleted} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={olClicked}>
            <Icon path={mdiFormatListNumbered} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={tabClicked}>
            <Icon path={mdiKeyboardTab} size={1} color="white" />
        </div>
        <div className="editButton mr-1" onClick={untabClicked}>
            <Icon path={mdiKeyboardTab} size={1} color="white" horizontal />
        </div>
        <OverlayTrigger
        trigger="click"
        key="link"
        placement="bottom"
        overlay={
            <Popover id="link">
            <Popover.Content>
            <Form onSubmit={linkClicked}>
                <Form.Control type="text" placeholder="url" name="url" className="mr-2" />
                <Form.Control type="text" placeholder="showed text (optional)" name="text" className="mr-2" />
                <Form.Control type="text" placeholder="hover text (optional)" name="alt" className="mr-2" />
                <Form.Control type="submit" value="Insert" />
            </Form>
            </Popover.Content>
            </Popover>
        }
        >
        <div className="editButton mr-1">
            <Icon path={mdiLink} size={1} color="white" rotate={90} />
        </div>
        </OverlayTrigger>

    </Row>
    <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validationOnBlur={false}
            validationOnChange={false}
            initialValues={
                {
                    content: props.initialContent.content,
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
                </Form>}
        </Formik>
    </>
}

export default Editor