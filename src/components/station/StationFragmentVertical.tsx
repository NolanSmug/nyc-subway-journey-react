import './StationFragmentVertical.css'
import React from 'react'

import LineSVGs from '../common/LineSVGs'

import { StationFragmentProps } from './StationFragment'

const StationFragmentVertical: React.FC<StationFragmentProps> = ({ station, isCurrent, transfers }) => {
    return (
        <div className={`station-frag-vertical-container ${isCurrent ? 'current-station-vertical' : ''}`}>
            <div className={`station-dot-container`}>
                <div className={`station-dot-vertical`}></div>
            </div>

            <div className='station-frag-vertical-content'>
                <div className={`station-frag-vertical-info`}>
                    <h2 className={`station-frag-vertical-name`}>{station.getName()}</h2>
                    <div className='transfer-lines'>
                        <LineSVGs lines={transfers} small wide />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StationFragmentVertical
