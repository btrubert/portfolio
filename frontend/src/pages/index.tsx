import React, {useEffect} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import Media from 'react-bootstrap/Media'
import Image from 'next/image'
import Icon from '@mdi/react'
import { mdiEmoticonExcited, mdiCameraIris, mdiCamera } from '@mdi/js';


function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const [state, dispatchS] = useSession()
  const [trans, dispatch] = useTranslation()
  const router = useRouter()

  useEffect(() => {
    if (!trans.commonTrans) {
        dispatch({
            type: 'setCommon',
            payload: JSON.parse(props.commonT),
        })
    }
  }, [router.locale])

  const Iris = <Icon path={mdiCameraIris} color="white" size={1} />
  const Camera = <Icon path={mdiCamera} color="white" size={1} />

  if (state.loading) {
    return <></>
  } else {
    return <>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <h1 className="text-center">Welcome traveller !</h1>
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 8, offset: 2 }}>
          <h3>About me.</h3>
          <p className="aboutMe">
          I am Benjamin Trubert a French photographer from the South of Brittany.
          I practice photography as a hobby, and mostly is my main reason to go outside and enjoy the nature.
          I shoot mostly landscape, birds and sometimes insects with a macro lens. You can find exemples of my work in the gallery section.
          </p>
          <p className="aboutMe">
          I started taking photos back in 2012 with my Fuji x10, a nice little camera with the possibility to choose  the aperture, shutter speed and Iso:
          a huge step from old compact cameras.
          Thanks to online content, I've taught myself how to capture light, compose a photo.
          </p>
          <p className="aboutMe">
          In 2016, I decided to invest in my first DSLR: a Nikon D750 with a 24mm and a 50mm. I started to learn and use it the summer before I left to Finland to finish my master in Computer Science.
          </p>
        </Col>
      </Row>
      <Row>
      <Col lg={{ span: 8, offset: 2 }}>
        <Media>
          <Image src="/profile.jpg" width={360} height={240} className="align-self-start mr-3" alt="Autoportrait - stars gazer"/>
          <Media.Body>
              <p className="aboutMe">
              Finland was really the best place for me to really get into photography.
              It was by far the best sunrises and sunsets I have ever seen.
              There, I experimented landscape photography techniques.
              Because of Finland, I also had plenty of time to photograph the night sky during winter <Icon path={mdiEmoticonExcited}
              color="white" size={1} />.
              </p>
          </Media.Body>
        </Media>
        </Col>
        <Col lg={{ span: 8, offset: 2 }}>
          <p className="aboutMe">
            After that, I moved to Switzerland, where I continued shooting landscape, falling in love mountains.
            The Swiss mountains are diversed and full of really good spots for hiking and bivouac and the panoramas are breathtaking.
          </p>
          <p className="aboutMe">
            I finally moved back home in South of Brittany. Then, I started to practice shooting birds, which is for me quite challenging compared to the slow pace of landscape photography.
            Fortunaly, there's plenty of them, all of different sizes.
          </p>
        </Col>
      </Row>
      <Row>
        <Col lg={{ span: 8, offset: 2 }}>
          <h3>My gear.</h3>
            <ul className="aboutMe">
              <li>{Camera} Nikon D750</li>
              <li>{Camera} Nikon Z50</li>
              <li>{Iris} Samyang 14mm f/2.8</li>
              <li>{Iris} Nikon 24mm f/1.8</li>
              <li>{Iris} Nikon 50mm f/1.8</li>
              <li>{Iris} Samyang 85mm f/1.4</li>
              <li>{Iris} Tamron 90mm f/2.8</li>
              <li>{Iris} Nikon 300mm pf f/4</li>
              <li>{Camera} Fuji X100f</li>
            </ul>
        </Col>
      </Row>
    </>
  }
}

export const getStaticProps: GetStaticProps = async (context) => {
  const defaultLocale = context.defaultLocale ?? 'en'
  const locale = context.locale ?? defaultLocale
  const commonT = getTranslation('common', locale)
  return {
      props: {commonT},
      revalidate: 60,
  }
}


export default Home