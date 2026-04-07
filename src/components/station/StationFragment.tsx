import './StationFragment.css'
import { memo } from 'react'

import LineSVGs from '../common/LineSVGs'

import { Station } from '../../logic/StationManager'
import { LineName } from '../../logic/LineManager'

export interface StationFragmentProps {
    station: Station
    isCurrent: boolean
    transfers: LineName[]
}

const StationFragment = ({ station, isCurrent, transfers }: StationFragmentProps) => {
    const trueLength: number = station.getName().length + transfers.length
    const isOverflowing = trueLength >= 17 && trueLength < 25
    const extraOverflow = trueLength >= 25

    return (
        <div
            className={`station-frag-container ${
                isOverflowing ? 'overflow' : extraOverflow ? 'extra-overflow' : ''
            }  ${isCurrent ? 'current-station' : ''}`}
        >
            <div className={`station-frag-content ${isOverflowing ? 'overflow' : extraOverflow ? 'extra-overflow' : ''}`}>
                <div className='station-frag-info'>
                    <h2 className={`station-frag-name`}>{station.getName()}</h2>
                    <div className='transfer-lines'>
                        <LineSVGs lines={transfers} small />
                    </div>
                </div>
            </div>
            <div className='station-dot' />
        </div>
    )
}

export default memo(StationFragment)
