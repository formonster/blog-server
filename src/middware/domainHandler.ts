import Router from "@koa/router";

const domainHandler = async (ctx: Router.RouterContext, next: () => Promise<unknown>) => {

    // 判断 ctx.req.headers.origin 进行跨域处理
    // https://developer.mozilla.org/zh-CN/docs/Glossary/CORS
    // 指示请求的资源能共享给哪些域。
    if (ctx.req.headers.origin !== undefined) {
        ctx.append("Access-Control-Allow-Origin", "*");
        ctx.append("Access-Control-Allow-Credentials", "true");
        ctx.append("Access-Control-Allow-Headers", "*");
        ctx.append("Access-Control-Allow-Methods", "*");
    }
    await next();
};
export default domainHandler;
