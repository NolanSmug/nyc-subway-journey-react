import React, { useState } from 'react'
import TransferLines from './TransferLines'
import { getTransferImages } from '../logic/TransferImageMap'
import { Station } from '../logic/StationManager'
import { LineName } from '../logic/EnumManager'
import './StationFragment.css'

export interface StationFragmentProps {
    station: Station
    className?: string
    transfers: LineName[]
}

const StationFragment: React.FC<StationFragmentProps> = ({ station, className, transfers }) => {
    const [isOverflowing] = useState(station.getName().length > 12)

    return (
        <div className={`station-frag-container ${isOverflowing ? 'overflow' : ''} ${className}`}>
            <div className={`station-frag-content ${isOverflowing ? 'overflow' : ''} ${className}`}>
                <div className="station-info">
                    <h2 className="station-frag-name">{station.getName()}</h2>
                    <div className="transfer-lines">
                        <TransferLines small transfers={getTransferImages(transfers)} />
                    </div>
                </div>
            </div>
            <div className="station-dot" />
        </div>
    )
}

export default StationFragment
