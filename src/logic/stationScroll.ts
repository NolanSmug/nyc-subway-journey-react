export function scrollToCurrentStation(currentStationElement: Element | null, isLowIndex?: boolean): () => void {
    if (!currentStationElement) {
        console.warn(`Current station not found.`)
        return () => {}
    }

    const timer = setTimeout(() => {
        currentStationElement.scrollIntoView({
            behavior: 'smooth',
            block: isLowIndex ? 'nearest' : 'center',
            inline: isLowIndex ? undefined : 'center',
        })
    }, 0)

    return () => clearTimeout(timer)
}
