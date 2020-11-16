import Icon from '@mdi/react'
import {mdiAlertCircleOutline} from '@mdi/js'

export default function Error() {
    return <>
    <h1><Icon path={mdiAlertCircleOutline} size={2} spin/> Error 404 : </h1>
    <h3>An error occured, either the page you are trying to reach does not exist or is currently not available.
        Please try again later</h3>
    </>
}