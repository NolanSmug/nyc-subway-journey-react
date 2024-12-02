import './UpcomingStationsHorizontal.css'
import StationFragment from './StationFragment'
import { useEffect, useRef } from 'react'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'

// TODO: Borough barrier
function UpcomingStationsHorizontal() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train } = useGameContext()
    const stations = train.getScheduledStops()
    const currentStation = train.getCurrentStation()

    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station')
            scrollToCurrentStation(currentStationElement!)
        }
    }, [currentStation, stations.length, currentID])

    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current) {
            const stationsWidth = stationsRef.current.scrollWidth
            if (stationsWidth > 0) {
                lineDividerRef.current.style.width = `${stationsWidth}px`
            }
        }
    }, [stations.length, visible])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-horizontal-container not-dim">
            <div className="stations-horizontal" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        className={currentID === station.getId() ? 'current-station' : ''}
                    />
                ))}
            </div>
            <div ref={lineDividerRef} className="line-divider" />
        </div>
    )
}

function scrollToCurrentStation(currentStationElement: Element): () => void {
    if (currentStationElement) {
        const timer = setTimeout(() => {
            currentStationElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'end' })
        }, 0) // !DO NOT REMOVE! no idea why "0ms delay" fixes occasional scrolling issues, but it does
        return () => clearTimeout(timer)
    } else {
        console.warn(`Current station not found.`)
    }
    console.warn(`Current station not found.`)
    return () => {}
}

export default UpcomingStationsHorizontal
