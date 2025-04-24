import { useUIContext } from '../contexts/UIContext'
import './TransferLines.css'

interface TransferLinesProps {
    transfers: string[]
    small?: boolean
    wide?: boolean
    notDim?: boolean
    getTransferLineClicked?: (index: number) => Promise<void> | void
}

function TransferLines({ transfers, small, wide, notDim, getTransferLineClicked }: TransferLinesProps) {
    const { isTransferMode } = useUIContext()

    return (
        <div className={`transfer-lines-container ${small ? 'small' : ''} ${wide ? 'wide' : ''} ${notDim ? 'not-dim' : ''}`}>
            {transfers.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className={`${small ? 'small' : 'transfer-line-image'} ${isTransferMode ? 'jiggle-animation' : ''}`}
                    onMouseDown={() => getTransferLineClicked?.(index)}
                    alt={transfers[index]}
                    style={{ animationDelay: `${index * 0.1}s` }} // delay for image jiggle animation
                />
            ))}
        </div>
    )
}

export default TransferLines
