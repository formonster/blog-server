import ResultServiceImpl from "@/service/ResultServiceImpl";
import { GET, route } from "awilix-koa";
import Router from "@koa/router";
import DemandServiceImpl from "@/service/DemandServiceImpl";
import UserServiceImpl from "@/service/UserServiceImpl";
import { resSuccess } from "@/utils/common";
import { getResponseAllSettledRes } from "@/utils/promise";

type Service = {
    resultService: ResultServiceImpl;
    demandService: DemandServiceImpl;
    userService: UserServiceImpl;
}

@route('/api/public/bigdata')
class BaseController {
    private resultService: ResultServiceImpl;
    private demandService: DemandServiceImpl;
    private userService: UserServiceImpl;
    constructor({ resultService, demandService, userService }: Service) {
        this.resultService = resultService;
        this.demandService = demandService;
        this.userService = userService;
    }
    /**
     * 查询顶部的统计数据（海智平台）
     */
    @route('/statisticsHZ')
    @GET()
    async statistics(ctx: Router.RouterContext) {

        const { where } = ctx.request.body as any

        const _where = {
            ...where,
            platform: "HZ"
        }

        const [
            resultTotalCount, resultYearAddCount, resultMouthAddCount,
            demandTotalCount, demandYearAddCount, demandMouthAddCount,
            userTotalCount
        ] = await Promise.allSettled([
            this.resultService.totalCount(_where),
            this.resultService.yearAddCount(_where),
            this.resultService.mouthAddCount(_where),
            this.demandService.totalCount(_where),
            this.demandService.yearAddCount(_where),
            this.demandService.mouthAddCount(_where),
            this.userService.totalCount(_where),
        ])
        // 返回成果
        ctx.body = resSuccess({
            result: {
                total: getResponseAllSettledRes(resultTotalCount, 0),
                yearAdd: getResponseAllSettledRes(resultYearAddCount, 0),
                mouthAdd: getResponseAllSettledRes(resultMouthAddCount, 0),
            },
            demand: {
                total: getResponseAllSettledRes(demandTotalCount, 0),
                yearAdd: getResponseAllSettledRes(demandYearAddCount, 0),
                mouthAdd: getResponseAllSettledRes(demandMouthAddCount, 0)
            },
            user: {
                total: getResponseAllSettledRes(userTotalCount, 0)
            }
        });
    }
}

export default BaseController;