import './UpcomingStationsVertical.css'
import TransferLines from './TransferLines'
import { getTransferImages } from '../logic/TransferImageMap'
import { useEffect, useRef } from 'react'
import { useUIContext } from '../contexts/UIContext'
import { useGameContext } from '../contexts/GameContext'
import React from 'react'

function UpcomingStationsVertical() {
    const { upcomingStationsVisible: visible } = useUIContext()
    const { train } = useGameContext()
    const stations = train.getScheduledStops()
    const currentStation = train.getCurrentStation()
    const stationsRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    // scroll to the current station
    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement: Element | null = stationsRef.current.querySelector('.current-station-vertical')
            const isBelowCenteredScroll: boolean = train.getCurrentStationIndex() < 7
            scrollToCurrentStation(currentStationElement!, isBelowCenteredScroll)
        }
    }, [currentStation, stations.length, currentID])

    if (!stations || stations.length === 0 || !visible) {
        return <div style={{ display: 'none' }} />
    }

    return (
        <div className="upcoming-stations-vertical-container">
            <div className="stations-vertical-wrapper">
                <div className="stations-dots-column">
                    <div className="stations-line-container">
                        {stations.map((station, index) => (
                            <React.Fragment key={station.getId() || index}>
                                <div className="station-dot-container">
                                    <div className={`station-dot ${currentID === station.getId() ? 'current-station' : ''}`} />
                                </div>
                                {/* Always render the connecting line except for the last station */}
                                {index < stations.length - 1 && <div className="station-dot-line" />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                <div className="stations-info-column">
                    {stations.map((station, index) => (
                        <div
                            key={station.getId() || index}
                            className={`station-info-item ${currentID === station.getId() ? 'current-station-vertical' : ''}`}
                        >
                            <div className="station-name-wrapper">
                                <h2 className="station-name">{station.getName()}</h2>
                                <div className="transfer-lines">
                                    <TransferLines small transfers={getTransferImages(station.getTransfers())} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function scrollToCurrentStation(currentStationElement: Element, isLowIndex: boolean): () => void {
    if (currentStationElement) {
        const timer = setTimeout(() => {
            currentStationElement.scrollIntoView({ behavior: 'smooth', block: isLowIndex ? 'nearest' : 'center' })
        }, 0)
        return () => clearTimeout(timer)
    } else {
        console.warn(`Current station not found.`)
    }
    return () => {}
}

export default UpcomingStationsVertical
