import { reqLogger, resLogger } from "@/utils/logger";
import Router from "@koa/router";

const errorHandler = async (ctx: Router.RouterContext, next: () => Promise<unknown>) => {
    reqLogger.info(ctx.request.url);
    await next();
    resLogger.info(ctx.body);
};
export default errorHandler;
