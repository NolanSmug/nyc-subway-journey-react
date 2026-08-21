import './LineSVGs.css'
import { memo } from 'react'

import { useUIContext } from '../../contexts/UIContext'

import { getLineSVGs } from '../../logic/LineSVGsMap'
import { LineName } from '../../logic/LineManager'

const LONG_LINE_COUNT = 5
const LOTS_LINE_COUNT = 8

interface LineSVGsProps {
    lines: LineName[]
    small?: boolean // for smaller images like in upcoming stations view
    wide?: boolean // allow more svgs per row
    vertical?: boolean // use column flex-direction
    grouped?: boolean // group svgs as one, 2 per row
    disabled?: boolean
    numLines?: number // if we want to keep the lines centered
    notDim?: boolean
    focusCurrentLine?: LineName
    className?: string
    onTransferSelect?: (index: number) => void
}

const LineSVGs = memo<LineSVGsProps>(
    ({ lines, small, wide, vertical, grouped, disabled, numLines, notDim, focusCurrentLine, className, onTransferSelect }) => {
        const isTransferMode = useUIContext((state) => state.isTransferMode)

        const long = lines.length >= LONG_LINE_COUNT
        const lots = lines.length >= LOTS_LINE_COUNT

        const selectable = !disabled && onTransferSelect !== undefined

        const svgPaths: string[] = getLineSVGs(lines)

        if (focusCurrentLine === LineName.A_LEFFERTS_TRAIN || focusCurrentLine === LineName.A_ROCKAWAY_MOTT_TRAIN) {
            focusCurrentLine = LineName.A_TRAIN
        }
        const currentLineIndex: number | undefined = focusCurrentLine && lines.findIndex((line) => line === focusCurrentLine)

        return (
            <div
                className={`line-svgs-container 
                    ${small ? 'small-lines' : ''} 
                    ${wide ? 'wide' : ''} 
                    ${grouped ? 'grouped' : ''} 
                    ${className ?? ''} 
                    ${selectable ? 'selectable' : ''}
                    ${disabled ? 'disabled' : ''} 
                    ${notDim ? 'not-dim' : ''} 
                    ${numLines ? `num-lines-${numLines}` : ''} 
                    ${vertical ? 'vertical' : ''} 
                    ${long ? 'long' : ''} 
                    ${lots ? 'lots' : ''}`}
            >
                {svgPaths.map((imageSrc, index) => (
                    <img
                        key={index}
                        src={imageSrc}
                        className={`line-svg-image ${small ? 'small-line-svg' : ''} ${
                            isTransferMode && selectable ? 'jiggle-animation' : ''
                        }`}
                        onPointerDown={selectable ? () => onTransferSelect?.(index) : undefined}
                        alt={svgPaths[index]}
                        style={focusCurrentLine && index !== currentLineIndex ? { opacity: 0.33 } : { animationDelay: `${index * 0.1}s` }}
                        draggable={false}
                    />
                ))}
            </div>
        )
    }
)

export default LineSVGs
