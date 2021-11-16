import log4js from "log4js";
import logConfig from '@/config/log'

log4js.configure(logConfig);

export const resLogger = log4js.getLogger('res');
export const reqLogger = log4js.getLogger('req');
export const errorLogger = log4js.getLogger('error');
export const consoleLogger = log4js.getLogger();
