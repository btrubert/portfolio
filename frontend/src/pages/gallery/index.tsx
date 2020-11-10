import React, {useState} from "react"
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import {Container, Row, Col} from 'react-bootstrap/'
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel'
import Link from 'next/link'
import Image from 'next/image'

interface Photo {
    title: string,
    path: string,
    exifs: Array<any>
}

interface Category {
    name: string,
    photos: Array<Photo>
}


function Categories(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const imgBaseUrl = props.imgBaseUrl
    const categories = props.categories
    const [play, setPlay] = useState(props.play)

    const handlePlay = (index) => {
        const play_ = play.slice();
        play_[index] = 500;
        setPlay(play_)
    }

    const handleStop = (index) => {
        const play_ = play.slice();
        play_[index] = null;
        setPlay(play_)
    }

    return (
        <Container className="main-content">
            <Row> {
                categories.map((c, index) => <Col className="category-cards"
                    sm={12}
                    md={6}
                    lg={4}
                    key={index}>
                    <Link href={"/gallery/${encodeURIComponent(c.name)}"} as={"/gallery/"+c.name} passHref>
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
                                c.photos.map((p, index) => <Carousel.Item key={index}>
                                    <Card.Img as={Image} src={imgBaseUrl+p.path}
                                        alt="Card category's images"
                                        className="category-card-img"
                                        height="480"
                                        width="480"/>
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
        </Container>
    );
}

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch("http://127.0.0.1:8000/api/categories")
    const categories: Array<Category> =  await response.json()
    const play: Array<number> = Array(categories.length).fill(null)
    const imgBaseUrl: string = process.env.SYMFONY_URL + '/img/'
    return {
        props: {categories, play, imgBaseUrl},
        revalidate: 1,
    }
}
  

export default Categories