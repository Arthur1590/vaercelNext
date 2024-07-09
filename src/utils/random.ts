export function randInt(start: number, end: number) {
    return Math.floor(Math.random() * (end - start) + start)
}

export function randFloat(start: number, end: number) {
    return Math.random() * (end - start) + start
}
