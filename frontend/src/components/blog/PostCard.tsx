import Card from 'react-bootstrap/Card'
import Image from 'next/image'
import { timestampToStringCompact } from 'utils/tsToString'

interface Props {
    post: Post,
}

function PostCard (props: Props) {

    return <Card bg="light" text="dark" className="blogCard">
        {props.post.cover && <Card.Img as={Image}
            variant="top"
            src={props.post.cover}
            className="blogCardImage"
            height="480"
            width="480"
            unoptimized/>}
        <Card.Title className="blogCardTitle">{props.post.title}</Card.Title>
        <Card.Subtitle className="blogCardAuthor">{props.post.author}, {timestampToStringCompact(props.post.createdAt.timestamp)}</Card.Subtitle>
        <Card.Text className="blogCardDescription">{props.post.description}</Card.Text>
    </Card>
}

export default PostCard