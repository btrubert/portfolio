import { useTranslation } from 'utils/TranslationContext'

function Contact () {
    const [trans, dispatch] = useTranslation()

    return <h1 className="text-center">{trans.common._contact}</h1>
}

export default Contact