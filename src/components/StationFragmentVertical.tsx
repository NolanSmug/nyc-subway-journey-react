import React from 'react'
import LineSVGs from './LineSVGs'

import './StationFragmentVertical.css'
import { getLineSVGs } from '../logic/LineSVGsMap'
import { Station } from '../logic/StationManager'
import { LineName } from '../logic/LineManager'

export interface StationFragmentVerticalProps {
    station: Station
    className?: string
    transfers: LineName[]
}

const StationFragmentVertical: React.FC<StationFragmentVerticalProps> = ({ station, className, transfers }) => {
    return (
        <div className={`station-frag-vertical-container ${className}`}>
            <div className={`station-dot-container`}>
                <div className={`station-dot-vertical`}></div>
            </div>

            <div className='station-frag-vertical-content'>
                <div className={`station-frag-vertical-info`}>
                    <h2 className={`station-frag-vertical-name`}>{station.getName()}</h2>
                    <div className='transfer-lines'>
                        <LineSVGs small wide svgPaths={getLineSVGs(transfers)} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StationFragmentVertical
