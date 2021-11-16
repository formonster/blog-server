// 解决 TS 别名在 React 项目中加载失败的问题
import 'module-alias/register'
import Koa from "koa";
import bodyParser from 'koa-bodyparser';
import { createContainer, Lifetime } from "awilix";
import { scopePerRequest, loadControllers } from "awilix-koa";
// npmjs.com/package/koa-session
import session from 'koa-session';
import cors from 'koa-cors'
import koajwt from "koa-jwt";
import { loadMiddware } from './middware';
import jwtConfig from '@/config/jwt';
import dotenv from "dotenv";

const CONFIG = {
    key: 'koa.sess', /** (string) cookie key (default is koa.sess) */
    /** (number || 'session') maxAge in ms (default is 1 days) */
    /** 'session' will result in a cookie that expires when session/browser is closed */
    /** Warning: If a session cookie is stolen, this cookie will never expire */
    maxAge: 86400000,
    autoCommit: true, /** (boolean) automatically commit headers (default true) */
    overwrite: true, /** (boolean) can overwrite or not (default true) */
    httpOnly: true, /** (boolean) httpOnly or not (default true) */
    signed: true, /** (boolean) signed or not (default true) */
    rolling: false, /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */
    renew: false, /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/
    // secure: true, /** (boolean) secure cookie*/
};

// 加载 .env 环境变量
dotenv.config();

const app = new Koa();

app.use(cors({
    credentials: true
}));

// POST 请求获取 body
app.use(bodyParser())
// 加载自定义中间件
loadMiddware(app);

app.keys = ['thtt_server'];
// session
app.use(session(CONFIG, app));

// 创建一个基础容器，负责装载服务
const container = createContainer();
// 加载 Service 模块
container.loadModules([`${__dirname}/service/*.ts`], {
    // 定义命名方式：驼峰形式
    formatName: "camelCase",
    resolverOptions: {
        // 每次调用都创建新的实例
        lifetime: Lifetime.SCOPED
    }
})


// 注入 container
app.use(scopePerRequest(container));
// 加载路由
app.use(loadControllers(`${__dirname}/controller/*.ts`));

app.use(
    koajwt({
        secret: jwtConfig.secretKey,
    }).unless({ path: jwtConfig.publicRouter })
);

app.listen(process.env.PORT, function () {
    console.log(`🚀 starting http://localhost:${process.env.PORT}`);
})