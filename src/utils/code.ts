import svgCaptcha from 'svg-captcha';
import codeConfig from '@/config/code';

export const createCode = () => svgCaptcha.create(codeConfig);
export const createMathExpr = () => svgCaptcha.createMathExpr(codeConfig);