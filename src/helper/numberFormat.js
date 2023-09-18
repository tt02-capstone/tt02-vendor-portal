export const commaWith2DP = (amt) => {
    let val = Math.round(Number(amt) *100) / 100;
    val = val.toFixed(2);
    let parts = val.toString().split(".");
    let num = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
    return num;
};