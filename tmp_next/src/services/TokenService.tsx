import { NextPageContext } from "next/types"
import Cookies from "universal-cookie"
import Router from 'next/router'

class TokenService {
    saveToken(token) {
        const cookies = new Cookies()
        cookies.set("token", token, {path: "/"})
        return Promise.resolve()
    }

    public async authenticateTokenSsr(ctx: NextPageContext) {
      const cookies = new Cookies(ctx.req ? ctx.req.headers.cookie : null)
      const token = cookies.get("token")
  
      // const response = await this.checkAuthToken(token)
      // if (!response.success) {
      //   const navService = new NavService()
      //   navService.redirectUser("/", ctx)
      // }
    }
}

export default TokenService;
