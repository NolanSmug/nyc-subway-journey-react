import './LineSVGs.css'
import React from 'react'

import { useUIContext } from '../../contexts/UIContext'

interface LineSVGsProps {
    svgPaths: string[]
    small?: boolean // for smaller images like in upcoming stations view
    wide?: boolean // allow more svgs per row
    vertical?: boolean // use column flex-direction
    grouped?: boolean // group svgs as one, 2 per row
    disabled?: boolean
    numLines?: number // if we want to keep the lines centered
    notDim?: boolean
    className?: String
    onTransferSelect?: (index: number) => void | undefined
}
const LineSVGs = React.memo<LineSVGsProps>(
    ({ svgPaths, small, wide, vertical, grouped, disabled, numLines, notDim, className, onTransferSelect }) => {
        const isTransferMode = useUIContext((state) => state.isTransferMode)

        return (
            <div
                className={`line-svgs-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${grouped ? 'grouped' : ''} ${className} ${disabled ? 'disabled' : ''} ${notDim ? 'not-dim' : ''} ${numLines ? `num-lines-${numLines}` : ''} ${vertical ? 'vertical' : ''}`}
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
)

export default LineSVGs
