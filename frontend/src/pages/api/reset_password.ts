import { NextApiRequest, NextApiResponse } from 'next'

type Data = string

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const response = await fetch(process.env.SERVEUR_URL + "/smf/reset_password", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            cookie: req.headers.cookie ?? ""
        },
        body: new URLSearchParams(req.body).toString()
    })
    if (response.ok) {
        const cookies = response.headers.get('set-cookie')
        if (cookies) {
            const re = /(([A-Z]+=\w+)(; ((expires=[ ,\w\-\:]+GMT)|([A-Za-z\-]+(=[\w \/]+)?)))+)/g
            const res_cookies = cookies.match(re)
            res.setHeader("set-cookie", res_cookies ?? "")
        }
        const data = await response.json()
        const subject = req.body.locale === 'en' ? "Password reset" : "Nouveau mot de passe"
        const message = req.body.locale === 'en' ? `Your new password is : ${data.password}. You can change it now in your profile page.`
                : `Votre nouveau mot de passe est : ${data.password}. Vous pouvez le changer dès maintenant dans votre profile.`
        const email = await fetch(process.env.SERVEUR_URL + "/api/contact", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({'reset': true, 'subject': subject, locale: req.body.locale, 'email': data.email, 'message': message})
        })
        if (email.ok) {
            res.status(200).end()
        } else {
            res.status(503).end()
        }
    } else {
        res.status(401)
        res.end()
    }
}
