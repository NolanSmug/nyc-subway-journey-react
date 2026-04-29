import './UpcomingStationsHorizontal.css'
import { useEffect, useRef } from 'react'

import StationFragment from '../station/StationFragment'
import { useTrainContext } from '../../contexts/TrainContext'
import { scrollToCurrentStation } from '../../logic/stationScroll'

// TODO: Borough barrier

function UpcomingStationsHorizontal() {
    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)

    const stations = useTrainContext((state) => state.train.getScheduledStops())
    const currentStationID = useTrainContext((state) => state.train.getCurrentStation().getId())
    const currentStationIndex = useTrainContext((state) => state.train.getCurrentStationIndex())

    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station')
            return scrollToCurrentStation(currentStationElement)
        }
    }, [currentStationIndex, stations.length, currentStationID])

    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current) {
            const stationsWidth = stationsRef.current.scrollWidth
            if (stationsWidth > 0) {
                lineDividerRef.current.style.width = `${stationsWidth}px`
            }
        }
    }, [stations.length])

    if (!stations || stations.length === 0) {
        return null
    }

    return (
        <div className='upcoming-stations-horizontal-container not-dim'>
            <div className='stations-horizontal' ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        isCurrent={currentStationID === station.getId()}
                    />
                ))}
            </div>
            <div ref={lineDividerRef} className='line-divider' />
        </div>
    )
}

export default UpcomingStationsHorizontal
