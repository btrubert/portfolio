import { NextApiRequest, NextApiResponse } from 'next'

type Data = Array<Category> | Array<Photo> | Array<User>

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        query: { entity },
    } = req
    if (typeof entity !== 'string' || ['categories', 'photos', 'users'].indexOf(entity) === -1) {
        res.status(404)
    } else {
        const response = await fetch(process.env.SYMFONY_URL + "/admin/dashboard/" + entity, {
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
            res.status(200).json(data)
        } else {
            res.status(401)
        }
    }
}