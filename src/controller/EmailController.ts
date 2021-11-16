import EmailServiceImpl from "@/service/EmailServiceImpl";
import { GET, POST, route } from "awilix-koa";
import Router from "@koa/router";

@route('/api')
class EmailController {
    private emailService: EmailServiceImpl;
    constructor({ emailService }: { emailService: EmailServiceImpl }) {
        this.emailService = emailService;
    }
    @route('/email/sendCode')
    @POST()
    async sendCode(ctx: Router.RouterContext) {
        const { recipient, code } = ctx.request.body as any;
        ctx.body = await this.emailService.sendCode(recipient, code);
    }
}

export default EmailController;