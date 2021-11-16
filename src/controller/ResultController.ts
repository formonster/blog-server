import ResultServiceImpl from "@/service/ResultServiceImpl";
import { GET, route } from "awilix-koa";
import Router from "@koa/router";

const scopes = [
    {
        scopeName: "先进制造",
        scopeId: "d6d5f750878c11eb800b29fd3217a134",
    },
    {
        scopeName: "节能环保",
        scopeId: "ff2db990878c11ebbde9e797d995acb3",
    },
    {
        scopeName: "新型材料",
        scopeId: "622449d0d41111eb825aa78209a08e3f",
    },
    {
        scopeName: "现代农业",
        scopeId: "f82900a0878c11eb800b29fd3217a134",
    },
    {
        scopeName: "生物医药",
        scopeId: "dec7a850878c11ebbde9e797d995acb3",
    },
    {
        scopeName: "信息技术",
        scopeId: "e8387f40878c11eb800b29fd3217a134",
    },
]

@route('/api')
class ResultController {
    private resultService: ResultServiceImpl;
    constructor({ resultService }: { resultService: ResultServiceImpl }) {
        this.resultService = resultService;
    }
    /**
     * 获取六大领域的成果数量
     */
    @route('/piblic/result/scopeCountSix')
    @GET()
    async scopeCountSix(ctx: Router.RouterContext) {
        ctx.body = await this.resultService.scopeCount(scopes);
    }
    /**
     * 获取六大领域的成果数量
     */
    @route('/piblic/result/scopeCountSixHZ')
    @GET()
    async scopeCountSixHZ(ctx: Router.RouterContext) {
        ctx.body = await this.resultService.scopeCount(scopes, { platform: "HZ" });
    }
}

export default ResultController;