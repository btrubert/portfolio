import React, {useState} from 'react'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import Image from 'next/image'
import {Container, Row, Col} from 'react-bootstrap/'
import Photo from '../../components/Photo'


function Photos (props: InferGetStaticPropsType<typeof getStaticProps>) {
    const imgBaseUrl = props.imgBaseUrl
    const photos = props.photos 
    const [show, setShow] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0)

    return (<Container className="main-content">
                <Row> {
                    photos.map((p: Photo, index: number) => <Col className="gallery" sm={12}
                        md={6}
                        lg={4}
                        key={index}>
                        <Image className="gallery-photo" src={props.imgBaseUrl + p.path}
                        width="480" height="480"
                        onClick={() => {setCurrentIndex(index); setShow(true)}} />
                    </Col>)
                } </Row>
            <Photo photos={photos} index={currentIndex} onHide={() => setShow(false)} show={show} imgBaseUrl={props.imgBaseUrl}/>
            </Container>
    );
}

export async function getStaticPaths() {
    const response = await fetch(process.env.SYMFONY_URL+"/api/categories")
    const categories = await response.json()
    const paths = categories.map((c: Category) => ({
        params: { category: c.name },
      }))
    return {
      paths: paths,
      fallback: 'blocking',
    };
  }
  

export const getStaticProps: GetStaticProps = async (context) => {
    const response = await fetch(process.env.SYMFONY_URL+"/api/gallery/"+ context.params?.category)
    const photos: Array<Photo> = await response.json()
    const imgBaseUrl: string = process.env.SYMFONY_URL + '/uploads/'
    return {
        props: {photos, imgBaseUrl},
        revalidate: 1,
    }
}

export default Photos