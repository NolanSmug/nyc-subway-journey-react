import './TransferLines.css'

interface TransferLinesProps {
    transfers: string[]
    small?: boolean
    notDim?: boolean
    getTransferLineClicked?: (index: number) => Promise<void> | void
}

function TransferLines({ transfers, small, notDim, getTransferLineClicked }: TransferLinesProps) {
    return (
        <div className={`transfer-lines-container ${small ? 'small' : ''} ${notDim ? 'not-dim' : ''}`}>
            {transfers.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className={`${small ? 'small' : 'transfer-line-image'}`}
                    onClick={() => getTransferLineClicked?.(index)}
                    alt={transfers[index]}
                />
            ))}
        </div>
    )
}

export default TransferLines
