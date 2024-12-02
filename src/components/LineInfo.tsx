import './LineInfo.css'
import { LineType } from '../logic/EnumManager'

interface LineInfoProps {
    direction: string
    line: string
    type?: LineType
}

function LineInfo({ direction, line, type }: LineInfoProps) {
    return (
        <>
            <div className="LineInfo-container">
                <h2>{direction}&nbsp;&nbsp;</h2>
                <img src={line} alt={`${line}`} className="transfer-line-image" />
                <h2>&nbsp;&nbsp;{type} Train</h2>{' '}
            </div>
        </>
    )
}

export default LineInfo
