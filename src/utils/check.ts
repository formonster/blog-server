import { Response } from "@/types/IData";

export const isJsonString = (str: string) => {
    try {
        const o = JSON.parse(str)
        return o;
    } catch (error) {
        return false;
    }
}

export const checkResultError = (res: Response<any>) => {
    if (res.code !== 200) return true;
}