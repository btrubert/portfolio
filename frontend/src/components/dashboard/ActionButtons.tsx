import Button from 'react-bootstrap/Button'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Popover from 'react-bootstrap/Popover'

interface Props {
    editClicked: () => void,
    deleteClicked: () => void,
    translation: {[key:string]: string},
    item: Item
}

export default function ActionButtons (props: Props) {
    const t = props.translation

    return <>
    <Button className="mr-2" variant="outline-info" onClick={() => props.editClicked()}>{t._edit}</Button>
    <OverlayTrigger trigger={"focus"}
        key={'d'+props.item.id}
        placement="top"
        overlay={
            <Popover id={'d'+props.item.id}>
            <Popover.Content>
                <Button className="mr-2" variant="success" onClick={() => props.deleteClicked()}>{t._confirm}</Button>
                <Button variant="warning">{t._cancel}</Button>
            </Popover.Content>
            </Popover>
        }
        >
        <Button  variant="outline-danger">{t._delete}</Button>
    </OverlayTrigger>
    </>
}