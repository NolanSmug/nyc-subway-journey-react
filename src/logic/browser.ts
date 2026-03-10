export default function getBrowserType(): string {
    const ua = navigator.userAgent

    if (ua.includes('Firefox')) return 'firefox'
    if (ua.includes('Edg') || ua.includes('Edge')) return 'edge'
    if (ua.includes('OPR')) return 'opera'
    if (ua.includes('Chrome')) return 'chrome'
    if (ua.includes('Safari')) return 'safari'

    console.log(ua)
    return 'other'
}
