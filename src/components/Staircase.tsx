import { LineName } from '../logic/LineManager'
import { getLineSVGs } from '../logic/LineSVGsMap'
import LineSVGs from './LineSVGs'

import './Statircase.css'

export interface StaircaseProps {
    lines: LineName[]
}

function Staircase({ lines }: StaircaseProps) {
    return (
        <div className='staircase-container'>
            <LineSVGs svgPaths={getLineSVGs(lines)} grouped numLines={lines.length} />
            <div className={`staircase`}></div>{' '}
        </div>
    )
}

export default Staircase
