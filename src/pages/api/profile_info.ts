export default async function handler(req, res) {
    console.log(typeof req.headers.cookie)
    const response = await fetch(process.env.SYMFONY_URL + "/api/profile_info", {
        headers: {
            cookie: req.headers.cookie
        }
    })
    if (response.headers.has('set-cookie')) {
        const cookies = response.headers.get('set-cookie')
        const re = /(([A-Z]+=\w+)(; ((expires=[ ,\w\-\:]+GMT)|([A-Za-z\-]+(=[\w \/]+)?)))+)/g
        const res_cookies = cookies.match(re)
        res.setHeader("set-cookie", res_cookies)
    }
    const data = await response.json()
    res.status_code = 200
    res.end(JSON.stringify(data))
}
