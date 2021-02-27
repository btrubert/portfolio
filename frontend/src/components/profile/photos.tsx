import React, { useState } from 'react'
import { useTranslation } from 'utils/TranslationContext'
import Link from 'next/link'
import Image from 'next/image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Photo from 'components/photo/Photo'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'


interface Props {
    photos: Array<Photo>
}

function Photos (props: Props) {
    const [trans, ] = useTranslation()
    const photos = props.photos 
    const [show, setShow] = useState<boolean>(false)
    const [currentIndex, setCurrentIndex] = useState<number>(0)

    return <>
            <Row>
                <Col>
                    <Link href="/profile" passHref>
                        <div className="mb-2 iconCursor">
                            <Icon path={mdiArrowLeft} color="black" size={1} />
                            {trans.common._back}
                        </div>
                    </Link>
                </Col>
            </Row>
            <Row> {
                photos.sort((a, b) => {return (a.exifs.date < b.exifs.date) ? 1 : -1}).map((p: Photo, index: number) => <Col className="gallery" sm={12}
                    md={6}
                    lg={4}
                    key={index}>
                    <Image className="gallery-photo" src={`/smf/img/${p.path}`}
                        width="480" height="480" unoptimized alt={p.title}
                        onClick={() => {setCurrentIndex(index); setShow(true)}} />
                </Col>)
            } </Row>
        <Photo photos={photos} index={currentIndex} onHide={() => setShow(false)} show={show} gallery={false} rootPath={"/smf/img/"} profile={true}/>
    </>
}

export default Photos
