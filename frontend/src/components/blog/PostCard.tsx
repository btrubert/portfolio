import Card from 'react-bootstrap/Card'
import Image from 'next/image'

interface Props {
    post: Post,
}

function PostCard (props: Props) {

    const timestampToString = (ts: number) => {
        let d = new Date(ts*1000)
        return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`
    }

    return <Card bg="light" text="dark" className="blogCard">
        <Card.Img as={Image}
            variant="top"
            src={props.post.cover ?? ''}
            className="blogCardImage"
            height="480"
            width="480"
            unoptimized/>
        <Card.Title className="blogCardTitle">{props.post.title}</Card.Title>
        <Card.Subtitle className="blogCardAuthor">{props.post.author}, {timestampToString(props.post.createdAt.timestamp)}</Card.Subtitle>
        <Card.Text className="blogCardDescription">{props.post.description}</Card.Text>
    </Card>
}

export default PostCard