import React, {useEffect} from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useSession } from 'utils/SessionContext'
import { useTranslation } from 'utils/TranslationContext'
import { getTranslation } from 'utils/Translation'
import { GetStaticProps } from 'next'
import { InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'react-bootstrap/Image'


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

  if (state.loading) {
    return <></>
  } else {
    return <>
      <Row>
        <Col lg={{ span: 6, offset: 3 }}>
          <h1 className="text-center">{trans.common._welcome}</h1>
        </Col>
      </Row>
      <Row>
        <Image src="/front.webp" className="frontImage" alt="Photo front page"/>
      </Row>
      <Row>
        <Col lg={{ span: 8, offset: 2 }}>
          <p className="aboutMe">
            {trans.common._welcome_message}
          </p>
          <p className="aboutMe">
            {trans.common._gallery_presentation}<a href="https://www.instagram.com/benjamintrubert/" target="_blank" >Instagram</a>.
          </p>
          <p className="aboutMe">
            {trans.common._about_me}<Link href={"/blog/"+trans.common._about_me_link} >{trans.common._about_me_link}</Link>.
          </p>
          <p className="aboutMe">
            {trans.common._my_gear}<Link href={"/blog/"+trans.common._my_gear_link} >{trans.common._my_gear_link}</Link>.
          </p>
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