export default async function handler(req, res) {
    const response = await fetch(process.env.SYMFONY_URL + "/api/profile_info/", {
        headers: {cookie: req.headers.cookie},
    })
    const cookies = response.headers.get('set-cookie')
    res.setHeader('set-cookie', cookies)
    const data = await response.json()
    res.status_code = 200
    res.end(JSON.stringify(data))
}
