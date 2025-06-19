const timeFormat = (time) => {
    const hours=Math.floor(time/60)
    const minutesrRemainder=time%60
    return `${hours}h ${minutesrRemainder}m`
}
export default timeFormat