import { useUIContext } from '../contexts/UIContext'
import './LineSVGs.css'

interface LineSVGsProps {
    transfers: string[]
    small?: boolean
    wide?: boolean
    notDim?: boolean
    getSVGClicked?: (index: number) => Promise<void> | void
}

function LineSVGs({ transfers, small, wide, notDim, getSVGClicked }: LineSVGsProps) {
    const { isTransferMode } = useUIContext()

    return (
        <div className={`line-svgs-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${notDim ? 'not-dim' : ''}`}>
            {transfers.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className={`${small ? 'small' : 'line-svg-image'} ${isTransferMode ? 'jiggle-animation' : ''}`}
                    onMouseDown={() => getSVGClicked?.(index)}
                    alt={transfers[index]}
                    style={{ animationDelay: `${index * 0.1}s` }} // delay for image jiggle animation
                />
            ))}
        </div>
    )
}

export default LineSVGs
