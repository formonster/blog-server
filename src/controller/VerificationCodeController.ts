import EmailServiceImpl from "@/service/EmailServiceImpl";
import ALiCloudServiceImpl from "@/service/ALiCloudServiceImpl";
import VerificationCodeServiceImpl from "@/service/VerificationCodeServiceImpl";
import { POST, route } from "awilix-koa";
import Router from "@koa/router";
import { resSuccess } from "@/utils/common";

@route('/api')
class ResultController {
    private emailService: EmailServiceImpl;
    private aLiCloudService: ALiCloudServiceImpl;
    private verificationCodeService: VerificationCodeServiceImpl;
    constructor({ emailService, verificationCodeService, aLiCloudService }: { emailService: EmailServiceImpl, verificationCodeService: VerificationCodeServiceImpl, aLiCloudService: ALiCloudServiceImpl }) {
        this.emailService = emailService;
        this.aLiCloudService = aLiCloudService;
        this.verificationCodeService = verificationCodeService;
    }

    /**
     * 发送手机验证码
     * @param recipient 收件人手机号
     */
    @route('/public/phone/sendCode')
    @POST()
    async sendPhoneCode(ctx: Router.RouterContext) {
        const { recipient } = ctx.request.body as any;

        // 新建 code
        const res = await this.verificationCodeService.addCode(recipient, "PHOME");
        const { id, code } = res.data;

        // 发送短信
        const sendRes = await this.aLiCloudService.sendCode(recipient, code);
        if (sendRes.code !== 200) throw new Error(sendRes.message);

        ctx.body = resSuccess({ id });
    }

    /**
     * 发送邮箱验证码
     * @param recipient 收件人邮箱
     */
    @route('/public/email/sendCode')
    @POST()
    async sendCode(ctx: Router.RouterContext) {
        const { recipient } = ctx.request.body as any;

        // 新建 code
        const res = await this.verificationCodeService.addCode(recipient, "EMAIL");
        const { id, code } = res.data;

        // 发送邮件
        const sendRes = await this.emailService.sendCode(recipient, code);
        if (sendRes.code !== 200) throw new Error(sendRes.message);

        ctx.body = resSuccess({ id });
    }

    /**
     * 发送邮箱激活链接
     * @param recipient 收件人邮箱
     */
    @route('/public/email/sendActivationEmail')
    @POST()
    async sendActivationEmail(ctx: Router.RouterContext) {
        const { account } = ctx.request.body as any;

        // 新建 code
        const res = await this.verificationCodeService.addCode(account, "EMAIL");
        const { id, code } = res.data;

        // 发送邮件
        const sendRes = await this.emailService.sendActiveLink(account, code);
        if (sendRes.code !== 200) throw new Error(sendRes.message);

        ctx.body = resSuccess({ id });
    }

    /**
     * 发送邮箱激活链接
     * @param recipient 收件人邮箱
     */
    @route('/public/email/activeEmail')
    @POST()
    async activeEmail(ctx: Router.RouterContext) {
        const { account, code } = ctx.request.body as any;

        // 激活邮件
        const sendRes = await this.verificationCodeService.activeEmail(account, code);

        ctx.body = sendRes;
    }

    /**
     * 验证输入的验证码是否正确
     * @param id 标识
     * @param code 验证码
     */
    @route('/public/email/checkVerificationCode')
    @POST()
    async checkVerificationCode(ctx: Router.RouterContext) {
        const { id, code } = ctx.request.body as any;
        const res = await this.verificationCodeService.checkVerificationCode(id, code);
        ctx.body = resSuccess(res.data);
    }
}

export default ResultController;