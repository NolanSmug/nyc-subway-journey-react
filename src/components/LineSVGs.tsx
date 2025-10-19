import React from 'react'
import './LineSVGs.css'

import { useUIContext } from '../contexts/UIContext'

interface LineSVGsProps {
    svgPaths: string[]
    small?: boolean // for smaller images like in upcoming stations view
    wide?: boolean // allow more svgs per row
    vertical?: boolean // use column flex-direction
    grouped?: boolean // group svgs as one, 2 per row
    selectable?: boolean
    numLines?: number // if we want to keep the lines centered
    notDim?: boolean
    className?: String
    onTransferSelect?: (index: number) => void | undefined
}

function LineSVGs({ svgPaths, small, wide, vertical, grouped, selectable, numLines, notDim, className, onTransferSelect }: LineSVGsProps) {
    const isTransferMode = useUIContext((state) => state.isTransferMode)

    return (
        <div
            className={`line-svgs-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${grouped ? 'grouped' : ''} ${className} ${selectable ? 'selectable' : ''} ${notDim ? 'not-dim' : ''} ${numLines ? `num-lines-${numLines}` : ''} ${vertical ? 'vertical' : ''}`}
        >
            {svgPaths.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className={`${small ? 'small' : 'line-svg-image'} ${isTransferMode ? 'jiggle-animation' : ''}`}
                    onMouseDown={() => onTransferSelect && onTransferSelect(index)}
                    alt={svgPaths[index]}
                    style={{ animationDelay: `${index * 0.1}s` }} // delay for image jiggle animation
                />
            ))}
        </div>
    )
}

export default React.memo(LineSVGs)
