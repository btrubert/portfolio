import { NextApiRequest, NextApiResponse } from 'next'

type Data = string

export default async (req: NextApiRequest, res: NextApiResponse<Data>) => {
    if (req.method === 'GET'){
        res.status(200).json("ok")
    } else if (req.method === 'POST') {
        res.status(200).json("ok")
    }
}