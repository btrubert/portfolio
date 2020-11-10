import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    user: User,
    token: string,
}

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    console.log(typeof req.headers.cookie)
    const response = await fetch(process.env.SYMFONY_URL + "/api/profile_info", {
        headers: {
            cookie: req.headers.cookie ?? ""
        }
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
