import React, {useState} from 'react'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import {Container, Row, Col} from 'react-bootstrap/'
import Card from 'react-bootstrap/Card'
import Carousel from 'react-bootstrap/Carousel'
import Link from 'next/link'
import Image from 'next/image'


function Categories(props: InferGetStaticPropsType<typeof getStaticProps>) {
    const imgBaseUrl = props.imgBaseUrl
    const categories = props.categories
    const [play, setPlay] = useState(props.play)

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

    return (
        <Container className="main-content">
            <Row> {
                categories.map((c: Category, index: number) => <Col className="category-cards"
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
                                c.photos.map((p, index: number) => <Carousel.Item key={index}>
                                    <Card.Img as={Image} src={"/uploads/" + p.path}
                                        alt="Card category's images"
                                        className="category-card-img"
                                        height="480"
                                        width="480"
					unoptimized/>
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
    const response = await fetch(process.env.SYMFONY_URL+"/categories")
    const categories: Array<Category> =  await response.json()
    const play: Array<number> = Array(categories.length).fill(null)
    const imgBaseUrl: string = process.env.BACKEND_URL + '/uploads/'
    return {
        props: {categories, play, imgBaseUrl},
        revalidate: 1,
    }
}
  

export default Categories
