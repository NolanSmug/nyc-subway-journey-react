import { useUIContext } from '../contexts/UIContext'
import './LineSVGs.css'

interface LineSVGsProps {
    svgPaths: string[]
    small?: boolean // for smaller images like in upcoming stations view
    wide?: boolean // allow more svgs per row
    grouped?: boolean // group svgs as one, 2 per row
    numLines?: number // if we want to keep the lines centered
    notDim?: boolean
    onTransferSelect?: (index: number) => void | undefined
}

function LineSVGs({ svgPaths, small, wide, grouped, numLines, notDim, onTransferSelect }: LineSVGsProps) {
    const { isTransferMode } = useUIContext()

    return (
        <div
            className={`line-svgs-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${grouped ? 'grouped' : ''} ${notDim ? 'not-dim' : ''} ${numLines} `}
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

export default LineSVGs
