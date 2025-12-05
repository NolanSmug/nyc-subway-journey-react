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
