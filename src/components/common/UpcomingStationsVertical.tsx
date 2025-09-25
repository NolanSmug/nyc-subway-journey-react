import { useEffect, useRef } from 'react'
import './UpcomingStationsVertical.css'

import StationFragmentVertical from '../station/StationFragmentVertical'
import { scrollToCurrentStation, UpcomingStationsProps } from './UpcomingStationsHorizontal'

function UpcomingStationsVertical({ stations, currentStationID, currentStationIndex }: UpcomingStationsProps) {
    const stationsRef = useRef<HTMLDivElement>(null)

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean | undefined = currentStationIndex !== undefined && currentStationIndex < 7

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

export default UpcomingStationsVertical
