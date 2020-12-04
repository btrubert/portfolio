import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Col from 'react-bootstrap/Col'

interface Props {
    handleReset: () => void,
    isSubmitting: boolean,
    submitting: boolean,
    showAlert: boolean,
    variantAlert: string,
    messageAlert: string,
    translation: {[key:string]: string},
    type: string,
}

export default function FormButtons (props: Props) {
    const t = props.translation
    let save = t._save
    switch (props.type) {
        case 'category': save = t._save_category; break
        case 'photo': save = t._save_photo; break
        case 'user': save = t._save_user; break
        case 'post': save = t._save_post; break
    }

    return <>
    <Col md={4}>
        <OverlayTrigger
            key="savedPop"
            show={props.isSubmitting || props.submitting}
            placement="right"
            overlay={
                <Popover id="savedPop">
                <Popover.Content>
                    <Spinner animation="border" role="status" variant="success">
                        <span className="sr-only">{t._loading}</span>
                    </Spinner>
                </Popover.Content>
                </Popover>
            }
            >
            <Button type="submit" disabled={props.isSubmitting || props.submitting}>{save}</Button>
        </OverlayTrigger>
    </Col>
    <Col className="text-right" md={{span: 4, offset: 4}} hidden={props.isSubmitting || props.submitting || props.showAlert}>
        <Button type="button" onClick={props.handleReset}>{t._reset}</Button>
    </Col>
    <Col sm={8}>
        <Alert show={props.showAlert} variant={props.variantAlert}>{props.messageAlert}</Alert>
    </Col>
    </>
}