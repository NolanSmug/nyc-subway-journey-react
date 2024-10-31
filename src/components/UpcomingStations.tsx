import { LineName } from '../logic/Line'
import { Station as StationType } from '../logic/StationManager'
import StationFragment from './StationFragment'
import { useEffect, useRef } from 'react'
import './UpcomingStations.css'

export interface UpcomingStationsProps {
    stations: StationType[]
    currentStation: StationType
    line: LineName
}

const lineColorMap: { [key in LineName]: string } = {
    [LineName.NULL_TRAIN]: '',
    [LineName.ONE_TRAIN]: '#EE352E',
    [LineName.TWO_TRAIN]: '#EE352E',
    [LineName.THREE_TRAIN]: '#EE352E',
    [LineName.FOUR_TRAIN]: '#00933C',
    [LineName.FIVE_TRAIN]: '#00933C',
    [LineName.SIX_TRAIN]: '#00933C',
    [LineName.SEVEN_TRAIN]: '#B933AD',
    [LineName.A_TRAIN]: '#0039A6',
    [LineName.A_ROCKAWAY_MOTT_TRAIN]: '#0039A6',
    [LineName.A_LEFFERTS_TRAIN]: '#0039A6',
    [LineName.C_TRAIN]: '#0039A6',
    [LineName.E_TRAIN]: '#0039A6',
    [LineName.B_TRAIN]: '#FF6319',
    [LineName.D_TRAIN]: '#FF6319',
    [LineName.F_TRAIN]: '#FF6319',
    [LineName.M_TRAIN]: '#FF6319',
    [LineName.N_TRAIN]: '#FCCC0A',
    [LineName.Q_TRAIN]: '#FCCC0A',
    [LineName.R_TRAIN]: '#FCCC0A',
    [LineName.W_TRAIN]: '#FCCC0A',
    [LineName.J_TRAIN]: '#996633',
    [LineName.Z_TRAIN]: '#996633',
    [LineName.G_TRAIN]: '#6CBE45',
    [LineName.L_TRAIN]: '#A7A9AC',
    [LineName.S_TRAIN]: '#808183',
    [LineName.S_TRAIN_SHUTTLE]: '#808183',
    [LineName.S_TRAIN_ROCKAWAY]: '#808183',
}

function lineToLineColor(lineName: LineName): string {
    return lineColorMap[lineName]
}

function UpcomingStations({ stations, currentStation, line }: UpcomingStationsProps) {
    const lineColor = lineToLineColor(line)
    const stationsRef = useRef<HTMLDivElement>(null)
    const lineDividerRef = useRef<HTMLDivElement>(null)
    const currentID = currentStation.getId()

    useEffect(() => {
        if (stationsRef.current && stations.length > 0) {
            const currentStationElement = stationsRef.current.querySelector('.current-station')

            if (currentStationElement) {
                currentStationElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
            } else {
                console.warn(`Current station with ID ${currentID} not found.`)
            }
        }
    }, [currentStation, stations.length, currentID])

    useEffect(() => {
        if (stationsRef.current && lineDividerRef.current) {
            const stationsWidth = stationsRef.current.scrollWidth
            lineDividerRef.current.style.width = `${stationsWidth}px`
        }
    }, [stations.length])

    if (!stations || stations.length === 0) {
        return null
    }

    return (
        <div className="upcoming-stations-container">
            <div className="stations" ref={stationsRef}>
                {stations.map((station, index) => (
                    <StationFragment
                        key={station.getId() || index}
                        station={station}
                        transfers={station.getTransfers()}
                        lineColor={lineColor}
                        className={currentID === station.getId() ? 'current-station' : ''}
                    />
                ))}
            </div>
            <div ref={lineDividerRef} className="line-divider" style={{ backgroundColor: lineColor }} />
        </div>
    )
}

export default UpcomingStations
