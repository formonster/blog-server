import { Response } from '@/types/IData';
import BaseService from './BaseService';
import ALiCloudServiceImpl from './ALiCloudServiceImpl'
import { resError, resSuccess } from '@/utils/common';
import Core from '@alicloud/pop-core'

var client = new Core({
    accessKeyId: 'LTAIuByeTMkgpO3c',
    accessKeySecret: 'l6VaKOOQG4ce7MQpifvX55JvG0NfiS',
    endpoint: 'https://dysmsapi.aliyuncs.com',
    apiVersion: '2017-05-25'
});

// 注册短信模板编号
const TEMPLATE_CODE_CODE = "SMS_150496120";

class ALiCloudService extends BaseService implements ALiCloudServiceImpl {
    sendCode(recipient: string, code: string): Promise<Response<unknown>> {
        var params = {
            "PhoneNumbers": recipient,
            "SignName": "天合育成",
            "TemplateCode": TEMPLATE_CODE_CODE,
            "TemplateParam": `{\"code\":\"${code}\"}`
        };

        return new Promise(function (resolve, reject) {
            client.request('SendSms', params, {
                method: 'POST'
            }).then((result) => {
                resolve(resSuccess(result));
            }, (err) => {
                reject(resError(err));
            })
        })
    }
}

export default ALiCloudService;