import { Response } from '@/types/IData'

export interface IndexServiceImpl {
    hello(msg: string): Response<string>;
}