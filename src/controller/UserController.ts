import UserServiceImpl from "@/service/UserServiceImpl";
import { POST, route } from "awilix-koa";
import Router from "@koa/router";

@route('/api')
class UserController {
    private userService: UserServiceImpl;
    constructor({ userService }: { userService: UserServiceImpl }) {
        this.userService = userService;
    }

    /**
     * 判断账号是否已注册
     */
    @route('/public/user/isExist')
    @POST()
    async isExist(ctx: Router.RouterContext) {
        const { account } = ctx.request.body as any;
        ctx.body = await this.userService.isExist(account);
    }
}

export default UserController;