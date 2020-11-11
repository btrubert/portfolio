import { NextApiRequest, NextApiResponse } from 'next'

type Data = string | null


export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        query: { slug },
    } = req
    if (typeof slug !== 'object' || ['category', 'photo', 'user'].indexOf(slug[0]) === -1 || isNaN(+slug[1])) {
        res.status(404)
        res.end()
    } else {
        if (req.method === 'GET') {
            const response = await fetch(process.env.SYMFONY_URL + "/admin/dashboard/" + slug[0] + "/delete/" + slug[1], {
                method: 'GET',
                headers: {
                    cookie: req.headers.cookie ?? ""
                },
            })
            if (response.ok) {
                const cookies = response.headers.get('set-cookie')
                if (cookies) {
                    const re = /(([A-Z]+=\w+)(; ((expires=[ ,\w\-\:]+GMT)|([A-Za-z\-]+(=[\w \/]+)?)))+)/g
                    const res_cookies = cookies.match(re)
                    res.setHeader("set-cookie", res_cookies ?? "")
                }
                const data = await response.text()
                res.status(200).json(data)
            }
            res.status(401)
            res.end()
        }
        if (req.method === 'POST') {
            console.log(req.body)
            const response = await fetch(process.env.SYMFONY_URL + "/admin/dashboard/" + slug[0] + "/delete/" + slug[1], {
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
                console.log(data)
                res.status(200).json(data)
            }
            res.status(401)
            res.end()
        }
    }
    res.status(500)
    res.end()
}