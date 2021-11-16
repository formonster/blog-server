export const ago = (days: number) => {
    return new Date().getTime() - 864001000 * days;
}
export const yearAgo = () => {
    return new Date().getTime() - 31536000000;
}
export const monthAgo = () => {
    return new Date().getTime() - 2592000000;
}
/**
 * 毫秒转秒
 * @param ms 毫秒
 * @returns 秒
 */
export const ms2m = (ms: number) => Math.floor(ms / 1000);