import { Response } from '@/types/IData';
import { resSuccess } from '@/utils/common';
import { IndexServiceImpl } from './IndexServiceImpl'

class IndexService implements IndexServiceImpl {
    hello(msg: string): Response<string> {
        return resSuccess(msg)
    }
}

export default IndexService;