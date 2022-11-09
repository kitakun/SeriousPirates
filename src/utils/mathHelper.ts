export const lerp = function (from: number, to: number, lerp: number): number {
    lerp = lerp < 0 ? 0 : lerp;
    lerp = lerp > 1 ? 1 : lerp;
    return from + (to - from) * lerp;
};