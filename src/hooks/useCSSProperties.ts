import { useEffect } from 'react'
import { LineName, LineType } from '../logic/LineManager'
import { lineToLineColor } from '../logic/LineSVGsMap'

export function useUITheme(darkMode: boolean) {
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode)
    }, [darkMode])
}

export function useLineStyles(line: LineName, lineType: LineType) {
    useEffect(() => {
        document.documentElement.style.setProperty('--line-color', lineToLineColor(line))
        document.documentElement.style.setProperty('--dot-color', lineType === LineType.LOCAL ? '#222' : '#fff')
    }, [line, lineType])
}

export function setPassengerTransitionDuration(duration: number | undefined): void {
    if (duration === undefined) {
        document.documentElement.style.setProperty('--walking-duration', '250ms')
        return
    }

    const durationString: string = `${duration}ms`
    document.documentElement.style.setProperty('--walking-duration', durationString)
}
