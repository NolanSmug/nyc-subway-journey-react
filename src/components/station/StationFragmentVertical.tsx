import './StationFragmentVertical.css'
import React from 'react'

import LineSVGs from '../LineSVGs'

import { getLineSVGs } from '../../logic/LineSVGsMap'
import { StationFragmentProps } from './StationFragment'

const StationFragmentVertical: React.FC<StationFragmentProps> = ({ station, className, transfers }) => {
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
