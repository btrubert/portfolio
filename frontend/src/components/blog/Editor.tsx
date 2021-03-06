import React, { useRef, useState, useEffect } from 'react'
import { Router, useRouter } from 'next/router'
import { useSession } from 'utils/SessionContext'
import matter from 'gray-matter'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Layout from 'components/blog/Layout'
import PostCard from 'components/blog/PostCard'
import Dropdown from 'react-bootstrap/Dropdown'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Tooltip from 'react-bootstrap/Tooltip'
import Modal from 'react-bootstrap/Modal'
import Alert from 'react-bootstrap/Alert'
import PhotoForm from 'components/dashboard/forms/PhotoForm'
import Image from 'next/image'
import Button from 'react-bootstrap/Button'
import Icon from '@mdi/react'
import { mdiFormatSize, mdiNumeric1Box , mdiNumeric2Box, mdiNumeric3Box, mdiNumeric4Box } from '@mdi/js'
import { mdiFormatBold, mdiFormatItalic, mdiCodeTags, mdiFormatQuoteClose, mdiMinus } from '@mdi/js'
import { mdiFormatListBulleted, mdiFormatListNumbered, mdiKeyboardTab } from '@mdi/js'
import { mdiLink, mdiAt, mdiImageMultipleOutline } from '@mdi/js'
import { mdiCached } from '@mdi/js'


interface Props {
    post: Post,
    token: string,
    translation: {[key:string]: string},
    formTrans: string,
    photos: Array<Photo> | null,
    updatePhotos: () => void,
}


