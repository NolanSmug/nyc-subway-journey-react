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
        updateCSSProperty('--line-color', lineToLineColor(line))
        updateCSSProperty('--dot-color', lineType === LineType.LOCAL ? '#222' : '#fff')
    }, [line, lineType])
}

export const updateCSSProperty = (property: string, value: string) => {
    document.documentElement.style.setProperty(property, value)
}
