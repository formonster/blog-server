export default {
    // user: '1523446700@qq.com',
    // pass: 'axdfplpxrstgfjif',
    user: '18811484300@163.com',
    pass: 'KKTXXVCUALMLJPSB',
    codeTitle: "【首都海智】验证码",
    // activeLinkHost: "http://www.tianhe-cloud.com",
    // activeLinkHost: "http://localhost:3300",
    activeLinkHost: "http://www.tianhe-cloud.com/hz",
    codeTemplate: (code: string) => `<p>您正在注册称为新用户，您的验证码是：<span style="color: #e03442; font-weight: bold; font-size: 20px; text-decoration: underline;">${code}</span>，感谢您的支持！</p>`,
    activeLinkTemplate: (host: string, account: string, code: string) => `<p>请点击此 <a href="${host}/#/emailActive/${account}/${code}" style="color: #e03442; font-weight: bold; font-size: 20px; text-decoration: underline;">链接</a> 激活您的账号！</p>`
}