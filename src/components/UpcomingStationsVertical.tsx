import './UpcomingStationsVertical.css'
import { useEffect, useRef } from 'react'
import StationFragment from './StationFragment'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

function UpcomingStationsVertical() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train, gameState } = useGameContext()

    const stations = train.getScheduledStops()
    const currentStation = gameState.currentStations[train.getCurrentStationIndex()]
    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station-vertical')
            scrollToCurrentStation(currentStationElement!)
        }
    }, [currentStation, stations.length, currentID])

    // adjust the line length
    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current && stations.length > 0) {
            lineDividerRef.current.style.width = train.isShuttle() ? `${stations.length * 5}em` : `${stations.length * 6}em`
            lineDividerRef.current.style.top = train.isShuttle() ? '5em' : ''
        }
    }, [stations.length, visible])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-vertical-container">
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

function scrollToCurrentStation(currentStationElement: Element): () => void {
    if (currentStationElement) {
        const timer = setTimeout(() => {
            currentStationElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 0) // !DO NOT REMOVE! no idea why "0ms delay" fixes occasional scrolling issues, but it does
        return () => clearTimeout(timer)
    } else {
        console.warn(`Current station not found.`)
    }
    console.warn(`Current station not found.`)
    return () => {}
}

export default UpcomingStationsVertical
