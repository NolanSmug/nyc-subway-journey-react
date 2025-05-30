import React from 'react'
import LineSVGs from './LineSVGs'

import './StationFragment.css'
import { getLineSVGs } from '../logic/LineSVGsMap'
import { Station } from '../logic/StationManager'
import { LineName } from '../logic/LineManager'

export interface StationFragmentProps {
    station: Station
    className?: string
    transfers: LineName[]
}

const StationFragment: React.FC<StationFragmentProps> = ({ station, className, transfers }) => {
    const isOverflowing = station.getName().length > 17 && station.getName().length < 25
    const extraOverflow = station.getName().length >= 25

    return (
        <div
            className={`station-frag-container ${
                isOverflowing ? 'overflow' : extraOverflow ? 'extra-overflow' : ''
            }  ${className} ${station.getName().length}`}
        >
            <div
                className={`station-frag-content ${
                    isOverflowing ? 'overflow' : extraOverflow ? 'extra-overflow' : ''
                } ${className}`}
            >
                <div className='station-frag-info'>
                    <h2 className='station-frag-name'>{station.getName()}</h2>
                    <div className='transfer-lines'>
                        <LineSVGs small transfers={getLineSVGs(transfers)} />
                    </div>
                </div>
            </div>
            <div className='station-dot' />
        </div>
    )
}

export default StationFragment
