import './UpcomingStationsVertical.css'
import StationFragment from './StationFragment'
import { useEffect, useRef } from 'react'
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
    const lineDividerRef = useRef<HTMLDivElement>(null)

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean = train.getCurrentStationIndex() < 7

            scrollToCurrentStation(currentStationElement, isBelowCenteredScroll)
        }
    }, [currentStation, stations.length, currentID])

    // adjust the line length
    // note: we need custom values for shuttle lines only for this vertical layout. DO NOT TOUCH
    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current && stations.length > 0) {
            lineDividerRef.current.style.width = train.isShuttle() ? `${stations.length * 5}em` : `${stations.length * 6}em`
            lineDividerRef.current.style.top = train.isShuttle() ? '5em' : ''
        }
    }, [train, stations.length, visible])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-vertical-container not-dim">
            <div ref={lineDividerRef} className="line-divider-vertical" />
            <div className="stations-vertical" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
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
