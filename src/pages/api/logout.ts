export default async function handler(req, res) {
    const response = await fetch(process.env.SYMFONY_URL + "/logout", {
        method: 'POST',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            cookie: req.headers.cookie
        },
        body: new URLSearchParams(req.body).toString()
    })
    // TODO: response.ok
    const cookies = response.headers.get('set-cookie')
    const re = /(([A-Z]+=\w+)(; ((expires=[ ,\w\-\:]+GMT)|([A-Za-z\-]+(=[\w \/]+)?)))+)/g
    const res_cookies = cookies.match(re)
    res.setHeader("set-cookie", res_cookies)
    res.satus_code = 200
    res.end(JSON.stringify("Disconnected!"))
}
