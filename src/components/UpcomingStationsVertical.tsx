import './UpcomingStationsVertical.css'
import StationFragment from './StationFragment'
import { useEffect, useRef } from 'react'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

function UpcomingStationsVertical() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train } = useGameContext()

    const stations = train.getScheduledStops()
    const currentStation = train.getCurrentStation()
    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean = train.getCurrentStationIndex() < 7

            scrollToCurrentStation(currentStationElement!, isBelowCenteredScroll)
        }
    }, [currentStation, stations.length, currentID])

    // adjust the line length
    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current && stations.length > 0) {
            lineDividerRef.current.style.width = train.isShuttle() ? `${stations.length * 5}em` : `${stations.length * 6}em`
            lineDividerRef.current.style.top = train.isShuttle() ? '5em' : ''
        }
    }, [stations.length, visible, train])

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

function scrollToCurrentStation(currentStationElement: Element, isLowIndex: boolean): () => void {
    if (currentStationElement) {
        const timer = setTimeout(() => {
            currentStationElement.scrollIntoView({ behavior: 'smooth', block: isLowIndex ? 'nearest' : 'center' })
        }, 0) // !DO NOT REMOVE! no idea why "0ms delay" fixes occasional scrolling issues, but it does
        return () => clearTimeout(timer)
    } else {
        console.warn(`Current station not found.`)
    }
    console.warn(`Current station not found.`)
    return () => {}
}

export default UpcomingStationsVertical
