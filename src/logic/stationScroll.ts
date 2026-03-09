import getBrowserType from '../logic/browser'

export function scrollToCurrentStation(currentStationElement: Element | null, isLowIndex?: boolean): () => void {
    if (!currentStationElement) {
        console.warn(`Current station not found.`)
        return () => {}
    }

    const isChrome = getBrowserType() === 'chrome'

    const timer = setTimeout(
        () => {
            currentStationElement.scrollIntoView({
                behavior: 'smooth',
                block: isLowIndex ? 'nearest' : 'center',
                inline: isLowIndex ? undefined : 'center',
            })
        },
        isChrome ? 50 : 0 // no idea why "0ms delay" fixes occasional scrolling issues, but it does. Do not remove.
    )

    return () => clearTimeout(timer)
}
