import './LineInfo.css'
import { LineType } from '../logic/LineManager'

interface LineInfoProps {
    direction: string
    line: string
    type?: LineType
}

function LineInfo({ direction, line, type }: LineInfoProps) {
    return (
        <>
            <div className='LineInfo-container'>
                <h2>{direction}&nbsp;&nbsp;</h2>
                <img src={line} alt={`${line}`} className='line-svg-image' />
                <h2>&nbsp;&nbsp;{type} train</h2>{' '}
            </div>
        </>
    )
}

export default LineInfo
