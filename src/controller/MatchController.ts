import { BaseServiceImpl, GetProps } from "@/service/BaseServiceImpl";
import { GET, POST, DELETE, PUT, route } from "awilix-koa";
import Router from "@koa/router";
import { CloudParams } from "@/model/CloudParams";
import { resSuccess } from "@/utils/common";
import MatchServiceImpl from "@/service/MatchServiceImpl";

@route('/api')
class BaseController {
    private baseService: BaseServiceImpl;
    private matchService: MatchServiceImpl;
    constructor({ baseService, matchService }: { baseService: BaseServiceImpl, matchService: MatchServiceImpl }) {
        this.baseService = baseService;
        this.matchService = matchService;
    }
    /**
     * 查询是否选择了订阅菜单
     * @param userId 用户标识
     */
    @route('/public/hasMatchSubscribeParams')
    @GET()
    async hasMatchSubscribeParams(ctx: Router.RouterContext) {
        const { userId } = ctx.query as any;
        ctx.body = await this.matchService.hasMatchParams(userId, 0);
    }
    /**
     * 查询是否选择了查询菜单
     * @param userId 用户标识
     */
    @route('/public/hasMatchSearchParams')
    @GET()
    async hasMatchSearchParams(ctx: Router.RouterContext) {
        const { userId } = ctx.query as any;
        ctx.body = await this.matchService.hasMatchParams(userId, 1);
    }
    /**
     * 订阅匹配
     * @param userId 用户标识
     */
    @route('/public/matchSubscribe')
    @GET()
    async matchSubscribe(ctx: Router.RouterContext) {
        const { userId } = ctx.query as any;
        ctx.body = await this.matchService.match(userId, 0);
    }
    /**
     * 查询匹配
     * @param userId 用户标识
     */
    @route('/public/matchSearch')
    @GET()
    async matchSearch(ctx: Router.RouterContext) {
        const { userId } = ctx.query as any;
        ctx.body = await this.matchService.match(userId, 1);
    }
}

export default BaseController;