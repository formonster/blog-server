let path = require('path');

// 日志根目录
let baseLogPath = path.resolve(__dirname, '../../logs');

// 错误日志目录
let errorPath = '/error';
// 错误日志文件名
let errorFileName = 'error';
// 错误日志输出完整路径
let errorLogPath = baseLogPath + errorPath + '/' + errorFileName;

// 请求日志目录
let reqPath = '/request';
// 请求日志文件名
let reqFileName = 'request';
// 请求日志输出完整路径
let reqLogPath = baseLogPath + reqPath + '/' + reqFileName;

export default {
    // 日志格式等设置
    appenders:
    {
        console: {
            type: 'console'
        },
        error: {
            type: 'dateFile',
            filename: errorLogPath,
            pattern: '-yyyy-MM-dd-hh.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 1000,
            numBackups: 3,
            path: errorPath,
            layout: {
                type: 'basic'
            }
        },
        req: {
            type: 'dateFile',
            filename: reqLogPath,
            pattern: '-yyyy-MM-dd-hh.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 1000,
            numBackups: 3,
            path: reqPath,
            layout: {
                type: 'basic'// 'messagePassThrough'
            }
        },
        res: {
            type: 'dateFile',
            filename: reqLogPath,
            pattern: '-yyyy-MM-dd-hh.log',
            alwaysIncludePattern: true,
            encoding: 'utf-8',
            maxLogSize: 1000,
            numBackups: 3,
            path: reqPath,
            layout: {
                type: 'basic'
            }
        }
    },
    // 供外部调用的名称和对应设置定义
    categories: {
        default: {
            appenders: ['console'], level: 'all'
        },
        res: {
            appenders: ['res'], level: 'info'
        },
        error: {
            appenders: ['error'], level: 'error'
        },
        req: {
            appenders: ['req'], level: 'info'
        }
    },
    baseLogPath,
    replaceConsole: true
}