function Editor (props: Props) {
    const formRef = useRef<HTMLFormElement>(null)
    const textRef = useRef<HTMLTextAreaElement>(null)
    const [session, dispatch] = useSession()
    const [content, setContent] = useState<string>(props.post.content)
    const t = props.translation
    const [published, setPublished] = useState<boolean>(props.post.published)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [variantAlert, setVariantAlert] = useState<'success' | 'danger'>('success')
    const [messageAlert, setMessageAlert] = useState<string>("")
    const [showForm, setShowForm] = useState<boolean>(false)
    const category = props.post.category
    const [showLink, setShowLink] = useState<boolean>(false)
    const [showEmail, setShowEmail] = useState<boolean>(false)
    const [showImage, setShowImage] = useState<boolean>(false)
    const [showCard, setShowCard] = useState<boolean>(true)
    const [saved, setSaved] = useState<boolean>(true)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const router = useRouter()

    const handleWindowUnload = (e: BeforeUnloadEvent) => {
        if (!saved) {
            e.preventDefault()
            return (e.returnValue = t._leave_without_saving)
        }
    }

    useEffect(() => {
        window.addEventListener('beforeunload', handleWindowUnload);

        return () => {
            window.removeEventListener('beforeunload', handleWindowUnload);
        }
    })

    useEffect(() => {
        const askConfirmation = () => {
            if (saved || !session.admin) return;
            if (confirm(t._leave_without_saving)) {
                setSaved(true)
            } else {
                router.events.emit('routeChangeError')
                throw 'routeChange aborted.'
            }
        }
        // beforeHistoryChange instead of routeChangeStart > wrong url if cancelled
       Router.events.on('beforeHistoryChange', askConfirmation)
       return () => Router.events.off('beforeHistoryChange', askConfirmation)
    }, [saved])

    const saveShortcut = (e: KeyboardEvent) => {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault()
            handleSubmit()
        }
    }

    useEffect(() => {
        window.addEventListener('keydown', saveShortcut)
        return () => {
            window.removeEventListener('keydown', saveShortcut)
        }
    })
    
    const handleChange = () => {
        if (textRef.current) {
            setSaved(false)
            setContent(textRef.current.value)
        }
    }

    const verifyMetadata = (content: string): [string, string, string, string, string] => {
        const tmpStartPost = textRef.current ? textRef.current.selectionStart : 0
        const tmpEndPost = textRef.current ? textRef.current.selectionEnd : 0
        const endPosition = content.search(/\n---/)
        let header = content.slice(0, endPosition)
        header = header.replace(/:/g, ": ")
        header = header.replace(/  /g, " ")
        if (textRef.current) {
            textRef.current.setRangeText(header, 0, endPosition, "start")
            setContent(textRef.current.value)
            textRef.current.setSelectionRange(tmpStartPost, tmpEndPost)
        }
        const metadata  = matter(header).data
        const author = metadata.author ? metadata.author : props.post.author
        const title = metadata.title ? metadata.title : props.post.title
        const locale = router.locales?.includes(metadata.locale) ? metadata.locale : props.post.locale
        const description = metadata.description ? metadata.description : props.post.description
        const cover = metadata.cover ? metadata.cover : props.post.cover
        props.post.author = author
        props.post.title = title
        props.post.locale = locale
        props.post.description = description
        props.post.cover = cover
        return [author, title, locale, description, cover]
    }

    const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        setSubmitting(true)
        if (!formRef.current || !textRef.current){
            // if the form is not initialised do nothing
            setSubmitting(false)
            return;
        }
        const [author, title, locale, description, cover] = verifyMetadata(textRef.current.value)
        if (description.length > 255) {
            setSubmitting(false)
            setMessageAlert(`Description : ${description.length}/255`)
            setVariantAlert("danger")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 3000)
            return;
        }
        let formData = new FormData(formRef.current)
        formData.append("_token", props.token)
        formData.append("author", author)
        formData.append("title", title)
        formData.append("locale", locale)
        formData.append("description", description)
        formData.append("cover", cover)
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
                setSaved(true)
                setMessageAlert(t._saved)
                setVariantAlert("success")
                setShowAlert(true)
                setTimeout(() => setShowAlert(false), 1000)
            })
        .catch(error =>  {
            setSubmitting(false)
            setMessageAlert(t._error_saved)
            setVariantAlert("danger")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 1000)
        })
    }

    const handlePublish = async () => {
        await handleSubmit()
        setSubmitting(true)
        fetch("/api/blog/publish/" + props.post.id,
        {
            method: 'POST',
            headers: {                
                "Content-Type": "application/json",
            },
            body: JSON.stringify({_csrf_token: props.token, published: !published})
        }).then(response => {
            if (response.ok) {
                return response.text()
            } else {
                throw new Error(t._error_form)
            }
        }).then(data => {
            setPublished(!published)
            setSubmitting(false)
            setSaved(true)
            setMessageAlert(published ? t._unpublished : t._published)
            setVariantAlert("success")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 1000)
        })
        .catch(error =>  {
            setSubmitting(false)
            setMessageAlert(t._error_saved)
            setVariantAlert("danger")
            setShowAlert(true)
            setTimeout(() => setShowAlert(false), 1000)
        })
    }

    const getIcon = (icon: string, tip: string, rotation: number = 0) => {
        return <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 0 }}
                    overlay={<Tooltip id={"button-tooltip"+icon}>
                            {tip}
                        </Tooltip>}
                >
                    <Icon path={icon} size={.8} color="white" rotate={rotation}/>
                </OverlayTrigger>
    }

    const modifyText = (prefixe: string, suffixe: string='') => {
            if (textRef.current && textRef.current.selectionStart > 0) {
                let text = prefixe
                if (textRef.current.selectionStart !== textRef.current.selectionEnd) {
                    text += textRef.current.value.slice(textRef.current.selectionStart, textRef.current.selectionEnd).trim()
                }
                text += suffixe
                textRef.current.setRangeText(text)
                handleChange()
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
    const separatorClicked = () => {if (textRef.current && textRef.current.selectionStart === textRef.current.selectionEnd) modifyText("\n\n---\n\n")}
    const ulClicked = () => {modifyText("\n* ", "\n* \n")}
    const olClicked = () => {modifyText("\n1. ", "\n2. \n")}

    const tabClicked = () => {
        if (textRef.current && textRef.current.selectionStart < textRef.current.selectionEnd) {
            let text = '  '
            text += textRef.current.value.slice(textRef.current.selectionStart, textRef.current.selectionEnd).replace('\n', "\n  ")
            textRef.current.setRangeText(text)
            setContent(textRef.current.value)
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
                setShowLink(false)
                const url = formData.get("url")
                if (formData.get("text") === '' && formData.get("alt") === '') {
                    modifyText(` <${url}> `)

                } else {
                    const text = formData.get("text") !== ''? formData.get("text") : formData.get("url")
                    const alt = formData.get("alt") !== ''? `"${formData.get("alt")}"` : ''
                    modifyText(` [${text}](${url} ${alt}) `)
                }
            }
        }
    }

    const emailClicked = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (textRef.current && textRef.current.selectionStart === textRef.current.selectionEnd) {
            const formData = new FormData(event.currentTarget)
            if (formData.get('email') !== '') {
                setShowEmail(false)
                const email = formData.get("email")
                modifyText(` <${email}> `)
            }
        }
    }

    const imageClicked = (p: Photo) => {
        if (textRef.current && textRef.current.selectionStart === textRef.current.selectionEnd) {
            setShowImage(false)
            const url = "/uploads/" + p.path
            const text = `"${p.title}"`
            const alt = p.description && p.description !== ''? p.description : ''
            modifyText(` ![${alt}](${url} ${text}) `)
        }
    }

    const handleAddImage = () => {
        setShowImage(false)
        setShowForm(true)
    }

    const toggleShowCard = () => setShowCard(!showCard)

    return <>
        <Row>
            <div className="editButton">
            <Dropdown>
                <Dropdown.Toggle variant='Secondary' id="dropdown-title" as="div">
                    {getIcon(mdiFormatSize, t._title)}
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
            {getIcon(mdiFormatBold, t._bold)}                
            </div>
            <div className="editButton" onClick={italicClicked}>
                {getIcon(mdiFormatItalic, t._italic)}
            </div>
            <div className="editButton" onClick={codeClicked}>
                {getIcon(mdiCodeTags, t._code)}
            </div>
            <div className="editButton" onClick={quoteClicked}>
                {getIcon(mdiFormatQuoteClose, t._quote)}
            </div>
            <div className="editButton" onClick={separatorClicked}>
                {getIcon(mdiMinus, t._separator)}
            </div>
            <div className="editButton" onClick={ulClicked}>
                {getIcon(mdiFormatListBulleted, t._u_list)}
            </div>
            <div className="editButton" onClick={olClicked}>
                {getIcon(mdiFormatListNumbered, t._o_list)}
            </div>
            <div className="editButton" onClick={tabClicked}>
                {getIcon(mdiKeyboardTab, t._tab)}
            </div>
            <div className="editButton" onClick={untabClicked}>
                {getIcon(mdiKeyboardTab, t._tab, 180)}
            </div>
            <OverlayTrigger
                trigger="click"
                key="link"
                show={showLink}
                onToggle={() => {setShowLink(!showLink); setShowEmail(false); setShowImage(false)}}
                placement="bottom"
                overlay={
                    <Popover id="link">
                    <Popover.Content>
                    <Form onSubmit={linkClicked}>
                        <Form.Control type="text" placeholder={t._url_link} name="url" className="mr-2" />
                        <Form.Control type="text" placeholder={t._url_text} name="text" className="mr-2" />
                        <Form.Control type="text" placeholder={t._url_hover} name="alt" className="mr-2" />
                        <Form.Control type="submit" value={t._insert} />
                    </Form>
                    </Popover.Content>
                    </Popover>
                }
                >
                <div className="editButton">
                    {getIcon(mdiLink, t._link, 90)}
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                trigger="click"
                key="email"
                show={showEmail}
                onToggle={() => {setShowEmail(!showEmail); setShowLink(false); setShowImage(false)}}
                placement="bottom"
                overlay={
                    <Popover id="email">
                    <Popover.Content>
                    <Form onSubmit={emailClicked}>
                        <Form.Control type="text" placeholder={t._email} name="email" className="mr-2" />
                        <Form.Control type="submit" value={t._insert} />
                    </Form>
                    </Popover.Content>
                    </Popover>
                }
                >
                <div className="editButton">
                    {getIcon(mdiAt, t._email)}
                </div>
            </OverlayTrigger>
            <OverlayTrigger
                trigger="click"
                show={showImage}
                onToggle={() => {setShowImage(!showImage); setShowEmail(false); setShowLink(false)}}
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
                    {getIcon(mdiImageMultipleOutline, t._photo)}
                </div>
            </OverlayTrigger>
            <div className="editButton" onClick={toggleShowCard}>
                {getIcon(mdiCached, t._change_layout, 180)}
            </div>
            <Alert show={showAlert} variant={variantAlert}>{messageAlert}</Alert> 
        </Row>
        <Form noValidate
            onSubmit={handleSubmit}
            ref={formRef}>
            <Row>
                <Col>
                    <Form.Group controlId="validationFormikContent">
                        <Form.Control required as="textarea"
                            name="content"
                            value={content}
                            onChange={handleChange}
                            rows={23}
                            ref={textRef}>
                        </Form.Control>
                    </Form.Group>
                    <div className="text-right">
                        <Button className="mr-2" variant="outline-success" type="submit" disabled={submitting}>{t._save}</Button>
                        <Button variant="outline-info" onClick={handlePublish} disabled={submitting}>{published? t._unpublish : t._publish}</Button>
                    </div>
                </Col>
                <Col>
                <div hidden={!showCard}>
                    <PostCard post={props.post}/>
                </div>
                <div hidden={showCard}>
                    <Layout content={content} createdAt={props.post.createdAt}/>
                </div>
                </Col>
            </Row>
        </Form>
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