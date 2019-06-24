export function lerp(value1:number , value2:number, amount:number): number {
    return (1 - amount) * value1 + amount * value2;
}
/*export function wrapAroundLerp(value1: number, value2: number, amount: number): number {
    return (Math.abs(value1 - value2) > Math.abs(value2 - value1) ? value2 - value1 : value1 - value2) * amount + value1;
}*/

/**
 * A linear interpolation (lerp) function that wraps around. Used for rotations and stuff where the lerp must wrap around.
 * @param value1 The first starting value.
 * @param value2 The second ending value.
 * @param alpha The value to interpolate to between the two values.
 * @param cap The point where the linear interpolation should wrap around at.
 */
export function wrapAroundLerp(value1: number, value2: number, alpha: number, cap: number) {
    //console.log(value1 / Math.PI);
    //console.log(Math.abs(value1 - value2));
    //console.log(Math.abs(value1 - (value2 - cap)));
    if (Math.abs(value1 - (value2 + cap)) < Math.abs(value1 - value2)) {
        var ans = lerp(value1, value2 + cap, alpha);
        return ans < cap ? ans : cap - ans;
    } else if (Math.abs(value1 - value2) > Math.abs(value1 - (value2 - cap))) {
        var ans = lerp(value1, value2 - cap, alpha)
        return ans > 0 ? ans : ans + cap;
    } else {
        return lerp(value1, value2, alpha);
    }
}

(window as any).wrapAroundLerp = wrapAroundLerp;
(window as any).lerp = lerp;