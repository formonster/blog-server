import { Response } from "@/types/IData";
import { errorLogger } from "@/utils/logger";

/**
 * 解析经过 allSettled 包装过的 service 返回值
 * @param res allSettled 结果中的元素
 * @param defaultValue 默认值
 */
export const getResponseAllSettledRes = <T>(res: PromiseSettledResult<Response<T>>, defaultValue: T): T => {
    if (res.status === "rejected") {
        errorLogger.error(res.reason);
        return defaultValue
    }
    return res.value.data;
}