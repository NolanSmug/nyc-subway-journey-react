import { useEffect, useRef } from 'react'
import { UpcomingStationsProps } from './UpcomingStations'
import StationFragment from './StationFragment'

import './UpcomingStationsVertical.css'
import { useUIContext } from '../contexts/UIContext'

function UpcomingStationsVertical({ stations, currentStation, visible }: UpcomingStationsProps) {
    const { currentLineColor } = useUIContext()
    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station-vertical')

            scrollToCurrentStation(currentStationElement!)
        }
    }, [currentStation, stations.length, currentID])

    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current) {
            if (stations.length > 0) {
                lineDividerRef.current.style.width = `${stations.length * 6}em`
            }
        }
    }, [stations.length, visible])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-vertical-container">
            <div ref={lineDividerRef} className="line-divider-vertical" style={{ backgroundColor: currentLineColor }} />
            <div className="stations-vertical" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        lineColor={currentLineColor}
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
