import { useEffect, useRef } from 'react'
import StationFragmentVertical from './StationFragmentVertical'

import './UpcomingStationsVertical.css'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import { scrollToCurrentStation } from './UpcomingStationsHorizontal'

function UpcomingStationsVertical() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train } = useGameContext()

    const stations = train.getScheduledStops()
    const currentStation = train.getCurrentStation()
    const currentID = currentStation.getId()

    const stationsRef = useRef<HTMLDivElement>(null)

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean = train.getCurrentStationIndex() < 7

            scrollToCurrentStation(currentStationElement, isBelowCenteredScroll)
        }
    }, [train, currentStation, stations.length, currentID])

    if (!stations || stations.length === 0) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className={`upcoming-stations-vertical-container not-dim ${!visible ? 'hidden' : ''}`}>
            <div className="stations-vertical" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragmentVertical
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        className={currentID === station.getId() ? 'current-station-vertical' : ''}
                    />
                ))}
            </div>
        </div>
    )
}

export default UpcomingStationsVertical
