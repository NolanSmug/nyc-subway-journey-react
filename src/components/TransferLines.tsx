import { LineName } from '../logic/Line'
import './TransferLines.css'

interface TransferLinesProps {
    transfers: string[]
    small?: boolean
    onClick?: (index: number) => Promise<void> | void
}

function TransferLines({ transfers, small, onClick }: TransferLinesProps) {
    return (
        <div className={`transfer-lines-container ${small ? 'small' : ''}`}>
            {transfers.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className={`${small ? 'small' : 'transfer-line-image'}`}
                    onClick={() => onClick?.(index)}
                    id={String(index)}
                />
            ))}
        </div>
    )
}

export default TransferLines
