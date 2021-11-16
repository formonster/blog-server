import { GET, POST, route } from "awilix-koa";
import { createMathExpr } from "@/utils/code";
import Router from "@koa/router";
import { resError, resSuccess } from "@/utils/common";
import { BaseServiceImpl } from "@/service/BaseServiceImpl";
import { RegisterID } from "@/model/RegisterId";

@route('/api')
class EmailController {
    private baseService: BaseServiceImpl;
    constructor({ baseService }: { baseService: BaseServiceImpl }) {
        this.baseService = baseService;
    }
    @route('/public/code/createCode')
    @GET()
    async sendCode(ctx: Router.RouterContext) {
        const { registerId } = ctx.query as { registerId: string };

        const captcha = createMathExpr();
        const value = captcha.text.toLowerCase();

        // 查询是否存在
        const res = await this.baseService.get<RegisterID>({
            table: "thtt_register_id",
            where: {
                register_id: registerId,
            }
        })

        // 如果已存在
        if (res.data && res.data.id) {
            const { id } = res.data;
            this.baseService.put({
                table: "thtt_register_id",
                where: { id },
                data: { value }
            })
        } else {
            this.baseService.add<RegisterID>({
                table: "thtt_register_id",
                data: {
                    register_id: registerId,
                    value
                }
            })
        }
        ctx.session.captcha = value;

        ctx.response.type = 'image/svg+xml';
        ctx.body = captcha.data;
    }
    @route('/public/code/checkCode')
    @POST()
    async checkCode(ctx: Router.RouterContext) {
        const { code, registerId } = ctx.request.body as any;

        const res = await this.baseService.get<RegisterID>({
            table: "thtt_register_id",
            where: {
                register_id: registerId,
            }
        })

        const cacheCode = res.data.value;

        console.log("checkCode: ", cacheCode, code);
        if (!cacheCode) {
            ctx.body = resError("验证码已失效！");
            return;
        }

        // console.log("checkCode: ", ctx.session.captcha, code);
        // ctx.body = resSuccess(code === ctx.session.captcha);
        ctx.body = resSuccess(code === cacheCode);
    }
}

export default EmailController;