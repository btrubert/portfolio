import { NextApiRequest, NextApiResponse } from 'next'

type Data = string | null

export const config = {
    api: {
      bodyParser: {
        sizeLimit: '64mb',
      },
    },
  }
  

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    const {
        query: { entity },
    } = req
    if (typeof entity !== 'string' || ['category', 'photo', 'user'].indexOf(entity) === -1) {
        res.status(404)
        res.end()
    } else {
        if (req.method === 'GET') {
            const response = await fetch(process.env.SYMFONY_URL + "/admin/dashboard/" + entity + "/new", {
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
            res.status(400)
            res.end()
        }
        if (req.method === 'POST') {
            const response = await fetch(process.env.SYMFONY_URL + "/admin/dashboard/" + entity + "/new", {
                method: 'POST',
                headers: {
                    'Content-Type': req.headers['content-type'] ?? "",
                    cookie: req.headers.cookie ?? ""
                },
                body: req.body
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
            }
            res.status(400)
            res.end()
        }
    }
    res.status(500)
    res.end()
}