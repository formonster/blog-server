import DemandServiceImpl from "@/service/DemandServiceImpl";
import { GET, route } from "awilix-koa";
import Router from "@koa/router";
import { resSuccess } from "@/utils/common";
import { getResponseAllSettledRes } from "@/utils/promise";

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
class DemandController {
    private demandService: DemandServiceImpl;
    constructor({ demandService }: { demandService: DemandServiceImpl }) {
        this.demandService = demandService;
    }
    /**
     * 获取六大领域的需求数量
     */
    @route('/piblic/demand/scopeCountSix')
    @GET()
    async scopeCountSix(ctx: Router.RouterContext) {

        const [scopeCountRes, scopeYearAddCountRes] = await Promise.allSettled([
            this.demandService.scopeCount(scopes),
            this.demandService.scopeYearAddCount(scopes)
        ])
        ctx.body = resSuccess([
            getResponseAllSettledRes(scopeCountRes, []),
            getResponseAllSettledRes(scopeYearAddCountRes, []),
        ]);
    }
    /**
     * 获取六大领域的需求数量
     */
    @route('/piblic/demand/scopeCountSixHZ')
    @GET()
    async scopeCountSixHZ(ctx: Router.RouterContext) {

        const [scopeCountRes, scopeYearAddCountRes] = await Promise.allSettled([
            this.demandService.scopeCount(scopes, { platform: "HZ" }),
            this.demandService.scopeYearAddCount(scopes, { platform: "HZ" })
        ])
        ctx.body = resSuccess([
            getResponseAllSettledRes(scopeCountRes, []),
            getResponseAllSettledRes(scopeYearAddCountRes, []),
        ]);
    }
    /**
     * 获取六大领域的需求数量（地区版）
     */
    @route('/piblic/demand/scopeCountSixRegion')
    @GET()
    async scopeCountSixRegion(ctx: Router.RouterContext) {

        const { regionId, regionLevel } = ctx.query as any

        const [scopeCountRes, scopeYearAddCountRes] = await Promise.allSettled([
            this.demandService.scopeCountRegion(scopes, regionId, regionLevel),
            this.demandService.scopeYearAddCountRegion(scopes, regionId, regionLevel)
        ])
        ctx.body = resSuccess([
            getResponseAllSettledRes(scopeCountRes, []),
            getResponseAllSettledRes(scopeYearAddCountRes, []),
        ]);
    }
}

export default DemandController;