import React, { useEffect, useRef, useState } from 'react'
import TransferLines from './TransferLines'
import { getTransferImages } from '../logic/TransferImageMap'
import { Station } from '../logic/StationManager'
import { LineName } from '../logic/Line'
import './StationFragment.css'

export interface StationFragmentProps {
    station: Station
    className?: string
    transfers: LineName[]
    lineColor: string
}

const StationFragment: React.FC<StationFragmentProps> = ({ station, className, transfers, lineColor }) => {
    const nameRef = useRef<HTMLHeadingElement | null>(null)
    const [isOverflowing, setIsOverflowing] = useState(station.getName().length > 12)

    useEffect(() => {
        if (nameRef.current) {
            const textLengthCheck = station.getName().length > 12
            const actualOverflowCheck = nameRef.current.scrollWidth > nameRef.current.clientWidth
            setIsOverflowing(textLengthCheck || actualOverflowCheck)
        }
    }, [station])

    return (
        <div className={`station-frag-container ${isOverflowing ? 'overflow' : ''} ${className}`}>
            <div className={`station-frag-content ${isOverflowing ? 'overflow' : ''} ${className}`}>
                <h2 className="station-frag-name">{station.getName()}</h2>
                <div className="transfer-lines">
                    <TransferLines small transfers={getTransferImages(transfers)} />
                </div>
            </div>
            <div className="station-dot" style={{ borderColor: lineColor }} />
        </div>
    )
}

export default StationFragment
