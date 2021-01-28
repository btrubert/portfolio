import React, { useState } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel'
import Link from 'next/link'
import Image from 'next/image'


interface Props {
    categories: Array<Category>,
    play: Array<number | null>,
    rootPath?: string,
    rootLink?: string,
}

function Categories (props: Props) {
    const categories = props.categories
    const [play, setPlay] = useState(props.play)
    const rootPath = props.rootPath ?? "/uploads/"
    const rootLink = props.rootLink ?? "/gallerie/"

    const handlePlay = (index: number) => {
        const play_ = play.slice();
        play_[index] = 500;
        setPlay(play_)
    }

    const handleStop = (index: number) => {
        const play_ = play.slice();
        play_[index] = null;
        setPlay(play_)
    }

    return <Row>{
            categories.map((c: Category, index: number) => <Col className="category-cards"
                sm={12}
                md={6}
                lg={4}
                key={index}>
                <Link href={`${rootLink}${encodeURIComponent(c.name)}`} as={`${rootLink}${c.name}`} passHref>
                    <a>
                    <Card className="text-white category-card"
                        onMouseOver={
                            () => handlePlay(index)
                        }
                        onMouseOut={
                            () => handleStop(index)
                        }
                        onTouchStart={
                            () => handlePlay(index)
                        }
                        onTouchEnd={
                            () => handleStop(index)
                    }>
                        <Carousel indicators={false}
                            wrap={true}
                            interval={
                                play[index]
                            }
                            controls={false}
                            pause={false}>
                            {
                            c.photos.sort((a, b) => {return (a.exifs.date < b.exifs.date) ? -1 : 1})
                            .map((p, index: number) => <Carousel.Item key={index}>
                                <Card.Img as={Image} src={rootPath + p.path}
                                    className="category-card-img"
                                    height="480"
                                    width="480"
                                    unoptimized
                                    alt={p.title}
                                    />
                            </Carousel.Item>)
                        } </Carousel>

                        <Card.ImgOverlay className="category-card-text">
                            <Card.Text className="text-center" as="h3">
                                {
                                c.name
                            }</Card.Text>
                        </Card.ImgOverlay>
                    </Card>
                    </a>
                </Link>
            </Col>)
        } </Row>
}

export default Categories