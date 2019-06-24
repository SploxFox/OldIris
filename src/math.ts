export function lerp(value1:number , value2:number, amount:number): number {
    return (1 - amount) * value1 + amount * value2;
}
/*export function wrapAroundLerp(value1: number, value2: number, amount: number): number {
    return (Math.abs(value1 - value2) > Math.abs(value2 - value1) ? value2 - value1 : value1 - value2) * amount + value1;
}*/
export function wrapAroundLerp(value1: number, value2: number, amount: number, cap: number) {
    //console.log(Math.abs(value1 - value2));
    //console.log(Math.abs(value1 - (value2 - cap)));
    if (Math.abs(value1 - value2) <= Math.abs(value1 - (value2 - cap))) {
        //console.log("Normal Lerp")
        return lerp(value1, value2, amount);
    } else {
        //console.log("Capped Lerp")
        var ans = lerp(value1, value2 - cap, amount)
        return ans > 0 ? ans : ans + cap;
    }
}

(window as any).wrapAroundLerp = wrapAroundLerp;
(window as any).lerp = lerp;