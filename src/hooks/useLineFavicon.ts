import { useLayoutEffect } from 'react'
import { useTrainContext } from '../contexts/TrainContext'
import { getLineSVG } from '../logic/LineSVGsMap'
import { LineName } from '../logic/LineManager'

export function useLineFavicon() {
    const currentLine = useTrainContext((state) => state.train.getLine())

    useLayoutEffect(() => {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement
        if (!link) {
            link = document.createElement('link')
            link.rel = 'icon'
            document.getElementsByTagName('head')[0].appendChild(link)
        }

        const faviconUrl = getLineSVG(currentLine)

        if (currentLine !== LineName.NULL_TRAIN && faviconUrl) {
            link.href = faviconUrl
        } else {
            link.href = '/favicon.ico'
        }
    }, [currentLine])
}
