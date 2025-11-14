import './UpcomingStationsVertical.css'
import React, { useEffect, useRef } from 'react'

import StationFragmentVertical from '../station/StationFragmentVertical'
import { scrollToCurrentStation } from './UpcomingStationsHorizontal'

import { useTrainContext } from '../../contexts/TrainContext'

function UpcomingStationsVertical() {
    const stationsRef = useRef<HTMLDivElement>(null)

    const stations = useTrainContext((state) => state.train.getScheduledStops())
    const currentStationID = useTrainContext((state) => state.train.getCurrentStation().getId())
    const currentStationIndex = useTrainContext((state) => state.train.getCurrentStationIndex())

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean = currentStationIndex < 7

            scrollToCurrentStation(currentStationElement, isBelowCenteredScroll)
        }
    }, [currentStationIndex, stations.length, currentStationID])

    if (!stations || stations.length === 0) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className='upcoming-stations-vertical-container not-dim'>
            <div className='stations-vertical' ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragmentVertical
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        className={currentStationID === station.getId() ? 'current-station-vertical' : ''}
                    />
                ))}
            </div>
        </div>
    )
}

export default React.memo(UpcomingStationsVertical)
