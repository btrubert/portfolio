import { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

type Data = string

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    let transporter = nodemailer.createTransport({
        host: "ssl0.ovh.net",
        port: 465,
        secure: true,
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASSWORD
        }
    })

    transporter.verify((error, success) => {
        if (error) {
            res.status(500)
            res.end()
        }
    })

    const addressContact = req.body.locale === 'en' ? "no-reply" : "ne-pas-repondre"
    const footerMessage = req.body.locale === 'en' ? "This email was sent by an automatic email address. Do not respond to this email."
            : "Cet email a été envoyé à partir d'une adresse email automatique. Veuillez ne pas répondre à cet email."

    let info = await transporter.sendMail({
        from: `${addressContact}@benjamintrubert.fr`,
        to: req.body.email,
        bcc: 'contact@benjamintrubert.fr',
        subject: `[Contact] ${req.body.subject}`,
        html: `<p>${req.body.message}</p><br/><i>${footerMessage}</i>`,
    }, (error, info) => {
        if (error) {
            res.status(401)
            res.end()
        } else {
            res.status(200)
            res.end()
        }
    })


}