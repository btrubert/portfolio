import React, { useRef } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Layout from './Layout'
import { Formik } from 'formik'
import * as yup from 'yup'


interface Props {
    initialContnent?: string,
    translation: {[key:string]: string},
}

interface FormValues {
    content: string,
}

function Editor (props: Props) {
    /* list buttons
    - italique *text*
    - bold **text**
    - italique bold _**text**_
    - code `text`
    - citation >text
    - list * text \\ 1 text
    - TITRE # text \\ ## text \\ ### text \\ #### text
    - lien [text](url "text")
    - image ![text](url "text")
    */
   const formRef = useRef<HTMLFormElement>(null)
   const t = props.translation

   const schema = yup.object({
       content: yup.string().required(),
   })

   const handleSubmitForm = () => {

   }
   let val = `---\ntitle: ${t._new_title}\nauthor: ${t._author}\n---\n`
    return <Formik validationSchema={schema}
            onSubmit={handleSubmitForm}
            validationOnBlur={false}
            validationOnChange={false}
            initialValues={
                {
                    content: `---\ntitle: ${t._new_title}\nauthor: ${t._author}\n---\n`,
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
                        <p>icons</p>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="validationFormikContent">
                                <Form.Control required as="textarea"
                                    name="content"
                                    value={values.content}
                                    onChange={handleChange}
                                    rows={23}>
                
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col>
                            <Layout content={values.content} />
                        </Col>
                    </Row>
                </Form>}
        </Formik>
    
}

export default Editor