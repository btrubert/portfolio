import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslation } from 'utils/TranslationContext'
import Image from 'react-bootstrap/Image'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Icon from '@mdi/react'
import { mdiArrowLeft } from '@mdi/js'

interface Props {
    photo: Photo,
    linkHref: string,
    linkAs: string,
}

function ZoomPhoto (props: Props) {
    const [trans, ] = useTranslation()
    const [Mx, setMx] = useState<number>(0)
    const [My, setMy] = useState<number>(0)
    const [zoomState, setZoomState] = useState<number>(0)
    const [mobile, setMobile] = useState<boolean>(false)
    const [styleModalZoom, setStyleModalZoom] = useState<{[key:string]:string}>({cursor: "zoom-in", margin: "auto"})
    const [styleImageZoom, setStyleImageZoom] = useState<{[key:string]:string}>({maxHeight: "80vh", maxWidth: "100%"})
    const image = useRef<HTMLImageElement>(null)


    const photo = props.photo

    useEffect(() => {
        let top: number, left: number
        if (!mobile) { // disable zoom for touch screens
            switch (zoomState) {
                case 0: {
                    setStyleModalZoom({cursor: "zoom-in", margin: "auto"})
                    setStyleImageZoom({"maxHeight": "80vh", "maxWidth": "100%"})
                    break;
                }
                case 1: {
                    if (window.innerHeight/window.innerWidth < (image.current?.naturalHeight ?? 0) / (image.current?.naturalWidth ?? 1)) {
                        // fixed width
                        top = 42-2*42*My/window.innerHeight
                        const sizePhoto = (image.current?.width ?? 0)*window.innerHeight/(image.current?.height ?? 1)
                        left = (window.innerWidth-sizePhoto)/2
                    } else { // fixed height
                        const sizePhoto = (image.current?.height ?? 0)*window.innerWidth/(image.current?.width ?? 1)
                        top = (window.innerHeight-sizePhoto)/2
                        left = 42-2*42*Mx/window.innerWidth
                    }
                    setStyleModalZoom({cursor: "zoom-in", position: "fixed", zIndex: "1", padding: "42px", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"})
                    setStyleImageZoom({position: "fixed", maxHeight: "100vh", maxWidth: "100vw", top: `${top}px`, left: `${left}px`})
                    break;
                }
                case 2: {
                    if ((image.current?.naturalWidth ?? 0) < window.innerWidth) {
                        left = (window.innerWidth-(image.current?.naturalWidth ?? 0))/2
                    } else {
                        left = 42-((image.current?.naturalWidth ?? 1)+84-window.innerWidth)*Mx/window.innerWidth
                    }
                    if ((image.current?.naturalHeight ?? 0) < window.innerHeight) {
                        top = (window.innerHeight-(image.current?.naturalHeight ?? 0))/2
                    } else {
                        top = 42-((image.current?.naturalHeight ?? 1)+84-window.innerHeight)*My/window.innerHeight
                    }
                    setStyleModalZoom({cursor: "zoom-out", position: "fixed", zIndex: "1", padding: "42px", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)"})
                    setStyleImageZoom({position: "fixed", height: `${image.current?.naturalHeight}px`, width: `${image.current?.naturalWidth}px`, top: `${top}px`, left: `${left}px`})
                    break;
                }
            }
        }
    }, [zoomState, Mx, My])

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        setMx(event.clientX)
        setMy(event.clientY)
    }

    const handleClickZoom = () => {
        setZoomState((zoomState+1)%3)
    }

    return <>
        <Row>
            <Col>
            <Link href={props.linkHref} as={props.linkAs} passHref>
                <div className="mb-2 iconCursor" >
                    <Icon path={mdiArrowLeft} color="black" size={1} />{trans.common._back}
                </div>
            </Link>
            </Col>
        </Row>
        <Row>
            <div className="modal-zoom" style={styleModalZoom} onTouchStart={() => setMobile(true)} onMouseMove={handleMouseMove} onClick={handleClickZoom}>
                <Image className="image-zoom" style={styleImageZoom} src={`/smf/img/${photo.originalPath}`}
                    alt={photo.title}
                    ref={image}/>
            </div>
        </Row>
        <style global jsx>
            {`.modal-zoom {
                ${styleModalZoom}
            }
            .image-zoom {
                ${styleImageZoom}
            }`}
        </style>
    </>
}

export default ZoomPhoto
