export default function getBrowserType(): string {
    const userAgent = navigator.userAgent
    if (userAgent.includes('Chrome') && !userAgent.includes('Edge') && !userAgent.includes('OPR')) {
        return 'chrome'
    } else if (userAgent.includes('Firefox')) {
        return 'firefox'
    } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        return 'safari'
    } else {
        return ''
    }
}
