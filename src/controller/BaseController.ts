import { BaseServiceImpl, GetProps } from "@/service/BaseServiceImpl";
import { GET, POST, DELETE, PUT, route } from "awilix-koa";
import Router from "@koa/router";

@route('/api/base')
class BaseController {
    private baseService: BaseServiceImpl;
    constructor({ baseService }: { baseService: BaseServiceImpl }) {
        this.baseService = baseService;
    }
    @route('/get')
    @GET()
    async get(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.get(ctx.query as any);
    }
    @route('/list')
    @GET()
    async list(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.list(ctx.query as any);
    }
    @route('/add')
    @POST()
    async add(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.add(ctx.request.body as any);
    }
    @route('/put')
    @PUT()
    async put(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.put(ctx.request.body as any);
    }
    @route('/del')
    @DELETE()
    async del(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.del(ctx.request.query as any);
    }
    @route('/remove')
    @DELETE()
    async remove(ctx: Router.RouterContext) {
        ctx.body = await this.baseService.remove(ctx.request.query as any);
    }
}

export default BaseController;