import { LineName } from '../logic/Line'
import './TransferLines.css'

interface TransferLinesProps {
    transfers: string[]
    onClick?: (index: number) => Promise<void> | void // Update type to allow Promise
}

function TransferLines({ transfers, onClick }: TransferLinesProps) {
    return (
        <div className={`transfer-lines-container`}>
            {transfers.map((imageSrc, index) => (
                <img
                    key={index}
                    src={imageSrc}
                    className="transfer-line-image"
                    onClick={() => onClick?.(index)}
                    id={String(index)}
                />
            ))}
        </div>
    )
}

export default TransferLines
