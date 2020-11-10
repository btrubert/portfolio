
interface Props {
    photos: Array<Photo>,
    editClicked: (item: Photo) => void,
    deleteClicked: (item: Photo) => void,
    refresh:  () => void,
}

export default function PhotosList (props: Props) {
    return null
}