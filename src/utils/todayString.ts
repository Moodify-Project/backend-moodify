export const getTodayDateString = (): string => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
  
    return `${year}-${month}-${day}`;
};

export const getTodayClockString = (utc: number): string => {
    const today = new Date();
    const hours = String(today.getHours() + utc).padStart(2, "0");
    const minutes = String(today.getMinutes()).padStart(2, "0");
    const seconds = String(today.getSeconds()).padStart(2, "0");

    let minusBetweenTime = today.getDate();
    if (today.getHours() + utc >= 0) {
        minusBetweenTime += 1;
    } else {
        minusBetweenTime -= 1;
    }

    const day = String(minusBetweenTime).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

}