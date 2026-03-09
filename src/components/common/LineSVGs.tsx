import './LineSVGs.css'
import React from 'react'

import { useUIContext } from '../../contexts/UIContext'

import { getLineSVGs } from '../../logic/LineSVGsMap'
import { LineName } from '../../logic/LineManager'

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
    onTransferSelect?: (index: number) => void | undefined
}

const LineSVGs = React.memo<LineSVGsProps>(
    ({ lines, small, wide, vertical, grouped, disabled, numLines, notDim, focusCurrentLine, className, onTransferSelect }) => {
        const isTransferMode = useUIContext((state) => state.isTransferMode)

        const svgPaths: string[] = getLineSVGs(lines)

        if (focusCurrentLine === LineName.A_LEFFERTS_TRAIN || focusCurrentLine === LineName.A_ROCKAWAY_MOTT_TRAIN) {
            focusCurrentLine = LineName.A_TRAIN
        }
        const currentLineIndex: number | undefined = focusCurrentLine && lines.findIndex((line) => line === focusCurrentLine)

        return (
            <div
                className={`line-svgs-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${grouped ? 'grouped' : ''} ${className} ${disabled ? 'disabled' : ''} ${notDim ? 'not-dim' : ''} ${numLines ? `num-lines-${numLines}` : ''} ${vertical ? 'vertical' : ''}`}
            >
                {svgPaths.map((imageSrc, index) => (
                    <img
                        key={index}
                        src={imageSrc}
                        className={`${small ? 'small' : 'line-svg-image'} ${isTransferMode && !disabled ? 'jiggle-animation' : ''}`}
                        onMouseDown={() => onTransferSelect && onTransferSelect(index)}
                        alt={svgPaths[index]}
                        style={focusCurrentLine && index !== currentLineIndex ? { opacity: 0.33 } : { animationDelay: `${index * 0.1}s` }} // delay for image jiggle animation
                    />
                ))}
            </div>
        )
    }
)

export default LineSVGs
