/**
 * 首字母大写
 * @param str 字符串
 */
export const firstChar2UpperCase = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * 转化字符串
 * @param str 字符串
 * @param split 分隔符
 * @example firstChar2UpperCaseSplit("aaa_bbb_cc", "_"); // AaaBbbCc
 * @returns 驼峰形式的字符串
 */
export const firstChar2UpperCaseSplit = (str: string, split: string) => {
    return str.split(split).map(firstChar2UpperCase).join("");
}