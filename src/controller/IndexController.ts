
import { GET, route } from "awilix-koa";
import Router from "@koa/router";
import { IndexServiceImpl } from "@/service/IndexServiceImpl";

@route("/api")
class IndexController {
    private indexService: IndexServiceImpl;
    constructor({ indexService }: { indexService: IndexServiceImpl }) {
        this.indexService = indexService;
    }
    @route('/hello')
    @GET()
    async hello(ctx: Router.RouterContext) {
        const { msg } = ctx.request.query;
        if (msg === "error") throw new Error("要到了异常！");
        ctx.body = await this.indexService.hello(msg as string);
    }
}
export default IndexController;